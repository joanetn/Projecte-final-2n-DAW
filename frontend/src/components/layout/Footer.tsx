import { Link } from "react-router-dom";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Logo y descripción */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">PP</span>
                            </div>
                            <span className="text-xl font-semibold text-gray-900">
                                PadelPlay
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 max-w-md">
                            La plataforma líder per gestionar les teves lligues de pàdel.
                            Organitza tornejos, segueix estadístiques i connecta amb jugadors.
                        </p>
                    </div>

                    {/* Navegación */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-4">
                            Navegació
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    to="/"
                                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    Inici
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/login"
                                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    Iniciar sessió
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/register"
                                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    Registrar-se
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-4">
                            Legal
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <a
                                    href="#"
                                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    Privacitat
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    Termes i condicions
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    Contacte
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                    <p className="text-sm text-gray-600 text-center">
                        © {currentYear} PadelPlay. Tots els drets reservats.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;