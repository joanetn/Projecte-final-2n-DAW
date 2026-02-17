import { useState, useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useCreateUser } from '@/mutations/user.mutations'
import { useUpdateUser } from '@/mutations/user.mutations'
import type { User, CreateUserRequest, UpdateUserRequest } from '@/types/users'

interface UserFormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    user?: User | null
}

export function UserFormDialog({ open, onOpenChange, user }: UserFormDialogProps) {
    const isEditing = !!user
    const createMutation = useCreateUser()
    const updateMutation = useUpdateUser()

    const [form, setForm] = useState({
        nom: '',
        email: '',
        contrasenya: '',
        telefon: '',
        dataNaixement: '',
        avatar: '',
        dni: '',
        nivell: '',
    })

    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        if (user) {
            setForm({
                nom: user.nom || '',
                email: user.email || '',
                contrasenya: '',
                telefon: user.telefon || '',
                dataNaixement: user.dataNaixement?.split('T')[0] || '',
                avatar: user.avatar || '',
                dni: user.dni || '',
                nivell: user.nivell || '',
            })
        } else {
            setForm({
                nom: '',
                email: '',
                contrasenya: '',
                telefon: '',
                dataNaixement: '',
                avatar: '',
                dni: '',
                nivell: '',
            })
        }
        setErrors({})
    }, [user, open])

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {}

        if (!form.nom || form.nom.length < 5) {
            newErrors.nom = 'El nombre debe tener al menos 5 caracteres'
        }
        if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) {
            newErrors.email = 'Introduce un email válido'
        }
        if (!isEditing && (!form.contrasenya || form.contrasenya.length < 8)) {
            newErrors.contrasenya = 'La contraseña debe tener al menos 8 caracteres'
        }
        if (isEditing && form.contrasenya && form.contrasenya.length < 8) {
            newErrors.contrasenya = 'La contraseña debe tener al menos 8 caracteres'
        }
        if (!isEditing && !form.dataNaixement) {
            newErrors.dataNaixement = 'La fecha de nacimiento es obligatoria'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault()
        if (!validate()) return

        try {
            if (isEditing && user) {
                const data: UpdateUserRequest = {}
                if (form.nom !== user.nom) data.nom = form.nom
                if (form.email !== user.email) data.email = form.email
                if (form.contrasenya) data.contrasenya = form.contrasenya
                if (form.telefon !== (user.telefon || '')) data.telefon = form.telefon || undefined
                if (form.dataNaixement !== (user.dataNaixement?.split('T')[0] || ''))
                    data.dataNaixement = form.dataNaixement || undefined
                if (form.avatar !== (user.avatar || '')) data.avatar = form.avatar || undefined
                if (form.dni !== (user.dni || '')) data.dni = form.dni || undefined
                if (form.nivell !== (user.nivell || '')) data.nivell = form.nivell

                await updateMutation.mutateAsync({ id: user.id, data })
            } else {
                const data: CreateUserRequest = {
                    nom: form.nom,
                    email: form.email,
                    contrasenya: form.contrasenya,
                    ...(form.telefon && { telefon: form.telefon }),
                    ...(form.dataNaixement && { dataNaixement: form.dataNaixement }),
                    ...(form.avatar && { avatar: form.avatar }),
                    ...(form.dni && { dni: form.dni }),
                    nivell: form.nivell
                }
                await createMutation.mutateAsync(data)
            }
            onOpenChange(false)
        } catch (err: any) {
            console.error('Error guardando usuario:', err)
            setErrors({ general: err?.response?.data?.message || 'Error al guardar el usuario' })
        }
    }

    const isPending = createMutation.isPending || updateMutation.isPending

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] bg-white dark:bg-slate-800 border-warm-200 dark:border-slate-700">
                <DialogHeader>
                    <DialogTitle className="text-warm-900 dark:text-warm-100">
                        {isEditing ? 'Editar usuario' : 'Crear nuevo usuario'}
                    </DialogTitle>
                    <DialogDescription className="text-warm-600 dark:text-warm-400">
                        {isEditing
                            ? 'Modifica los campos que quieras actualizar.'
                            : 'Rellena los campos para crear un nuevo usuario.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {errors.general && (
                        <div className="alert alert-error text-sm">{errors.general}</div>
                    )}

                    {/* Nom */}
                    <div className="space-y-1.5">
                        <Label htmlFor="nom" className="text-warm-800 dark:text-warm-200">
                            Nombre *
                        </Label>
                        <Input
                            id="nom"
                            value={form.nom}
                            onChange={(e) => setForm({ ...form, nom: e.target.value })}
                            placeholder="Nombre completo"
                            className="bg-white dark:bg-slate-700 border-warm-300 dark:border-slate-600 text-warm-900 dark:text-slate-100"
                        />
                        {errors.nom && (
                            <p className="text-red-500 dark:text-red-400 text-xs">{errors.nom}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-warm-800 dark:text-warm-200">
                            Email *
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            placeholder="correo@ejemplo.com"
                            className="bg-white dark:bg-slate-700 border-warm-300 dark:border-slate-600 text-warm-900 dark:text-slate-100"
                        />
                        {errors.email && (
                            <p className="text-red-500 dark:text-red-400 text-xs">{errors.email}</p>
                        )}
                    </div>

                    {/* Contrasenya */}
                    <div className="space-y-1.5">
                        <Label htmlFor="contrasenya" className="text-warm-800 dark:text-warm-200">
                            Contraseña {isEditing ? '(dejar vacío para no cambiar)' : '*'}
                        </Label>
                        <Input
                            id="contrasenya"
                            type="password"
                            value={form.contrasenya}
                            onChange={(e) => setForm({ ...form, contrasenya: e.target.value })}
                            placeholder={isEditing ? '••••••••' : 'Mínimo 8 caracteres'}
                            className="bg-white dark:bg-slate-700 border-warm-300 dark:border-slate-600 text-warm-900 dark:text-slate-100"
                        />
                        {errors.contrasenya && (
                            <p className="text-red-500 dark:text-red-400 text-xs">
                                {errors.contrasenya}
                            </p>
                        )}
                    </div>

                    {/* Fecha Nacimiento */}
                    <div className="space-y-1.5">
                        <Label
                            htmlFor="dataNaixement"
                            className="text-warm-800 dark:text-warm-200"
                        >
                            Fecha de nacimiento {!isEditing && '*'}
                        </Label>
                        <Input
                            id="dataNaixement"
                            type="date"
                            value={form.dataNaixement}
                            onChange={(e) => setForm({ ...form, dataNaixement: e.target.value })}
                            className="bg-white dark:bg-slate-700 border-warm-300 dark:border-slate-600 text-warm-900 dark:text-slate-100"
                        />
                        {errors.dataNaixement && (
                            <p className="text-red-500 dark:text-red-400 text-xs">
                                {errors.dataNaixement}
                            </p>
                        )}
                    </div>

                    {/* Telefon & DNI & Nivell */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="telefon" className="text-warm-800 dark:text-warm-200">
                                Teléfono
                            </Label>
                            <Input
                                id="telefon"
                                value={form.telefon}
                                onChange={(e) => setForm({ ...form, telefon: e.target.value })}
                                placeholder="+34123456789"
                                className="bg-white dark:bg-slate-700 border-warm-300 dark:border-slate-600 text-warm-900 dark:text-slate-100"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="dni" className="text-warm-800 dark:text-warm-200">
                                DNI
                            </Label>
                            <Input
                                id="dni"
                                value={form.dni}
                                onChange={(e) => setForm({ ...form, dni: e.target.value })}
                                placeholder="12345678A"
                                className="bg-white dark:bg-slate-700 border-warm-300 dark:border-slate-600 text-warm-900 dark:text-slate-100"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor='nivell' className="text-warm-800 dark:text-warm-200">
                                Nivell
                            </Label>
                            <Select value={form.nivell} onValueChange={(value) => setForm({ ...form, nivell: value })}>
                                <SelectTrigger className="bg-white dark:bg-slate-700 border-warm-300 dark:border-slate-600 text-warm-900 dark:text-slate-100">
                                    <SelectValue placeholder="Selecciona un nivel" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="principant">Principant</SelectItem>
                                    <SelectItem value="intermedi">Intermedi</SelectItem>
                                    <SelectItem value="avançat">Avançat</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Avatar - Solo en edición */}
                    {isEditing && (
                        <div className="space-y-1.5">
                            <Label htmlFor="avatar" className="text-warm-800 dark:text-warm-200">
                                Avatar (URL)
                            </Label>
                            <Input
                                id="avatar"
                                value={form.avatar}
                                onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                                placeholder="https://ejemplo.com/avatar.jpg"
                                className="bg-white dark:bg-slate-700 border-warm-300 dark:border-slate-600 text-warm-900 dark:text-slate-100"
                            />
                        </div>
                    )}

                    <DialogFooter className="gap-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isPending}
                            className="border-warm-300 dark:border-slate-600 text-warm-700 dark:text-warm-300 hover:bg-warm-50 dark:hover:bg-slate-700"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="bg-warm-600 hover:bg-warm-700 dark:bg-warm-500 dark:hover:bg-warm-600 text-white"
                        >
                            {isPending
                                ? 'Guardando...'
                                : isEditing
                                    ? 'Actualizar'
                                    : 'Crear usuario'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
