const redis = require('redis');
const fs = require('fs');
const path = require('path');
const nodeRSA = require('node-rsa');
const db = redis.createClient();

// esa加密
let rsaPubKey = null;
fs.readFile(path.join(__dirname, '../assets/rsa_1024_pub.pem'), (err, data) => {
  if (err) {
    return console.error(err);
  }
  const pubKey = data.toString();
  rsaPubKey = new nodeRSA(pubKey);
  rsaPubKey.setOptions({encryptionScheme: 'pkcs1'});
});

// rsa解密
let rsaPrivKey = null;
fs.readFile(
  path.join(__dirname, '../assets/rsa_1024_priv.pem'),
  (err, data) => {
    if (err) {
      return console.error(err);
    }
    const privKey = data.toString();
    rsaPrivKey = new nodeRSA(privKey);
    rsaPrivKey.setOptions({encryptionScheme: 'pkcs1'});
  }
);

class User {
  constructor(obj) {
    Object.keys(obj).forEach(key => (this[key] = obj[key]));
  }

  save(cb) {
    if (this.id) {
      this.update(cb);
    } else {
      db.incr('user:ids', (err, id) => {
        if (err) {
          cb(err);
        }
        this.id = id;
        this.pass = rsaPubKey.encrypt(this.pass, 'base64');
        this.update(cb);
      });
    }
  }

  update(cb) {
    const id = this.id;
    db.set(`user:id:${this.name}`, id, err => {
      if (err) {
        cb(err);
      }
      db.hmset(`user:${id}`, this, err => cb(err));
    });
  }
}

module.exports = User;

const user = new User({
  name: 'admin',
  pass: 'test'
});

user.save(err => {
  if (err) {
    console.log(err);
  }
  console.log('user id %d', user.id);
});
