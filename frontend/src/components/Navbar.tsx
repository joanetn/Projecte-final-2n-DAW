import { Link } from "react-router-dom";
import "../styles/index.css";

const Navbar = () => {
    return (
        <nav style={{ padding: "1rem", background: "#f5f5f5", borderBottom: "1px solid #ddd" }}>
            <Link to="/" style={{ marginRight: "1rem" }}>Home</Link>
            <Link to="/auth" style={{ marginRight: "1rem" }}>Auth</Link>
            <Link to="/register" style={{ marginRight: "1rem" }}>Registrarse</Link>
            <Link to="/login">Login</Link>
        </nav>
    );
};

export default Navbar;
