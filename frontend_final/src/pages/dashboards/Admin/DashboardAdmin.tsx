import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UsersTab } from "@/components/dashboards/Admin/Users/UsersTab"
import { MerchTab } from "@/components/dashboards/Admin/Merch/MerchTab"

const DashboardAdmin = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-900 p-6 md:p-10">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-warm-900 dark:text-warm-100 mb-2">Panel de Administración</h1>
                    <p className="text-warm-600 dark:text-warm-300">Gestiona los usuarios y configuraciones del sistema</p>
                </div>

                {/* Tabs Section */}
                <div className="card">
                    <Tabs defaultValue="users" className="w-full">
                        <TabsList className="bg-white dark:bg-slate-800 border-b border-warm-200 dark:border-slate-700 rounded-b-none">
                            <TabsTrigger
                                value="users"
                                className="text-warm-700 dark:text-warm-300 data-[state=active]:text-warm-900 dark:data-[state=active]:text-warm-100 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700"
                            >
                                👥 Usuarios
                            </TabsTrigger>
                            <TabsTrigger
                                value="merch"
                                className="text-warm-700 dark:text-warm-300 data-[state=active]:text-warm-900 dark:data-[state=active]:text-warm-100 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700"
                            >
                                🛍️ Merchandaising
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="users" className="p-6">
                            <UsersTab />
                        </TabsContent>
                        <TabsContent value="merch" className="p-6">
                            <MerchTab />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
export default DashboardAdmin