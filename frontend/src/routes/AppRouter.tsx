import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from '../pages/Auth';
import Home from "../pages/Home";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Register from "../components/Register";
import Login from "../components/Login";

const AppRouter = () => {
    return (
        <BrowserRouter>
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 pt-16">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/auth" element={<Auth />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </BrowserRouter>
    );
};

export default AppRouter;