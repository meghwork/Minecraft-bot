const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('AFK bot is alive!'));
app.listen(3000, () => console.log('Web server running on port 3000'));

function createBot() {
  const bot = mineflayer.createBot({
    host: 'BeastSMP-java.aternos.me',
    port: 17030,
    username: 'bot_',
    version: '1.12'
  });

  bot.loadPlugin(pathfinder);

  bot.once('spawn', () => {
    console.log('AFK bot joined Aternos server');

    const mcData = require('minecraft-data')(bot.version);
    const defaultMove = new Movements(bot, mcData);
    bot.pathfinder.setMovements(defaultMove);

    bot.on('chat', (username, message) => {
      if (username === bot.username) return;

      if (message === 'follow me') {
        const player = bot.players[username]?.entity;
        if (player) {
          bot.chat(`Following ${username}`);
          const goal = new goals.GoalFollow(player, 1);
          bot.pathfinder.setGoal(goal, true);
        } else {
          bot.chat("Can't see you!");
        }
      }

      if (message === 'stop') {
        bot.chat('Okay, stopping.');
        bot.pathfinder.setGoal(null);
      }
    });
  });

  bot.on('end', () => {
    console.log('Bot disconnected. Reconnecting in 10s...');
    setTimeout(createBot, 10000);
  });

  bot.on('error', err => {
    console.log('Bot error:', err);
  });
}

createBot();
