// mineWorker.mjs
import { parentPort, workerData } from "worker_threads";
import { createHash } from "crypto";

const nonceArray = new Uint32Array(workerData.sharedBuffer);

const incrementNonce = () => {
  // Atomics.add retorna o valor anterior e garante operações atômicas
  return Atomics.add(nonceArray, 0, 1);
};

let isMining = true;

let difficulty = workerData.difficulty;

const sha256 = (text) => createHash("sha256").update(text).digest("hex");

const blockHash = (block) => sha256(JSON.stringify(block));

parentPort.on("message", (message) => {
  if (message === "stop") isMining = false;
});

let newBlock;

while (isMining) {
  const currentNonce = incrementNonce();

  newBlock = {
    index: workerData.index,
    nonce: currentNonce,
    timestamp: Date.now(),
    difficulty,
    lastHash: workerData.lastHash,
    data: workerData.data,
  };

  const hash = blockHash(newBlock);

  parentPort.postMessage({
    hash,
    nonce: currentNonce,
    worker: workerData.workerInfo.worker
  });

  if (hash.startsWith("0".repeat(difficulty))) {
    parentPort.postMessage({
      newBlock: { ...newBlock, hash },
      done: true,
    });
    break;
  }
}
