import { generateKeyPairSync, createSign, createVerify } from "crypto";
import { writeFile, readFile } from "fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const walletFileDB = join(__dirname, "./", "wallet.json");

function createWallet() {
  const { privateKey, publicKey } = generateKeyPairSync("ec", {
    namedCurve: "secp256k1",
    publicKeyEncoding: { type: "spki", format: "der" },
    privateKeyEncoding: { type: "pkcs8", format: "der" },
  });

  return {
    privateKey: privateKey.toString("hex"),
    publicKey: publicKey.toString("hex"),
  };
}

async function saveWallet(wallet, filename = walletFileDB) {
  await writeFile(filename, JSON.stringify(wallet, null, 2));
}

async function loadWallet(filename = walletFileDB) {
  try {
    const data = await readFile(filename, "utf8");
    return JSON.parse(data);
  } catch {
    console.log("Nenhuma carteira encontrada. Criando nova...");
    const newWallet = createWallet();
    await saveWallet(newWallet);
    return newWallet;
  }
}

function signTransaction(transaction, privateKeyHex) {
  const privateKey = Buffer.from(privateKeyHex, "hex");
  const signer = createSign("sha256");
  signer.update(JSON.stringify(transaction));
  signer.end();
  return signer.sign(privateKey).toString("hex");
}

function verifyTransaction(transaction, signatureHex, publicKeyHex) {
  const publicKey = Buffer.from(publicKeyHex, "hex");
  const verifier = createVerify("sha256");
  verifier.update(JSON.stringify(transaction));
  verifier.end();
  return verifier.verify(publicKey, Buffer.from(signatureHex, "hex"));
}

export {
  createWallet,
  saveWallet,
  loadWallet,
  signTransaction,
  verifyTransaction,
};
