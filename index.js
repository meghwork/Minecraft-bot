const mineflayer = require('mineflayer');
const express = require('express');
const app = express();

let bot = null; // Global bot reference

// 🌐 Web server to keep alive (for Render)
app.get('/', (req, res) => res.send('AFK bot is alive!'));
app.listen(3000, () => console.log('🌐 Web server running on port 3000'));

// Keep Node process alive (for Render)
setInterval(() => {}, 1000);

// Global error catcher
process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Error:', err);
});

// 🕹 Random movement and look
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

    bot.setControlState('jump', Math.random() < 0.5);  // 50% chance
    bot.setControlState('sneak', Math.random() < 0.1); // 10% chance

    randomLook();

    const delay = 3000 + Math.random() * 2000;
    setTimeout(performActions, delay);
  }

  performActions();
}

// 🚀 Create and connect the bot
function createBot() {
  const randomId = Math.floor(Math.random() * 1000);
  const username = `Binod_op_${randomId}`;
  console.log(`🚀 [${new Date().toISOString()}] Trying to connect as '${username}'...`);

  try {
    bot = mineflayer.createBot({
      host: 'Yeahdidy_boi.aternos.me',
      port: 19186,
      username,
      version: '1.12',
      auth: 'offline'
    });
  } catch (err) {
    console.error(`💥 Failed to create bot: ${err.message}`);
    setTimeout(createBot, 10000);
    return;
  }

  bot.once('spawn', () => {
    console.log(`✅ Bot '${username}' joined the server.`);
    setTimeout(() => {
      bot.chat('hi!');
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

  bot.on('message', msg => {
    console.log(`📩 Server: ${msg.toAnsi ? msg.toAnsi() : msg}`);
  });
}

// 🔍 Watchdog: restart if bot is not connected
setInterval(() => {
  if (!bot || !bot.player) {
    console.log(`🛠 Watchdog: Bot is not connected. Restarting...`);
    try {
      bot && bot.quit();
    } catch (e) {
      console.log('⚠️ Error during quit:', e.message);
    }
    createBot();
  } else {
    console.log(`✅ Watchdog: Bot '${bot.username}' is alive.`);
  }
}, 10000);

// 🟢 Start the bot
createBot();
