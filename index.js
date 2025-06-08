const mineflayer = require('mineflayer');
const express = require('express');
const app = express();

// 🌐 Keep-alive web server (for Render)
app.get('/', (req, res) => res.send('AFK bot is alive!'));
app.listen(3000, () => console.log('🌐 Web server running on port 3000'));

// Prevent app from sleeping (Render)
setInterval(() => {}, 1000);

// Global error catcher to prevent crash
process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Error:', err);
});

function startRandomActions(bot) {
  const movements = ['forward', 'back', 'left', 'right'];

  function randomLook() {
    const yaw = Math.random() * Math.PI * 2;
    const pitch = (Math.random() - 0.5) * Math.PI / 3;
    bot.look(yaw, pitch, true);
  }

  function performActions() {
    movements.forEach(move => {
      bot.setControlState(move, Math.random() < 0.7); // 70% chance to walk
    });

    bot.setControlState('jump', Math.random() < 0.5);  // 50% jump
    bot.setControlState('sneak', Math.random() < 0.1); // 10% sneak

    randomLook();

    const delay = 3000 + Math.random() * 2000;
    setTimeout(performActions, delay);
  }

  performActions();
}

function createBot() {
  const randomId = Math.floor(Math.random() * 1000);
  const username = `Binod_op_${randomId}`;
  console.log(`🚀 Trying to connect as '${username}'...`);

  const bot = mineflayer.createBot({
    host: 'Yeahdidy_boi.aternos.me',
    port: 19186,
    username,
    version: '1.12',
    auth: 'offline'
  });

  bot.once('spawn', () => {
    console.log(`✅ Bot '${username}' joined the server.`);
    setTimeout(() => {
      startRandomActions(bot);
    }, 5000);
  });

  bot.on('end', () => {
    console.log(`🔁 Bot '${username}' disconnected. Reconnecting in 10 seconds...`);
    setTimeout(createBot, 10000);
  });

  bot.on('kicked', reason => {
    console.log(`⛔ Bot '${username}' was kicked:`, reason);
  });

  bot.on('error', err => {
    console.log(`❌ Bot '${username}' error:`, err.message);
  });
}

// Start the bot
createBot();
