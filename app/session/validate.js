const fs = require('fs');

function validateSession(session) {
    if (!session) return false;

    if (typeof session !== 'object') return false;

    if (typeof session.createdAt !== 'string') return false;

    if (typeof session.firstRun !== 'boolean') return false;

    return true;
}

module.exports = { validateSession };