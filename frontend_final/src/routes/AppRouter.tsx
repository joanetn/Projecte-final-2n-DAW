import { BrowserRouter, Routes, Route } from "react-router-dom"
import DashboardAdmin from "@/pages/dashboards/Admin/DashboardAdmin"
import DashboardAdminWeb from "@/pages/dashboards/AdminWeb/DashboardAdminWeb"
import DashboardJugador from "@/pages/dashboards/Jugador/DashboardJugador"
import DashboardAdminClub from "@/pages/dashboards/AdminClub/DashboardAdminClub"
import DashboardArbitre from "@/pages/dashboards/Arbitre/DashboardArbitre"
import DashboardEntrenador from "@/pages/dashboards/Entrenador/DashboardEntrenador"
import AlineacioPage from "@/pages/AlineacioPage"
import ActaPage from "@/pages/ActaPage"
import PartitDetailPage from '@/pages/PartitDetailPage'
import Home from "@/pages/Home"
import RoleBasedHome from "@/pages/RoleBasedHome"
import ShopPage from "@/pages/ShopPage"
import CartPage from "@/pages/CartPage"
import LoginPage from "@/pages/LoginPage"
import RegisterPage from "@/pages/RegisterPage"
import GuestGuard from '@/guard/guestGuard'
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
                        path="/home"
                        element={<RoleBasedHome />}
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
                        path="/dashboardAdminWeb"
                        element={
                            <RolGuard allowedRoles={["ADMIN_WEB"]}>
                                <DashboardAdminWeb />
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
                            <RolGuard allowedRoles={["ADMIN_CLUB", "ENTRENADOR"]}>
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
                        path="/partits/:partitId"
                        element={
                            <RolGuard allowedRoles={["JUGADOR", "ENTRENADOR", "ARBITRE", "ADMIN_WEB", "ADMIN_CLUB"]}>
                                <PartitDetailPage />
                            </RolGuard>
                        }
                    />
                    <Route
                        path="/login"
                        element={
                            <GuestGuard>
                                <LoginPage />
                            </GuestGuard>
                        }
                    />
                    <Route
                        path="/register"
                        element={
                            <GuestGuard>
                                <RegisterPage />
                            </GuestGuard>
                        }
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