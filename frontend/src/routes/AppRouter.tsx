import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Register from "../components/auth/Register";
import Login from "../components/auth/Login";
import { NoAuthGuard } from "@/guard/noAuthGuard";
import { RolGuard } from "@/guard/rolGuard";
import DashboardAdmin from "@/pages/DashboardAdmin";
import DashboardArbitre from "@/pages/DashboardArbitre";
import DashboardEntrenador from "@/pages/DashboardEntrenador";
import AlineacioPartit from "@/components/partits/AlineacioPartit";
import PropostesTest from "@/pages/PropostesTest";

const AppRouter = () => {
    return (
        <BrowserRouter>
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 pt-16">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/register" element={<NoAuthGuard><Register /></NoAuthGuard>} />
                        <Route path="/login" element={<NoAuthGuard><Login /></NoAuthGuard>} />
                        <Route
                            path="/dashboardAdmin"
                            element={
                                <RolGuard allowedRoles={["ADMIN_WEB"]}>
                                    <DashboardAdmin />
                                </RolGuard>
                            }
                        />
                        <Route
                            path="/dashboardArbitre"
                            element={
                                <RolGuard allowedRoles={["ARBITRE"]}>
                                    <DashboardArbitre />
                                </RolGuard>
                            }
                        />
                        <Route
                            path="/dashboardEntrenador"
                            element={
                                <RolGuard allowedRoles={["ENTRENADOR"]}>
                                    <DashboardEntrenador />
                                </RolGuard>
                            }
                        />
                        <Route
                            path="/entrenador/partits/:partitId/alineacio"
                            element={<AlineacioPartit />}
                        />
                        <Route path="/propostes-test" element={<PropostesTest />} />

                    </Routes>
                </main>
                <Footer />
            </div>
        </BrowserRouter>
    );
};

export default AppRouter;