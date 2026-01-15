import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Register from "../components/Register";
import Login from "../components/Login";
import { NoAuthGuard } from "@/guard/noAuthGuard";
import { RolGuard } from "@/guard/rolGuard";
import DashboardAdmin from "@/pages/DashboardAdmin";
import DashboardArbitre from "@/pages/DashboardArbitre";
import DashboardEntrenador from "@/pages/DashboardEntrenador";

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
                    </Routes>
                </main>
                <Footer />
            </div>
        </BrowserRouter>
    );
};

export default AppRouter;