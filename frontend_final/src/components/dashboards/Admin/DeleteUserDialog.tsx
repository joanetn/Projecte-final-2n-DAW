import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import { useDeleteUser } from '@/mutations/user.mutations'
import type { User } from '@/types/users'

interface DeleteUserDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    user: User | null
}

export function DeleteUserDialog({ open, onOpenChange, user }: DeleteUserDialogProps) {
    const deleteMutation = useDeleteUser()

    if (!user) return null

    const handleDelete = async () => {
        try {
            await deleteMutation.mutateAsync(user.id)
            onOpenChange(false)
        } catch (err) {
            console.error('Error eliminando usuario:', err)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[420px] bg-white dark:bg-slate-800 border-warm-200 dark:border-slate-700">
                <DialogHeader>
                    <DialogTitle className="text-warm-900 dark:text-warm-100 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        Eliminar usuario
                    </DialogTitle>
                    <DialogDescription className="text-warm-600 dark:text-warm-400">
                        Esta acción no se puede deshacer.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <p className="text-warm-700 dark:text-warm-300">
                        ¿Estás seguro de que quieres eliminar al usuario{' '}
                        <strong className="text-warm-900 dark:text-warm-100">{user.nom}</strong>?
                    </p>
                    <p className="text-sm text-warm-500 dark:text-warm-400 mt-2">
                        Email: {user.email}
                    </p>
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={deleteMutation.isPending}
                        className="border-warm-300 dark:border-slate-600 text-warm-700 dark:text-warm-300 hover:bg-warm-50 dark:hover:bg-slate-700"
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={deleteMutation.isPending}
                        className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white"
                    >
                        {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
