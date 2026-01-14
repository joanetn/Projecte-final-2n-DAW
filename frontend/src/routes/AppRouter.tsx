
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from '../pages/Auth';
import Home from "../pages/Home";
import Navbar from "../components/Navbar";
import Register from "../components/Register";
import Login from "../components/Login";

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;
