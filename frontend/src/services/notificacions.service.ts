const API_BASE = 'http://localhost:3001';

export const getNotificacions = async (usuariId: string) => {
    const res = await fetch(`${API_BASE}/notificacions?usuariId=${usuariId}&_sort=created_at&_order=desc`);
    if (!res.ok) throw new Error('Error carregant notificacions');
    const data = await res.json();
    return Array.isArray(data) ? data : [data];
};

export const getPropostesEnviades = async (equipId: string) => {
    const res = await fetch(`${API_BASE}/propostes/enviades/${equipId}`);
    if (!res.ok) throw new Error('Error carregant propostes enviades');
    return res.json();
};

export const getPropostesRebudes = async (equipId: string) => {
    const res = await fetch(`${API_BASE}/propostes/rebudes/${equipId}`);
    if (!res.ok) throw new Error('Error carregant propostes enviades');
    return res.json();
}

export const acceptProposta = async (notifId: string) => {
    const res = await fetch(`${API_BASE}/propostes/${notifId}/accept`, { method: 'POST' });
    if (!res.ok) throw new Error('Error acceptant proposta');
    return res.json();
};

export const rejectProposta = async (notifId: string) => {
    const res = await fetch(`${API_BASE}/propostes/${notifId}/reject`, { method: 'POST' });
    if (!res.ok) throw new Error('Error rebutjant proposta');
    return res.json();
};
