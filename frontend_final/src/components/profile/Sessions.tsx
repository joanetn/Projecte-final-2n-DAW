import { useAuth } from "@/context/AuthContext";
import { useGetProfileSessions } from "@/queries/profile.queries";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "../ui/button";

export function Sessions() {
    const { data: sessions } = useGetProfileSessions()
    const { logoutDevice, deviceId } = useAuth()
    const queryClient = useQueryClient()
    const [closingId, setClosingId] = useState<string | null>(null)

    const handleLogoutDevice = async (targetDeviceId: string) => {
        try {
            setClosingId(targetDeviceId)
            await logoutDevice(targetDeviceId)

            if (targetDeviceId !== deviceId) {
                await queryClient.invalidateQueries({ queryKey: ['getProfileSessions'] })
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al fer log out del device'
            console.error(errorMessage)
        } finally {
            setClosingId(null)
        }
    }

    return (
        <>
            <div>Sessions actives del teu compte</div>
            {sessions?.map((sessio) => (
                <div key={sessio.id ?? sessio.device_id}>
                    <div>{sessio.device_type}</div>
                    <div>{sessio.os}</div>
                    <div>{sessio.browser}</div>
                    <div>{sessio.created_at}</div>
                    <div>{sessio.last_used_at}</div>
                    <Button
                        onClick={() => void handleLogoutDevice(sessio.device_id)}
                        disabled={closingId === sessio.device_id}
                    >
                        {sessio.device_id === deviceId
                            ? (closingId === sessio.device_id ? 'Tancant...' : 'Tancar sessió actual')
                            : (closingId === sessio.device_id ? 'Tancant...' : 'Tancar sessió')}
                    </Button>
                    {sessio.device_id === deviceId && (
                        <span style={{ marginLeft: 8, color: 'green' }}>(Dispositiu actual)</span>
                    )}
                </div>
            ))}
        </>
    );
}

