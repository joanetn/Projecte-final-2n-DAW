import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, BarChart3, Users, Trophy, Calendar, Zap } from "lucide-react";
import { ResumTab } from "@/components/dashboards/adminWeb/ResumTab";
import { UsuarisTab } from "@/components/dashboards/adminWeb/UsuarisTab";
import { EquipsTab } from "@/components/dashboards/adminWeb/EquipsTab";
import { LliguesTab } from "@/components/dashboards/adminWeb/LliguesTab";
import { PartitsTab } from "@/components/dashboards/adminWeb/PartitsTab";
import { ArbitresTab } from "@/components/dashboards/adminWeb/ArbitresTab";
import { ClassificacioTab } from "@/components/dashboards/adminWeb/ClassificacioTab";

export default function DashboardAdminWeb() {
    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <Shield className="h-8 w-8 text-primary" />
                    Panell d'Administració
                </h1>
                <Tabs defaultValue="resum" className="space-y-4">
                    <TabsList className="grid grid-cols-7 w-full bg-white border">
                        <TabsTrigger value="resum" className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4" />
                            <span className="hidden sm:inline">Resum</span>
                        </TabsTrigger>
                        <TabsTrigger value="usuaris" className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span className="hidden sm:inline">Usuaris</span>
                        </TabsTrigger>
                        <TabsTrigger value="equips" className="flex items-center gap-2">
                            <Trophy className="h-4 w-4" />
                            <span className="hidden sm:inline">Equips</span>
                        </TabsTrigger>
                        <TabsTrigger value="lligues" className="flex items-center gap-2">
                            <Trophy className="h-4 w-4" />
                            <span className="hidden sm:inline">Lligues</span>
                        </TabsTrigger>
                        <TabsTrigger value="partits" className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span className="hidden sm:inline">Partits</span>
                        </TabsTrigger>
                        <TabsTrigger value="classificacio" className="flex items-center gap-2">
                            <Zap className="h-4 w-4" />
                            <span className="hidden sm:inline">Classif.</span>
                        </TabsTrigger>
                        <TabsTrigger value="arbitres" className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            <span className="hidden sm:inline">Àrbitres</span>
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="resum">
                        <ResumTab />
                    </TabsContent>
                    <TabsContent value="usuaris">
                        <UsuarisTab />
                    </TabsContent>
                    <TabsContent value="equips">
                        <EquipsTab />
                    </TabsContent>
                    <TabsContent value="lligues">
                        <LliguesTab />
                    </TabsContent>
                    <TabsContent value="partits">
                        <PartitsTab />
                    </TabsContent>
                    <TabsContent value="classificacio">
                        <ClassificacioTab />
                    </TabsContent>
                    <TabsContent value="arbitres">
                        <ArbitresTab />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
