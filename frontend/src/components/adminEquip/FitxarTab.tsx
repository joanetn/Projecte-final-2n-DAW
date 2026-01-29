import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Users, Briefcase } from "lucide-react";
import Invitacions from "../entrenador/Invitacions";
import FitxarEntrenadors from "./FitxarEntrenadors";

const FitxarTab = () => {
    return (
        <Tabs className="w-full" defaultValue="jugadors">
            <TabsList className="flex flex-wrap items-center justify-center gap-3 mb-6">
                <TabsTrigger
                    value="jugadors"
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors border border-transparent shadow-sm bg-transparent hover:bg-muted/5 data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg"
                >
                    <Users className="w-4 h-4 hidden sm:inline" />
                    <span>Jugadors</span>
                </TabsTrigger>
                <TabsTrigger
                    value="entrenadors"
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors border border-transparent shadow-sm bg-transparent hover:bg-muted/5 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg"
                >
                    <Briefcase className="w-4 h-4 hidden sm:inline" />
                    <span>Entrenadors</span>
                </TabsTrigger>
            </TabsList>
            <TabsContent value="jugadors">
                <Invitacions />
            </TabsContent>
            <TabsContent value="entrenadors">
                <FitxarEntrenadors />
            </TabsContent>
        </Tabs>
    );
};

export default FitxarTab;
