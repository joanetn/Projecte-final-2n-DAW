import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ResumTab } from '@/components/dashboards/adminWeb/ResumTab'
import { UsuarisTab } from '@/components/dashboards/adminWeb/UsuarisTab'
import { EquipsTab } from '@/components/dashboards/adminWeb/EquipsTab'
import { LliguesTab } from '@/components/dashboards/adminWeb/LliguesTab'
import { PartitsTab } from '@/components/dashboards/adminWeb/PartitsTab'
import { ReprogramacionsTab } from '@/components/dashboards/adminWeb/ReprogramacionsTab'
import { ArbitresTab } from '@/components/dashboards/adminWeb/ArbitresTab'
import { ClassificacioTab } from '@/components/dashboards/adminWeb/ClassificacioTab'
import { PermissionsTab } from '@/components/dashboards/adminWeb/PermissionsTab'
import { usePermissions } from '@/hooks/usePermissions'
import { AdminPermissions } from '@/types/permissions'

const DashboardAdminWeb = () => {
    const { can } = usePermissions()

    return (
        <div className="min-h-screen bg-white dark:bg-slate-900 p-6 md:p-10">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-warm-900 dark:text-warm-100 mb-2">
                        Panel Admin Web
                    </h1>
                    <p className="text-warm-600 dark:text-warm-300">
                        Gestió d'usuaris, equips, lligues, partits i àrbitres
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
                                value="reprogramacions"
                                className="text-warm-700 dark:text-warm-300 data-[state=active]:text-warm-900 dark:data-[state=active]:text-warm-100 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700"
                            >
                                🔁 Reprogramacions
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
                            {can(AdminPermissions.USUARIS_EDIT) && (
                                <TabsTrigger
                                    value="permisos"
                                    className="text-warm-700 dark:text-warm-300 data-[state=active]:text-warm-900 dark:data-[state=active]:text-warm-100 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700"
                                >
                                    🔐 Permisos
                                </TabsTrigger>
                            )}
                        </TabsList>

                        <TabsContent value="resum" className="p-6">
                            <ResumTab />
                        </TabsContent>
                        <TabsContent value="usuaris" className="p-6">
                            <UsuarisTab />
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
                        <TabsContent value="reprogramacions" className="p-6">
                            <ReprogramacionsTab />
                        </TabsContent>
                        <TabsContent value="arbitres" className="p-6">
                            <ArbitresTab />
                        </TabsContent>
                        <TabsContent value="classificacio" className="p-6">
                            <ClassificacioTab />
                        </TabsContent>
                        <TabsContent value="permisos" className="p-6">
                            <PermissionsTab />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}

export default DashboardAdminWeb
