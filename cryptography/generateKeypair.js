const crypto = require("crypto");
const fs = require("fs");

function genKeyPair() {
  const keyPair = crypto.generateKeyPairSync("rsa", {
    modulusLength: 4096,
    // encoding options for public key
    publicKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
    // encoding options for private key
    privateKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
  });

  // write the generated public and private keys to files
  fs.writeFileSync(__dirname + "/id_rsa_pub.pem", keyPair.publicKey);
  fs.writeFileSync(__dirname + "/id_rsa_priv.pem", keyPair.privateKey);
}

// execute generate function
genKeyPair();
