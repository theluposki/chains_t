import elliptic from "https://cdn.jsdelivr.net/npm/elliptic@6.6.1/+esm";

const ec = new elliptic.ec("secp256k1");

function signTransaction(transaction, privateKeyHex) {
  const privateKey = ec.keyFromPrivate(privateKeyHex, "hex");
  const transactionData = new TextEncoder().encode(JSON.stringify(transaction));
  const signature = privateKey.sign(transactionData);
  const signatureHex = signature.toDER("hex");

  console.log("Assinatura gerada:", signatureHex);

  return signatureHex;
}

export default signTransaction;
