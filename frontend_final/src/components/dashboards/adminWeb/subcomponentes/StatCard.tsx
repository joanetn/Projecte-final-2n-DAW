import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
    title: string
    value: number | string
    icon: LucideIcon
    subtitle?: string
    color?: 'blue' | 'green' | 'orange' | 'red' | 'purple' | 'indigo'
}

const colorMap = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800',
    orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800',
    red: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800',
    indigo: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
}

export function StatCard({ title, value, icon: Icon, subtitle, color = 'blue' }: StatCardProps) {
    return (
        <div className={`rounded-xl border p-5 flex items-center gap-4 ${colorMap[color]}`}>
            <div className="flex-shrink-0">
                <Icon className="w-8 h-8" />
            </div>
            <div>
                <p className="text-sm font-medium opacity-75">{title}</p>
                <p className="text-2xl font-bold">{value}</p>
                {subtitle && <p className="text-xs opacity-60 mt-0.5">{subtitle}</p>}
            </div>
        </div>
    )
}
