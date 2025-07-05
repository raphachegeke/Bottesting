import * as baileys from '@whiskeysockets/baileys';

async function startBot() {
  const { state, saveCreds } = await baileys.useMultiFileAuthState('auth');

  const sock = baileys.default({
    auth: state,
    printQRInTerminal: false,
    getMessage: async () => ({})
  });

  sock.ev.on('creds.update', saveCreds);

  if (!sock.authState.creds.registered) {
    const code = await sock.requestPairingCode('254748397839');
    console.log('🔑 Pairing Code:', code);
  }

  sock.ev.on('connection.update', ({ connection }) => {
    if (connection === 'open') {
      console.log('✅ Bot connected!');
    }
  });

  sock.ev.on('messages.upsert', ({ messages }) => {
    const msg = messages[0];
    if (!msg.key.fromMe && msg.message?.conversation === 'hi') {
      sock.sendMessage(msg.key.remoteJid, { text: 'Hello from GitHub Actions 🤖' });
    }
  });
}

startBot();
