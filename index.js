const mineflayer = require('mineflayer');
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
    version: '1.12', // Aternos is 1.12 as you mentioned
    auth: 'offline' // Important if server is cracked (non-premium)
  });

  bot.once('spawn', () => {
    console.log('AFK bot joined the server');

    // Delay before actions to prevent early disconnection
    setTimeout(() => {
      console.log('Starting random actions');
      startRandomActions(bot);
    }, 5000);
  });

  bot.on('end', () => {
    console.log('Bot was disconnected. Reconnecting in 30s...');
    setTimeout(createBot, 30000);
  });

  bot.on('kicked', (reason) => {
    console.log('Bot was kicked:', reason);
  });

  bot.on('error', err => {
    console.log('Bot error:', err);
  });
}

function startRandomActions(bot) {
  const movements = ['forward', 'back', 'left', 'right'];

  setInterval(() => {
    movements.forEach(move => {
      bot.setControlState(move, Math.random() < 0.5);
    });
    bot.setControlState('jump', Math.random() < 0.3);
    bot.setControlState('sneak', Math.random() < 0.3);
  }, 2000);
}

createBot();
