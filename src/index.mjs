import { Mine } from "./mine.mjs";
import { loadBlockchainFromFile } from "./chain.mjs";
import readline from "readline";

await loadBlockchainFromFile();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise(resolve => rl.question(query, resolve));

async function askUserAndMine() {
  console.log("=== Configuração da Mineração ===");

  // Perguntar os dados da transação
  const amount = await question("Qual o valor da transação? (ex: 1000): ");
  const data = { amount: Number(amount) };

  // Perguntar a dificuldade
  const difficulty = await question("Qual a dificuldade da mineração? (1 = fácil, 6+ = difícil): ");
  
  // Perguntar o número de workers
  const numWorkers = await question("Quantos workers deseja utilizar? (ex: 4, 8): ");

  console.log("\nIniciando mineração com os seguintes parâmetros:");
  console.log(`- Valor: ${data.amount}`);
  console.log(`- Dificuldade: ${difficulty}`);
  console.log(`- Workers: ${numWorkers}`);
  console.log("====================================\n");

  rl.close();
  await Mine(data, Number(difficulty), Number(numWorkers));
}

askUserAndMine();



