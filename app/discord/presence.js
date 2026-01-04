const { connect } = require('./rpc');
const searching = require('./presences/searching');
const listening = require('./presences/listening');

let rpc;

async function startPresence() {
  rpc = await connect();
  if (!rpc) return;

  searching(rpc);
}

function setSearching() {
  if (!rpc) return;
  searching(rpc);
}

function setListening(music) {
  if (!rpc) return;
  listening(rpc, music);
}

module.exports = { startPresence, setSearching, setListening };