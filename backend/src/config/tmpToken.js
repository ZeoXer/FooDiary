const crypto = require('crypto');

// 產生臨時 token
const createToken = () =>
    new Promise((resolve, reject) => {
        crypto.randomBytes(32, function(err, buffer) {
            if (err) {
                reject(err);
            } else {
                resolve(buffer.toString('hex'));
            }
        })
    });

module.exports = { createToken };