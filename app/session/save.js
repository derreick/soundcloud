const { validateSession } = require('./validate');
const fs = require('fs');
const path = require('path');

let sessionPath;
let sessionFile;

function initSession(app) {
  sessionPath = path.join(app.getPath('appData'), 'soundcloud');
  sessionFile = path.join(sessionPath, 'session.dat');

  if (!fs.existsSync(sessionPath)) {
    fs.mkdirSync(sessionPath, { recursive: true });
  }

  if (!fs.existsSync(sessionFile)) {
    writeDefaultSession();
  }
}

function writeDefaultSession() {
  const defaultSession = {
    firstRun: true,
    createdAt: new Date().toISOString()
  };

  fs.writeFileSync(
    sessionFile,
    JSON.stringify(defaultSession, null, 2),
    'utf-8'
  );
}

function readSession() {
  try {
    const data = fs.readFileSync(sessionFile, 'utf-8');
    const session = JSON.parse(data);

    if (!validateSession(session)) {
      writeDefaultSession();
      return readSession();
    }

    return session;
  } catch {
    writeDefaultSession();
    return readSession();
  }
}

function saveSession(data) {
  if (!validateSession(data)) {
    throw new Error('Sesión inválida');
  }

  fs.writeFileSync(
    sessionFile,
    JSON.stringify(data, null, 2),
    'utf-8'
  );
}

module.exports = { initSession, readSession, saveSession };