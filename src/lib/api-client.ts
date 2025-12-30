import type { ResultEntry } from "@/lib/types";

// Service mocké : dans le futur, tu pourras remplacer cette fonction par
// un appel HTTP réel vers ton backend (fetch/axios, etc.).
export async function publishResults(results: ResultEntry[]): Promise<void> {
  // Pour la démo, on se contente de logguer dans la console.
  // Cela garde la même API que si on appelait un vrai backend.
  console.log("[publishResults] Publishing results (mock)", results);
}
