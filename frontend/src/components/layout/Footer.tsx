import { Link } from "react-router-dom";
const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="bg-background border-t border-border mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">PP</span>
                            </div>
                            <span className="text-xl font-semibold text-foreground">
                                PadelPlay
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground max-w-md">
                            La plataforma líder per gestionar les teves lligues de pàdel.
                            Organitza tornejos, segueix estadístiques i connecta amb jugadors.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-foreground mb-4">
                            Navegació
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    to="/"
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Inici
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/login"
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Iniciar sessió
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/register"
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Registrar-se
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-foreground mb-4">
                            Legal
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <a
                                    href="#"
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Privacitat
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Termes i condicions
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Contacte
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-border">
                    <p className="text-sm text-muted-foreground text-center">
                        © {currentYear} PadelPlay. Tots els drets reservats.
                    </p>
                </div>
            </div>
        </footer>
    );
};
export default Footer;
