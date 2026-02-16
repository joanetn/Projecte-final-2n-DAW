import { BrowserRouter, Routes, Route } from "react-router-dom"
import DashboardAdmin from "@/pages/dashboards/Admin/DashboardAdmin"

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/dashboardAdmin"
                    element={<DashboardAdmin />}
                />
            </Routes>
        </BrowserRouter>
    )
}
export default AppRouter