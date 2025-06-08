const mineflayer = require('mineflayer');
const express = require('express');
const app = express();

let bot = null;
let isConnecting = false; // Prevent double spawn

// 🌐 Keep-alive web server
app.get('/', (req, res) => res.send('AFK bot is alive!'));
app.listen(3000, () => console.log('🌐 Web server running on port 3000'));

// Keep alive
setInterval(() => {}, 1000);

// Global crash handler
process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Error:', err);
});

// Movement function
function startRandomActions(bot) {
  const moves = ['forward', 'back', 'left', 'right'];

  function randomLook() {
    const yaw = Math.random() * Math.PI * 2;
    const pitch = (Math.random() - 0.5) * Math.PI / 3;
    bot.look(yaw, pitch, true);
  }

  function performActions() {
    moves.forEach(move => {
      bot.setControlState(move, Math.random() < 0.7);
    });

    bot.setControlState('jump', Math.random() < 0.5);
    bot.setControlState('sneak', Math.random() < 0.1);
    randomLook();

    const delay = 3000 + Math.random() * 2000;
    setTimeout(performActions, delay);
  }

  performActions();
}

// Create bot (with lock)
function createBot() {
  if (isConnecting) {
    console.log('⚠️ Already connecting, skipping...');
    return;
  }

  isConnecting = true;

  const randomId = Math.floor(Math.random() * 1000);
  const username = `Binod_op_${randomId}`;
  console.log(`🚀 Trying to connect as '${username}'`);

  try {
    bot = mineflayer.createBot({
      host: 'Yeahdidy_boi.aternos.me',
      port: 19186,
      username,
      version: '1.12',
      auth: 'offline'
    });
  } catch (err) {
    console.log('❌ Bot creation error:', err.message);
    isConnecting = false;
    setTimeout(createBot, 10000);
    return;
  }

  bot.once('spawn', () => {
    console.log(`✅ Bot '${username}' joined.`);
    isConnecting = false;
    setTimeout(() => {
      bot.chat('hi!');
      startRandomActions(bot);
    }, 5000);
  });

  bot.on('end', () => {
    console.log(`🔁 Bot '${username}' disconnected. Reconnecting...`);
    isConnecting = false;
    setTimeout(createBot, 10000);
  });

  bot.on('kicked', reason => {
    console.log(`⛔ Kicked: ${reason}`);
  });

  bot.on('error', err => {
    console.log(`❌ Error: ${err.message}`);
  });

  bot.on('message', msg => {
    console.log(`📩 ${msg.toAnsi ? msg.toAnsi() : msg}`);
  });
}

// 🔍 Watchdog (safe with isConnecting)
setInterval(() => {
  if (!bot || !bot.player) {
    console.log(`🛠 Watchdog: Bot is missing. Forcing restart...`);
    try {
      bot && bot.quit();
    } catch (e) {
      console.log('⚠️ Quit error:', e.message);
    }
    createBot(); // isConnecting prevents double spawn
  } else {
    console.log(`✅ Watchdog: Bot '${bot.username}' is alive.`);
  }
}, 10000);

// Start once
createBot();
