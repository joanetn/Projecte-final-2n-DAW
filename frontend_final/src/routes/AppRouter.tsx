import { BrowserRouter, Routes, Route } from "react-router-dom"
import DashboardAdmin from "@/pages/dashboards/Admin/DashboardAdmin"
import Home from "@/pages/Home"

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<Home />}
                />
                <Route
                    path="/dashboardAdmin"
                    element={<DashboardAdmin />}
                />
            </Routes>
        </BrowserRouter>
    )
}
export default AppRouter