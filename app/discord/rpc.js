const RPC = require('discord-rpc');

const clientId = '1457223692429037620';
RPC.register(clientId);

const rpc = new RPC.Client({ transport: 'ipc' });
let started = false;

async function connect() {
  if (started) return rpc;
  started = true;

  try {
    await rpc.login({ clientId });
    return rpc;
  } catch (err) {
    console.error(err);
    started = false;
  }
}

rpc.on('disconnected', () => {
  started = false;
});

module.exports = { rpc, connect };
