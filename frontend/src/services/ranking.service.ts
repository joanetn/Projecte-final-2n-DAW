const API_BASE = 'http://localhost:3001';
export const getRankingGlobal = async () => {
    const res = await fetch(`${API_BASE}/ranking`);
    if (!res.ok) throw new Error("Error carregant el ranking");
    const data = await res.json();
    return Array.isArray(data) ? data : [data];
}
