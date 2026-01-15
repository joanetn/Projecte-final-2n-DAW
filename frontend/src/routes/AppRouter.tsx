import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Register from "../components/Register";
import Login from "../components/Login";
import { NoAuthGuard } from "@/guard/noAuthGuard";

const AppRouter = () => {
    return (
        <BrowserRouter>
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 pt-16">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/register" element={<NoAuthGuard><Register /></NoAuthGuard>} />
                        <Route path="/login" element={<Login />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </BrowserRouter>
    );
};

export default AppRouter;