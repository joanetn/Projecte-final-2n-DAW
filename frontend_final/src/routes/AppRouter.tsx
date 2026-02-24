import { BrowserRouter, Routes, Route } from "react-router-dom"
import DashboardAdmin from "@/pages/dashboards/Admin/DashboardAdmin"
import Home from "@/pages/Home"
import LoginPage from "@/pages/LoginPage"
import RegisterPage from "@/pages/RegisterPage"
import { Layout } from "@/components/layout/Layout"
import Profile from "@/pages/Profile"

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
                        path="/dashboardAdmin"
                        element={<DashboardAdmin />}
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
                </Routes>
            </Layout>
        </BrowserRouter>
    )
}
export default AppRouter