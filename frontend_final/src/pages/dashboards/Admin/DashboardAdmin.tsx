import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UsersTab } from '@/components/dashboards/Admin/Users/UsersTab'
import { MerchTab } from '@/components/dashboards/Admin/Merch/MerchTab'
import { ResumTab } from '@/components/dashboards/adminWeb/ResumTab'
import { EquipsTab } from '@/components/dashboards/adminWeb/EquipsTab'
import { LliguesTab } from '@/components/dashboards/adminWeb/LliguesTab'
import { PartitsTab } from '@/components/dashboards/adminWeb/PartitsTab'
import { ArbitresTab } from '@/components/dashboards/adminWeb/ArbitresTab'
import { ClassificacioTab } from '@/components/dashboards/adminWeb/ClassificacioTab'
import { usePermissions } from '@/hooks/usePermissions'
import { AdminPermissions } from '@/types/permissions'

const DashboardAdmin = () => {
    const { can } = usePermissions()

    return (
        <div className="min-h-screen bg-white dark:bg-slate-900 p-6 md:p-10">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-warm-900 dark:text-warm-100 mb-2">
                        Panel de Administración
                    </h1>
                    <p className="text-warm-600 dark:text-warm-300">
                        Gestión global de usuarios, equips, ligas, partidos, árbitres, productos y más
                    </p>
                </div>

                <div className="card">
                    <Tabs defaultValue="resum" className="w-full">
                        <TabsList className="bg-white dark:bg-slate-800 border-b border-warm-200 dark:border-slate-700 rounded-b-none flex flex-wrap h-auto gap-0">
                            {can(AdminPermissions.ESTADISTIQUES) && (
                                <TabsTrigger
                                    value="resum"
                                    className="text-warm-700 dark:text-warm-300 data-[state=active]:text-warm-900 dark:data-[state=active]:text-warm-100 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700"
                                >
                                    📊 Resum
                                </TabsTrigger>
                            )}
                            {can(AdminPermissions.USUARIS_VIEW) && (
                                <TabsTrigger
                                    value="usuaris"
                                    className="text-warm-700 dark:text-warm-300 data-[state=active]:text-warm-900 dark:data-[state=active]:text-warm-100 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700"
                                >
                                    👥 Usuaris
                                </TabsTrigger>
                            )}
                            <TabsTrigger
                                value="equips"
                                className="text-warm-700 dark:text-warm-300 data-[state=active]:text-warm-900 dark:data-[state=active]:text-warm-100 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700"
                            >
                                🛡️ Equips
                            </TabsTrigger>
                            <TabsTrigger
                                value="lligues"
                                className="text-warm-700 dark:text-warm-300 data-[state=active]:text-warm-900 dark:data-[state=active]:text-warm-100 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700"
                            >
                                🏆 Lligues
                            </TabsTrigger>
                            <TabsTrigger
                                value="partits"
                                className="text-warm-700 dark:text-warm-300 data-[state=active]:text-warm-900 dark:data-[state=active]:text-warm-100 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700"
                            >
                                📅 Partits
                            </TabsTrigger>
                            <TabsTrigger
                                value="arbitres"
                                className="text-warm-700 dark:text-warm-300 data-[state=active]:text-warm-900 dark:data-[state=active]:text-warm-100 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700"
                            >
                                ⚖️ Àrbitres
                            </TabsTrigger>
                            {can(AdminPermissions.CLASSIFICACIO_VIEW) && (
                                <TabsTrigger
                                    value="classificacio"
                                    className="text-warm-700 dark:text-warm-300 data-[state=active]:text-warm-900 dark:data-[state=active]:text-warm-100 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700"
                                >
                                    📈 Classificació
                                </TabsTrigger>
                            )}
                            <TabsTrigger
                                value="merchs"
                                className="text-warm-700 dark:text-warm-300 data-[state=active]:text-warm-900 dark:data-[state=active]:text-warm-100 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700"
                            >
                                🛍️ Productes
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="resum" className="p-6">
                            <ResumTab />
                        </TabsContent>
                        <TabsContent value="usuaris" className="p-6">
                            <UsersTab />
                        </TabsContent>
                        <TabsContent value="equips" className="p-6">
                            <EquipsTab />
                        </TabsContent>
                        <TabsContent value="lligues" className="p-6">
                            <LliguesTab />
                        </TabsContent>
                        <TabsContent value="partits" className="p-6">
                            <PartitsTab />
                        </TabsContent>
                        <TabsContent value="arbitres" className="p-6">
                            <ArbitresTab />
                        </TabsContent>
                        <TabsContent value="classificacio" className="p-6">
                            <ClassificacioTab />
                        </TabsContent>
                        <TabsContent value="merchs" className="p-6">
                            <MerchTab />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}

export default DashboardAdmin