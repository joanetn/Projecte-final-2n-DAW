import { BrowserRouter, Routes, Route } from "react-router-dom"
import DashboardAdmin from "@/pages/dashboards/Admin/DashboardAdmin"
import DashboardJugador from "@/pages/dashboards/Jugador/DashboardJugador"
import DashboardAdminClub from "@/pages/dashboards/AdminClub/DashboardAdminClub"
import DashboardArbitre from "@/pages/dashboards/Arbitre/DashboardArbitre"
import DashboardEntrenador from "@/pages/dashboards/Entrenador/DashboardEntrenador"
import AlineacioPage from "@/pages/AlineacioPage"
import ActaPage from "@/pages/ActaPage"
import Home from "@/pages/Home"
import ShopPage from "@/pages/ShopPage"
import CartPage from "@/pages/CartPage"
import LoginPage from "@/pages/LoginPage"
import RegisterPage from "@/pages/RegisterPage"
import { Layout } from "@/components/layout/Layout"
import Profile from "@/pages/Profile"
import Insurances from "@/pages/InsurancePage"
import { RolGuard } from "@/guard/rolGuard"

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route
                        path="/"
                        element={<Home />}
                    />
                    <Route
                        path="/shop"
                        element={<ShopPage />}
                    />
                    <Route
                        path="/carrito"
                        element={<CartPage />}
                    />
                    <Route
                        path="/dashboardAdmin"
                        element={
                            <RolGuard allowedRoles={["ADMIN_WEB"]}>
                                <DashboardAdmin />
                            </RolGuard>
                        }
                    />
                    <Route
                        path="/dashboardJugador"
                        element={
                            <RolGuard allowedRoles={["JUGADOR", "ADMIN_WEB"]}>
                                <DashboardJugador />
                            </RolGuard>
                        }
                    />
                    <Route
                        path="/dashboardAdminClub"
                        element={
                            <RolGuard allowedRoles={["ADMIN_CLUB", "ADMIN_WEB", "ENTRENADOR"]}>
                                <DashboardAdminClub />
                            </RolGuard>
                        }
                    />
                    <Route
                        path="/dashboardArbitre"
                        element={
                            <RolGuard allowedRoles={["ARBITRE", "ADMIN_WEB"]}>
                                <DashboardArbitre />
                            </RolGuard>
                        }
                    />
                    <Route
                        path="/dashboardEntrenador"
                        element={
                            <RolGuard allowedRoles={["ENTRENADOR", "ADMIN_WEB"]}>
                                <DashboardEntrenador />
                            </RolGuard>
                        }
                    />
                    <Route
                        path="/alineacio/:partitId"
                        element={
                            <RolGuard allowedRoles={["ENTRENADOR", "ADMIN_CLUB", "ADMIN_WEB"]}>
                                <AlineacioPage />
                            </RolGuard>
                        }
                    />
                    <Route
                        path="/acta/:partitId"
                        element={
                            <RolGuard allowedRoles={["ARBITRE", "ADMIN_WEB"]}>
                                <ActaPage />
                            </RolGuard>
                        }
                    />
                    <Route
                        path="/login"
                        element={<LoginPage />}
                    />
                    <Route
                        path="/register"
                        element={<RegisterPage />}
                    />
                    <Route
                        path="/profile"
                        element={<Profile />}
                    />
                    <Route
                        path="/seguro"
                        element={<Insurances />}
                    />
                </Routes>
            </Layout>
        </BrowserRouter>
    )
}
export default AppRouter