import { FoundryLocalManager } from "foundry-local-sdk";

// Initialize the Foundry Local SDK
console.log("Initializing Foundry Local SDK...");

// init
const manager = FoundryLocalManager.create({
  appName: "foundry_local_embeddings",
  debug: "info",
});

console.log("✓ SDK initialized successfully");

// Get an embedding model
const modelAlias = "qwen3-embedding-0.6b";
const catalog = manager.catalog;
const model = await catalog.getModel(modelAlias);

console.log(`\nDownloading model ${modelAlias}...`);
await model.download((progress) => {
  process.stdout.write(`\rDownloading... ${progress.toFixed(2)}%`);
});
console.log("\n✓  Model downloaded");

// Load the model
console.log(`\nLoading model ${modelAlias}`);
await model.load();
console.log("✓ Model loaded");

// Create embedding clint
console.log("\nCreating embedding client...");
const embeddingClient = model.createEmbeddingClient();
console.log("✓ Embedding client created");

// Generate a single embedding
console.log("\n--- Single Embedding ---");
const response = await embeddingClient.generateEmbedding(
  "The quick brown fox jumps over the lazy dog",
);

const embedding = response.data[0].embedding;
console.log(`Dimensions: ${embedding.length}`);
console.log(
  `First 5 values: [${embedding
    .slice(0, 5)
    .map((v) => v.toFixed(6))
    .join(", ")}]`,
);

// Generate embeddings for multiple inputs
console.log("\n--- Batch Embeddings ---");
const batchResponse = await embeddingClient.generateEmbeddings([
  "Machine learning is a subset of artificial intelligence",
  "The capital of France is Paris",
  "Rust is a systems programming language",
]);

console.log(`Number of embeddings : ${batchResponse.data.length}`);
for (let i = 0; i < batchResponse.data.length; i++) {
  console.log(
    `    [${i} Dimensions : ${batchResponse.data[i].embedding.length}]`,
  );
}

console.log("\nUnloading model...");
model.unload();
console.log("✓ Model unloaded");
