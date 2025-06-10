const mineflayer = require('mineflayer');
const express = require('express');
const app = express();

let bot = null;
let isConnecting = false;
let botActive = false;

// Web keep-alive
app.get('/', (req, res) => res.send('AFK bot is alive!'));
app.listen(3000, () => console.log('🌐 Web server on port 3000'));
setInterval(() => {}, 1000); // Prevent sleep

process.on('uncaughtException', err => {
  console.error('💥 Uncaught Exception:', err);
});

// Human-like actions
function startRandomActions(bot) {
  const moves = ['forward', 'back', 'left', 'right'];
  const chatMessages = [
    "Hello Lodu!",
    "Nice day in Randi Bazar.",
    "Anyone here?",
    "Just chilling 😄",
    "AFK but alive!",
    "What's up?",
    "Server is cool!",
    "Having fun!"
  ];

  function look() {
    const yaw = Math.random() * Math.PI * 2;
    const pitch = (Math.random() - 0.5) * Math.PI / 3;
    bot.look(yaw, pitch, true);
  }

  function act() {
    // 10% chance to send a chat message
    if (Math.random() < 0.10) {
      const msg = chatMessages[Math.floor(Math.random() * chatMessages.length)];
      bot.chat(msg);
    }

    // 8% chance to swing arm (simulate using an item)
    if (Math.random() < 0.08) {
      bot.swingArm();
    }

    // 6% chance to pause all movement for 5–15 seconds (idle)
    if (Math.random() < 0.06) {
      moves.forEach(m => bot.setControlState(m, false));
      setTimeout(act, 5000 + Math.random() * 10000);
      return;
    }

    // Random movement toggles
    moves.forEach(m => bot.setControlState(m, Math.random() < 0.7));
    bot.setControlState('jump', Math.random() < 0.2);
    bot.setControlState('sneak', Math.random() < 0.1);

    look();

    setTimeout(act, 4000 + Math.random() * 3000); // 4–7 seconds per cycle
  }

  act();
}

// Bot creation with lock and two-digit username
function createBot() {
  if (isConnecting || botActive) {
    console.log('⚠️ Skipped bot creation: already active or connecting.');
    return;
  }

  isConnecting = true;
  const id = Math.floor(Math.random() * 90) + 10; // Two-digit random number (10-99)
  const username = `Binod_op_${id}`;
  console.log(`🚀 Connecting as '${username}'`);

  try {
    bot = mineflayer.createBot({
      host: 'Yeahdidy_boi.aternos.me',
      port: 19186,
      username,
      version: '1.12',
      auth: 'offline'
    });
  } catch (e) {
    console.log('❌ Creation error:', e.message);
    isConnecting = false;
    setTimeout(createBot, 10000);
    return;
  }

  bot.once('spawn', () => {
    console.log(`✅ Joined as '${username}'`);
    isConnecting = false;
    botActive = true;
    setTimeout(() => {
      bot.chat('hi!');
      startRandomActions(bot);
    }, 5000);
  });

  bot.on('end', () => {
    console.log(`🔁 Disconnected. Reconnecting...`);
    botActive = false;
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

// 🔍 Smarter Watchdog
setInterval(() => {
  if (!botActive && !isConnecting) {
    console.log(`🛠 Watchdog: Bot missing. Restarting...`);
    try {
      if (bot) {
        bot.quit();
        bot = null;
      }
    } catch (e) {
      console.log('⚠️ Error during quit:', e.message);
    }
    createBot();
  } else {
    console.log(`✅ Watchdog: Bot is alive or connecting.`);
  }
}, 10000);

// Start the bot
createBot();
