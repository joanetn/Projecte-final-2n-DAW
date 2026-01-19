import React, { useState } from 'react';
import { useToast } from '@/components/ui/Toast';

const API_BASE = 'http://localhost:3001';

const PropostesTest: React.FC = () => {
    const { showToast } = useToast();
    const [fromEquipId, setFromEquipId] = useState('1');
    const [toEquipId, setToEquipId] = useState('2');
    const [dataHora, setDataHora] = useState('2026-02-10 18:00');
    const [lastNotifs, setLastNotifs] = useState<any[]>([]);

    const crearProposta = async () => {
        try {
            const resp = await fetch(`${API_BASE}/propostes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fromEquipId, toEquipId, dataHora })
            });
            if (!resp.ok) throw new Error(await resp.text());
            const data = await resp.json();
            setLastNotifs(data.created || []);
            showToast({ type: 'success', title: 'Proposta enviada', description: 'Notificacions creades correctament.' });
        } catch (e: any) {
            console.error(e);
            showToast({ type: 'error', title: 'Error', description: 'No s\'ha pogut crear la proposta.' });
        }
    };

    const accept = async (notifId: any) => {
        try {
            const resp = await fetch(`${API_BASE}/propostes/${notifId}/accept`, { method: 'POST' });
            if (!resp.ok) throw new Error(await resp.text());
            const data = await resp.json();
            showToast({ type: 'success', title: 'Proposta acceptada', description: 'S\'ha acceptat la proposta i s\'ha creat el partit.' });
            return data;
        } catch (e) {
            console.error(e);
            showToast({ type: 'error', title: 'Error', description: 'No s\'ha pogut acceptar la proposta.' });
        }
    };

    const reject = async (notifId: any) => {
        try {
            const resp = await fetch(`${API_BASE}/propostes/${notifId}/reject`, { method: 'POST' });
            if (!resp.ok) throw new Error(await resp.text());
            showToast({ type: 'success', title: 'Proposta rebutjada', description: 'S\'ha rebutjat la proposta.' });
        } catch (e) {
            console.error(e);
            showToast({ type: 'error', title: 'Error', description: 'No s\'ha pogut rebutjar la proposta.' });
        }
    };

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">Test Propostes (mínim)</h2>
            <div className="space-y-2 mb-4">
                <div>
                    <label className="block text-sm">From Equip Id</label>
                    <input value={fromEquipId} onChange={e => setFromEquipId(e.target.value)} className="border px-2 py-1 w-full" />
                </div>
                <div>
                    <label className="block text-sm">To Equip Id</label>
                    <input value={toEquipId} onChange={e => setToEquipId(e.target.value)} className="border px-2 py-1 w-full" />
                </div>
                <div>
                    <label className="block text-sm">Data i Hora</label>
                    <input value={dataHora} onChange={e => setDataHora(e.target.value)} className="border px-2 py-1 w-full" />
                </div>
                <div>
                    <button onClick={crearProposta} className="bg-blue-600 text-white px-3 py-1 rounded">Crear proposta</button>
                </div>
            </div>

            <div>
                <h3 className="font-medium mb-2">Notificacions creades</h3>
                {lastNotifs.length === 0 && <div className="text-sm text-gray-500">Cap notificació creada encara</div>}
                <ul className="space-y-2 mt-2">
                    {lastNotifs.map((n: any) => (
                        <li key={n.id} className="border p-3 rounded flex justify-between items-center">
                            <div>
                                <div className="font-semibold">{n.titol}</div>
                                <div className="text-sm text-gray-600">{n.missatge}</div>
                                <div className="text-xs text-gray-500">id: {n.id}</div>
                            </div>
                            <div className="space-x-2">
                                <button onClick={() => accept(n.id)} className="px-2 py-1 bg-green-600 text-white rounded">Acceptar</button>
                                <button onClick={() => reject(n.id)} className="px-2 py-1 bg-red-600 text-white rounded">Rebutjar</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default PropostesTest;
