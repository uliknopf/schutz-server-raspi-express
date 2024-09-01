//Crypto-modul
const crypto = require('crypto');

//  Create a hash object using SHA1 or MD5 or any other algorithm
const algorithmus='md5';//'sha1';'sha512';
const hash = crypto.createHash(algorithmus);

// Update the hash with the data
const data = 'sensorID01';
hash.update(data);

// Generate the digest
const digest = hash.digest('hex').slice(0,data.length);

console.log(`${algorithmus} Hash of "${data}": ${digest}`);