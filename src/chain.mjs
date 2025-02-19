//chain.mjs
import { dirname, join } from "node:path";
import { fileURLToPath } from "url";
import { writeFile, readFile } from "node:fs/promises";
import genesis from "./genesis.mjs";

let blockchain = [];

const __dirname = dirname(fileURLToPath(import.meta.url));

const pathFileDB = join(__dirname, "./", "blockchain.json");

async function saveBlockchainToFile() {
  await writeFile(pathFileDB, JSON.stringify(blockchain, null, 2));
}

async function loadBlockchainFromFile() {
  try {
    const data = await readFile(pathFileDB, "utf8");
    blockchain = JSON.parse(data);
    console.log("- blockchain encontrada e adicionada.");
  } catch (error) {
    console.log("- nenhuma blockchain encontrada.");
    console.log("- criando bloco gênesis...");
    const genesisBlock = genesis();
    console.log("- criando nova blockchain...");
    blockchain.push(genesisBlock);
    await saveBlockchainToFile();
    console.log("- gênesis adicionada");
    console.log("- blockchain pronta.");
  }
}

const addBlockToChain = async (block) => {
  blockchain.push(block);
  await saveBlockchainToFile();
};

export { blockchain, loadBlockchainFromFile, addBlockToChain };
