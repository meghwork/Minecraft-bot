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
    version: '1.12' // Or false for auto
  });

  bot.once('spawn', () => {
    console.log('AFK bot joined the server');
    startRandomActions(bot);
  });

  bot.on('end', () => {
    console.log('Bot disconnected. Reconnecting in 10s...');
    setTimeout(createBot, 10000);
  });

  bot.on('error', err => {
    console.log('Bot error:', err);
  });
}

function startRandomActions(bot) {
  const movements = ['forward', 'back', 'left', 'right'];

  setInterval(() => {
    // Random movement
    movements.forEach(move => {
      bot.setControlState(move, Math.random() < 0.5);
    });

    // Random jump
    bot.setControlState('jump', Math.random() < 0.3);

    // Random sneak
    bot.setControlState('sneak', Math.random() < 0.3);
  }, 2000); // every 2 seconds
}

createBot();
