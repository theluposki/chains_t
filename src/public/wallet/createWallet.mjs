import elliptic from "https://cdn.jsdelivr.net/npm/elliptic@6.6.1/+esm";

const ec = new elliptic.ec("secp256k1");

function createWallet() {
  const keyPair = ec.genKeyPair();
  const privateKey = keyPair.getPrivate("hex");
  const publicKey = keyPair.getPublic("hex");

  return {
    privateKey,
    publicKey,
  };
}

// Exemplo de uso
const wallet = createWallet();
console.log("Chave Privada:", wallet.privateKey);
console.log("Chave Pública:", wallet.publicKey);

export default createWallet;
