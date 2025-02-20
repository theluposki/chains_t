import { loadWallet, signTransaction, verifyTransaction } from "./wallet.mjs";

async function createTransaction(to, amount) {
  const wallet = await loadWallet();
  const transaction = {
    from: wallet.publicKey,
    to,
    amount,
    timestamp: Date.now(),
  };

  const signature = signTransaction(transaction, wallet.privateKey);
  return { transaction, signature };
}

async function validateTransaction(transaction, signature) {
  return verifyTransaction(transaction, signature, transaction.from);
}

export { createTransaction, validateTransaction };
