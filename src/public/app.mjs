import createWallet from "./wallet/createWallet.mjs";
import new_transaction from "./transactions/new_transaction.mjs";
import signTransaction from "./transactions/sign_trasaction.mjs";

const {
  handle_createWallet,
  balance,
  main_public,
  main_private,
  address,
  recepient,
  amount,
  handle_send_transaction,
  paste_address,
  message,
} = Object.fromEntries(
  [
    "handle_createWallet",
    "balance",
    "main_public",
    "main_private",
    "address",
    "recepient",
    "amount",
    "handle_send_transaction",
    "paste_address",
    "message",
  ].map((id) => [id, document.getElementById(id)])
);

const wallet = JSON.parse(localStorage.getItem("wallet")) || false;

const toggleVisibility = (el, show) => {
  el.classList.toggle("visible", show);
  el.classList.toggle("hidden", !show);
};

if (wallet) {
  toggleVisibility(handle_createWallet, false);
  toggleVisibility(balance, true);
  toggleVisibility(main_public, false);
  toggleVisibility(main_private, true);

  localStorage.setItem("wallet", JSON.stringify({ ...wallet, balance: 200 }));

  balance.innerHTML = wallet.balance;
  address.innerHTML = wallet.publicKey;
} else {
  toggleVisibility(handle_createWallet, true);
  toggleVisibility(balance, false);
  toggleVisibility(main_public, true);
  toggleVisibility(main_private, false);
}

handle_createWallet.addEventListener("click", async () => {
  const newWallet = await createWallet();
  localStorage.setItem("wallet", JSON.stringify(newWallet));
  toggleVisibility(handle_createWallet, false);
  toggleVisibility(balance, true);
});

paste_address.addEventListener("click", async () => {
  try {
    const text = await navigator.clipboard.readText();
    recepient.value = text;
  } catch (err) {
    console.error("Erro ao colar da área de transferência:", err);
  }
});

/**
 Remetente: Quem envia a mensagem, dinheiro, pacote, etc.
 Destinatário: Quem recebe.
 ( sender and recipient )
*/

handle_send_transaction.addEventListener("click", async () => {
  message.innerHTML = ''
  const { balance, publicKey, privateKey } = JSON.parse(localStorage.getItem("wallet"));

  if(amount.value > balance) {
    const msg = 'the amount exceeds the balance!'
    console.log(msg);
    message.innerHTML = msg
    return 
  }

  const transaction = {
    amount: amount.value,
    sender: publicKey,
    recipient: recepient.value,
  };

  const payload = { 
    ...transaction, 
    signed: await signTransaction(transaction, privateKey)
  }

  console.log(payload);

  await new_transaction(payload);
  message.innerHTML = 'enviado para pool 🚀'
});
