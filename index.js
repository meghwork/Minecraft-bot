const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const express = require('express');
const app = express();

// Keep-alive web server
app.get('/', (req, res) => res.send('AFK bot is alive!'));
app.listen(3000, () => console.log('Web server running on port 3000'));

function createBot() {
  const bot = mineflayer.createBot({
    host: 'BeastSMP-java.aternos.me',
    port: 17030,
    username: 'Binod_op',
    version: '1.12' // You can use false if you want auto-detect
  });

  bot.loadPlugin(pathfinder);

  bot.once('spawn', () => {
    console.log('Bot joined the server!');
    const mcData = require('minecraft-data')(bot.version);
    const defaultMove = new Movements(bot, mcData);
    bot.pathfinder.setMovements(defaultMove);

    // Commands
    bot.on('chat', (username, message) => {
      if (username === bot.username) return;

      if (message === 'follow me') {
        const target = bot.players[username]?.entity;
        if (!target) return bot.chat("I can't see you!");

        bot.chat(`Following ${username}`);
        const goal = new goals.GoalFollow(target, 1);
        bot.pathfinder.setGoal(goal, true);
      }

      if (message === 'stop') {
        bot.chat('Okay, I stopped.');
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
