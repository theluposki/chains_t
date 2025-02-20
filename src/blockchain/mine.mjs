// mine.mjs
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { availableParallelism } from "node:os";
import { Worker } from "worker_threads";
import { blockchain, addBlockToChain } from "./chain.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pathFileMineWorker = join(__dirname, "./", "mineWorker.mjs");

const sharedBuffer = new SharedArrayBuffer(4);
const sharedNonce = new Uint32Array(sharedBuffer);
sharedNonce[0] = 0;

const NUM_WORKERS_DEFAULT = availableParallelism();

let workers = [];
let finished = false; // Flag para indicar que a mineração já foi finalizada

const resetWorkers = () => {
  workers.forEach((w) => w.terminate());
  workers = [];
};

function broadcastToWorkers(message) {
  workers.forEach((worker) => {
    worker.postMessage(message);
  });
}

// Função para tratar a finalização da mineração de forma única
async function finalizeMining(msg) {
  // Verifica se já foi finalizado para evitar execuções duplicadas
  if (finished) return;
  finished = true;

  // Notifica todos os workers para pararem
  broadcastToWorkers("stop");

  // Adiciona o bloco encontrado à blockchain
  await addBlockToChain({ ...msg.newBlock });

  // Encerra todos os workers
  resetWorkers();

  console.log("Mineração interrompida e bloco adicionado.");
}

export async function Mine(data, difficulty, NUM_WORKERS=NUM_WORKERS_DEFAULT) {
  // Reinicia a flag para cada nova mineração
  finished = false;
  const lastBlock = blockchain.at(-1);

  for (let i = 0; i < NUM_WORKERS; i++) {
    const worker = new Worker(pathFileMineWorker, {
      workerData: {
        index: lastBlock.index + 1,
        lastHash: lastBlock.hash,
        data,
        workerInfo: { worker: i },
        sharedBuffer,
        difficulty
      },
    });

    // Listener de mensagens dos workers
    worker.on("message", async (msg) => {
      // Se já finalizamos, ignora outras mensagens
      if (finished) return;

      console.log(JSON.stringify(msg, null, 2));

      if (msg.done) {
        await finalizeMining(msg);
      }
    });

    // Listeners para tratar erros e saídas dos workers
    worker.on("error", (err) => {
      console.error(`Worker ${i} error:`, err);
    });

    worker.on("exit", (code) => {
      if (code !== 0) console.warn(`Worker ${i} finalizou com código ${code}`);
    });

    workers.push(worker);
  }
}
