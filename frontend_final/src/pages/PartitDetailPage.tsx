import { useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Calendar, MapPin, Shield, Trophy, ArrowLeft, Loader2 } from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import { useGetPartit } from '@/queries/partit.queries';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const statusLabel: Record<string, string> = {
    PENDENT: 'Pendent',
    PROGRAMAT: 'Programat',
    EN_CURS: 'En curs',
    COMPLETAT: 'Completat',
    CANCELAT: 'Cancelat',
    SENSE_ARBITRE: 'Sense arbitre',
};

const statusClass: Record<string, string> = {
    PENDENT: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
    PROGRAMAT: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    EN_CURS: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    COMPLETAT: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
    CANCELAT: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    SENSE_ARBITRE: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
};

const formatDateTime = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleString('ca-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export default function PartitDetailPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { partitId } = useParams<{ partitId: string }>();
    const [searchParams] = useSearchParams();

    const equipId = searchParams.get('equipId') ?? '';
    const { data: partit, isLoading } = useGetPartit(partitId ?? null);

    const roles = useMemo(
        () => (user?.rols ?? []).map((role) => String(role.rol).toUpperCase()),
        [user?.rols],
    );

    const canOpenActa = roles.includes('ARBITRE') || roles.includes('ADMIN_WEB');
    const canOpenAlineacio =
        equipId.length > 0 &&
        (roles.includes('ENTRENADOR') || roles.includes('ADMIN_CLUB') || roles.includes('ADMIN_WEB'));

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-700" />
            </div>
        );
    }

    if (!partit) {
        return (
            <div className="max-w-3xl mx-auto p-6">
                <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 p-4">
                    No s'ha pogut carregar el detall del partit.
                </div>
                <Button variant="outline" className="mt-4" onClick={() => navigate(-1)}>
                    Tornar
                </Button>
            </div>
        );
    }

    const status = partit.status ?? 'PENDENT';
    const renderedStatus = statusLabel[status] ?? status;
    const renderedStatusClass = statusClass[status] ?? statusClass.PENDENT;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <Button variant="outline" onClick={() => navigate(-1)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Tornar
                </Button>

                <div className="flex items-center gap-2 flex-wrap">
                    {canOpenAlineacio && (
                        <Button
                            className="bg-green-700 hover:bg-green-800 text-white"
                            onClick={() => navigate(`/alineacio/${partit.id}?equipId=${equipId}`)}
                        >
                            Obrir alineacio
                        </Button>
                    )}
                    {canOpenActa && (
                        <Button
                            className="bg-blue-700 hover:bg-blue-800 text-white"
                            onClick={() => navigate(`/acta/${partit.id}`)}
                        >
                            Obrir acta
                        </Button>
                    )}
                </div>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
                <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Detall del partit</h1>
                    <Badge className={renderedStatusClass}>{renderedStatus}</Badge>
                </div>

                <div className="rounded-xl bg-slate-50 dark:bg-slate-900/60 p-5 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-center gap-3 text-lg sm:text-2xl font-bold text-slate-900 dark:text-white text-center">
                        <span>{partit.localNom ?? 'Equip local'}</span>
                        <span className="text-slate-400 text-base sm:text-lg">vs</span>
                        <span>{partit.visitantNom ?? 'Equip visitant'}</span>
                    </div>

                    {(partit.setsLocal !== undefined || partit.setsVisitant !== undefined) && (
                        <div className="text-center mt-3 text-sm text-slate-600 dark:text-slate-300">
                            Sets: {partit.setsLocal ?? 0} - {partit.setsVisitant ?? 0}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                    <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Data i hora</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {formatDateTime(partit.dataHora)}
                        </p>
                    </div>

                    <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Ubicacio</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {partit.ubicacio || 'Sense ubicacio'}
                        </p>
                    </div>

                    <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Lliga</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-2">
                            <Trophy className="w-4 h-4" />
                            {partit.lligaNom || 'Sense lliga'}
                        </p>
                    </div>

                    <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Arbitre</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            {partit.arbitreNom || 'Sense arbitre'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
