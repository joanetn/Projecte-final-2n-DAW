// retriever.ts

function normalize(text: string): string[] {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/);
}

function textToVector(words: string[], vocabulary: string[]): number[] {
  return vocabulary.map(word => words.filter(w => w === word).length);
}

function buildVocabulary(products: any[]): string[] {
  const vocabSet = new Set<string>();
  products.forEach(p => {
    const words = normalize(`${p.name} ${p.category} ${p.description}`);
    words.forEach(w => vocabSet.add(w));
  });
  return Array.from(vocabSet);
}

function cosineSimilarity(vecA: number[], vecB: number[]): number {
  const dot = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
  const magB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
  if (magA === 0 || magB === 0) return 0;
  return dot / (magA * magB);
}

export function retrieveRelevantProducts(query: string, products: any[], topK = 5): any[] {
  const vocab = buildVocabulary(products);
  const queryWords = normalize(query);
  const queryVector = textToVector(queryWords, vocab);

  const scored = products.map(p => {
    const productWords = normalize(`${p.name} ${p.category} ${p.description}`);
    const productVector = textToVector(productWords, vocab);
    const score = cosineSimilarity(queryVector, productVector);
    return { product: p, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(s => s.product);
}