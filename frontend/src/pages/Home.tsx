import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useTeEquip } from "@/queries/auth.queries";
import { CrearClubForm } from "@/components/forms/CrearClubForm";
import {
    Trophy,
    Users,
    Calendar,
    Shield,
    Target,
    Zap,
    Award,
    ChevronRight,
    Star,
    BarChart3,
    Clock,
    CheckCircle2,
    ArrowRight,
    Sparkles,
    UserCheck,
    ClipboardList,
    Medal,
    Handshake,
    PlayCircle,
    Info
} from "lucide-react";
import { useState, useEffect } from "react";
const useCounter = (end: number, duration: number = 2000) => {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        if (!isVisible) return;
        let startTime: number;
        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };
        requestAnimationFrame(step);
    }, [end, duration, isVisible]);
    return { count, setIsVisible };
};
const FeatureCard = ({
    icon: Icon,
    title,
    description,
    gradient,
    details
}: {
    icon: React.ElementType;
    title: string;
    description: string;
    gradient: string;
    details?: string[];
}) => (
    <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-card to-card/80 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${gradient}`} />
        <CardHeader className="pb-2">
            <div className={`w-14 h-14 rounded-2xl ${gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-7 h-7 text-white" />
            </div>
            <CardTitle className="text-xl font-bold">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
            <CardDescription className="text-base leading-relaxed">{description}</CardDescription>
            {details && details.length > 0 && (
                <ul className="space-y-1.5 pt-2">
                    {details.map((detail, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>{detail}</span>
                        </li>
                    ))}
                </ul>
            )}
        </CardContent>
    </Card>
);
const StatCard = ({ value, label, icon: Icon }: { value: number; label: string; icon: React.ElementType }) => {
    const { count, setIsVisible } = useCounter(value);
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.5 }
        );
        const element = document.getElementById(`stat-${label}`);
        if (element) observer.observe(element);
        return () => observer.disconnect();
    }, [label, setIsVisible]);
    return (
        <div id={`stat-${label}`} className="text-center group">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                <Icon className="w-8 h-8 text-primary" />
            </div>
            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {count}+
            </div>
            <div className="text-muted-foreground mt-2 font-medium">{label}</div>
        </div>
    );
};
const TestimonialCard = ({
    quote,
    author,
    role,
    rating
}: {
    quote: string;
    author: string;
    role: string;
    rating: number;
}) => (
    <Card className="border-0 bg-gradient-to-br from-card to-muted/30 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="pt-6">
            <div className="flex gap-1 mb-4">
                {[...Array(rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
            </div>
            <p className="text-muted-foreground italic mb-6 leading-relaxed">"{quote}"</p>
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-bold text-lg">
                    {author.charAt(0)}
                </div>
                <div>
                    <div className="font-semibold">{author}</div>
                    <div className="text-sm text-muted-foreground">{role}</div>
                </div>
            </div>
        </CardContent>
    </Card>
);
const Home = () => {
    const { user } = useAuth();
    const { data: dataTeEquip, isLoading } = useTeEquip();
    const isLoggedIn = !!user;
    const teEquip = dataTeEquip;
    const HeroSection = () => (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden hero-gradient-bg">
            { }
            <div className="floating-orb floating-orb-1" />
            <div className="floating-orb floating-orb-2" />
            <div className="floating-orb floating-orb-3" />
            <div className="floating-orb floating-orb-4" />
            { }
            <div className="mesh-gradient" />
            { }
            <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                }}
            />
            { }
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[15%] left-[10%] icon-float">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm flex items-center justify-center border border-blue-500/10">
                        <Trophy className="w-8 h-8 text-blue-500/60" />
                    </div>
                </div>
                <div className="absolute top-[25%] right-[12%] icon-float-delayed">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm flex items-center justify-center border border-purple-500/10">
                        <Target className="w-7 h-7 text-purple-500/60" />
                    </div>
                </div>
                <div className="absolute bottom-[25%] left-[8%] icon-float-delayed">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm flex items-center justify-center border border-green-500/10">
                        <Award className="w-6 h-6 text-green-500/60" />
                    </div>
                </div>
                <div className="absolute bottom-[35%] right-[8%] icon-float">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 backdrop-blur-sm flex items-center justify-center border border-amber-500/10">
                        <Zap className="w-7 h-7 text-amber-500/60" />
                    </div>
                </div>
                <div className="absolute top-[50%] left-[20%] icon-float">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-rose-500/20 to-red-500/20 backdrop-blur-sm flex items-center justify-center border border-rose-500/10">
                        <Star className="w-5 h-5 text-rose-500/60" />
                    </div>
                </div>
                <div className="absolute top-[60%] right-[18%] icon-float-delayed">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-blue-500/20 backdrop-blur-sm flex items-center justify-center border border-indigo-500/10">
                        <Users className="w-6 h-6 text-indigo-500/60" />
                    </div>
                </div>
            </div>
            <div className="relative z-10 container mx-auto px-4 py-20">
                <div className="max-w-4xl mx-auto text-center">
                    { }
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/20 mb-8 animate-fade-in backdrop-blur-sm">
                        <div className="relative">
                            <Sparkles className="w-5 h-5 text-blue-500" />
                            <div className="absolute inset-0 animate-ping">
                                <Sparkles className="w-5 h-5 text-blue-500/50" />
                            </div>
                        </div>
                        <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                            Sistema de Gestió de Lligues de Pàdel
                        </span>
                    </div>
                    { }
                    <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight animate-fade-in-up">
                        <span className="block text-foreground mb-2">
                            La teua lliga de pàdel,
                        </span>
                        <span className="gradient-text-animated text-6xl md:text-8xl">
                            organitzada i professional
                        </span>
                    </h1>
                    { }
                    <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-200">
                        Plataforma integral per a la gestió de competicions de pàdel.
                        Des de la creació de partits fins al seguiment de classificacions,
                        <span className="text-foreground font-medium"> tot en un sol lloc</span> per a entrenadors, àrbitres i jugadors.
                    </p>
                    { }
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up delay-300">
                        <Link to="/register">
                            <Button size="lg" className="shimmer-btn text-lg px-10 py-7 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-105 transition-all duration-300 group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 border-0">
                                <span className="relative z-10 flex items-center">
                                    Registra't Gratuïtament
                                    <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </Button>
                        </Link>
                        <Link to="/login">
                            <Button variant="outline" size="lg" className="text-lg px-10 py-7 hover:bg-muted/80 transition-all duration-300 backdrop-blur-sm border-2">
                                Ja tinc compte
                            </Button>
                        </Link>
                    </div>
                    { }
                    <div className="mt-16 flex flex-wrap justify-center gap-6 md:gap-10 animate-fade-in-up delay-500">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20">
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                            <span className="text-sm font-medium text-green-700 dark:text-green-400">Completament gratuït</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20">
                            <CheckCircle2 className="w-5 h-5 text-blue-500" />
                            <span className="text-sm font-medium text-blue-700 dark:text-blue-400">Sense instal·lació</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20">
                            <CheckCircle2 className="w-5 h-5 text-purple-500" />
                            <span className="text-sm font-medium text-purple-700 dark:text-purple-400">Temps real</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
    const WelcomeSection = () => {
        const isArbitre = user?.rols?.includes("ARBITRE");

        return (
            <section className="relative py-16 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                <div className="relative container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center mb-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            <span className="text-sm font-medium text-green-600 dark:text-green-400">Sessió iniciada correctament</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
                            <span className="text-muted-foreground">Hola, </span>
                            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text">
                                {user?.nom}! 👋
                            </span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Benvingut/da de nou a la plataforma. Ací baix pots veure tota la informació sobre com funciona el sistema.
                        </p>
                    </div>

                    {!isLoading && (
                        <>
                            {!isArbitre && !teEquip && (
                                <div className="max-w-md mx-auto mt-8">
                                    <CrearClubForm />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        );
    };
    return (
        <div className="min-h-screen">
            { }
            {isLoggedIn ? <WelcomeSection /> : <HeroSection />}
            { }
            <section className="py-20 section-gradient-blue relative overflow-hidden">
                { }
                <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
                <div className="container mx-auto px-4 relative">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 mb-4 backdrop-blur-sm">
                                <Info className="w-4 h-4 text-blue-500" />
                                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Sobre la plataforma</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold mb-4">
                                Què és aquesta plataforma?
                            </h2>
                            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                                Som un sistema de gestió integral dissenyat específicament per a <strong className="text-blue-600 dark:text-blue-400">lligues de pàdel</strong>.
                                La nostra plataforma connecta entrenadors, àrbitres i jugadors en un ecosistema digital
                                que simplifica tota l'organització de les competicions.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8 mt-12">
                            <Card className="card-lift border-0 shadow-lg bg-gradient-to-br from-card via-card to-blue-500/5 overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-transparent rounded-bl-full" />
                                <CardContent className="p-8 relative">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/25">
                                        <Target className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4">El nostre objectiu</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        Facilitar la gestió de lligues de pàdel eliminant la paperassa i els processos manuals.
                                        Volem que els entrenadors puguen centrar-se en el que realment importa:
                                        <strong className="text-foreground"> formar als seus jugadors i gaudir de l'esport</strong>.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="card-lift border-0 shadow-lg bg-gradient-to-br from-card via-card to-green-500/5 overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/20 to-transparent rounded-bl-full" />
                                <CardContent className="p-8 relative">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-6 shadow-lg shadow-green-500/25">
                                        <Handshake className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4">Per a qui és?</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        Per a qualsevol persona involucrada en competicions de pàdel:
                                        <strong className="text-blue-600 dark:text-blue-400"> entrenadors</strong> que gestionen equips,
                                        <strong className="text-amber-600 dark:text-amber-400"> àrbitres</strong> que registren resultats, i
                                        <strong className="text-green-600 dark:text-green-400"> jugadors</strong> que volen estar al dia de les seues convocatòries.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>
            { }
            <section className="py-20 section-gradient-purple relative overflow-hidden">
                { }
                <div className="absolute top-1/4 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl translate-x-1/2" />
                <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl -translate-x-1/2" />
                <div className="container mx-auto px-4 relative">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 mb-4 backdrop-blur-sm">
                            <PlayCircle className="w-4 h-4 text-purple-500" />
                            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">Pas a pas</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">
                            Com funciona el sistema?
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Un procés senzill i intuïtiu per organitzar partits i competicions
                        </p>
                    </div>
                    <div className="max-w-5xl mx-auto">
                        <div className="grid gap-8">
                            { }
                            <div className="flex flex-col md:flex-row gap-6 items-start group">
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                                        1
                                    </div>
                                </div>
                                <Card className="flex-1 border-0 shadow-lg">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-3 mb-3">
                                            <UserCheck className="w-6 h-6 text-blue-500" />
                                            <h3 className="text-xl font-bold">Registre i assignació de rols</h3>
                                        </div>
                                        <p className="text-muted-foreground leading-relaxed mb-4">
                                            Els usuaris es registren a la plataforma i reben els seus rols corresponents.
                                            Cada rol té funcionalitats específiques adaptades a les seues necessitats.
                                        </p>
                                        <div className="grid sm:grid-cols-3 gap-4 mt-4">
                                            <div className="flex items-center gap-2 text-sm">
                                                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                                    <Users className="w-4 h-4 text-blue-500" />
                                                </div>
                                                <span><strong>Entrenador:</strong> Gestiona equip</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                                                    <Shield className="w-4 h-4 text-amber-500" />
                                                </div>
                                                <span><strong>Àrbitre:</strong> Registra partits</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                                                    <Medal className="w-4 h-4 text-green-500" />
                                                </div>
                                                <span><strong>Jugador:</strong> Rep convocatòries</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                            { }
                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                                        2
                                    </div>
                                </div>
                                <Card className="flex-1 border-0 shadow-lg">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-3 mb-3">
                                            <Calendar className="w-6 h-6 text-green-500" />
                                            <h3 className="text-xl font-bold">Creació i proposta de partits</h3>
                                        </div>
                                        <p className="text-muted-foreground leading-relaxed mb-4">
                                            Els entrenadors poden proposar dates per als partits. El sistema envia notificacions
                                            a l'altre equip, que pot acceptar o rebutjar la proposta. Quan s'accepta,
                                            el partit queda confirmat automàticament.
                                        </p>
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-sm font-medium">
                                                ✓ Propostes de data
                                            </span>
                                            <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-sm font-medium">
                                                ✓ Notificacions automàtiques
                                            </span>
                                            <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-sm font-medium">
                                                ✓ Confirmació instantània
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                            { }
                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                                        3
                                    </div>
                                </div>
                                <Card className="flex-1 border-0 shadow-lg">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-3 mb-3">
                                            <ClipboardList className="w-6 h-6 text-amber-500" />
                                            <h3 className="text-xl font-bold">Configuració d'alineacions</h3>
                                        </div>
                                        <p className="text-muted-foreground leading-relaxed mb-4">
                                            Abans del partit, l'entrenador configura l'alineació seleccionant els jugadors
                                            que participaran. El sistema permet arrossegar i ordenar els jugadors en les
                                            diferents posicions del partit.
                                        </p>
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-sm font-medium">
                                                ✓ Drag & Drop intuïtiu
                                            </span>
                                            <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-sm font-medium">
                                                ✓ Invitacions a jugadors
                                            </span>
                                            <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-sm font-medium">
                                                ✓ Gestió de convocatòries
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                            { }
                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                                        4
                                    </div>
                                </div>
                                <Card className="flex-1 border-0 shadow-lg">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-3 mb-3">
                                            <Trophy className="w-6 h-6 text-purple-500" />
                                            <h3 className="text-xl font-bold">Registre de resultats i rànquing</h3>
                                        </div>
                                        <p className="text-muted-foreground leading-relaxed mb-4">
                                            Després del partit, l'àrbitre registra el resultat. La classificació s'actualitza
                                            automàticament amb els punts corresponents. Tots els usuaris poden consultar
                                            el rànquing en temps real.
                                        </p>
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-sm font-medium">
                                                ✓ Resultats oficials
                                            </span>
                                            <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-sm font-medium">
                                                ✓ Classificació automàtica
                                            </span>
                                            <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-sm font-medium">
                                                ✓ Historial complet
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            { }
            <section className="py-20 section-gradient-green relative overflow-hidden">
                { }
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
                <div className="container mx-auto px-4 relative">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 mb-4 backdrop-blur-sm">
                            <Zap className="w-4 h-4 text-green-500" />
                            <span className="text-sm font-medium text-green-600 dark:text-green-400">Característiques</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">
                            Funcionalitats principals
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Totes les eines que necessites per gestionar la teua lliga de manera eficient
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        <FeatureCard
                            icon={Calendar}
                            title="Gestió de Partits"
                            description="Sistema complet per programar, proposar i confirmar partits entre equips de la lliga."
                            gradient="bg-gradient-to-br from-blue-500 to-cyan-500"
                            details={[
                                "Proposa dates als rivals",
                                "Rep notificacions d'acceptació",
                                "Calendari de partits pendents"
                            ]}
                        />
                        <FeatureCard
                            icon={Users}
                            title="Plantilla i Alineacions"
                            description="Gestiona els jugadors del teu equip i configura les alineacions per a cada partit."
                            gradient="bg-gradient-to-br from-green-500 to-emerald-500"
                            details={[
                                "Llista completa de jugadors",
                                "Editor d'alineacions visual",
                                "Invitacions a jugadors"
                            ]}
                        />
                        <FeatureCard
                            icon={Trophy}
                            title="Rànquing i Classificació"
                            description="Segueix la classificació de la lliga actualitzada en temps real amb totes les estadístiques."
                            gradient="bg-gradient-to-br from-amber-500 to-orange-500"
                            details={[
                                "Taula de classificació",
                                "Punts i partits jugats",
                                "Historial de resultats"
                            ]}
                        />
                        <FeatureCard
                            icon={Clock}
                            title="Notificacions en Temps Real"
                            description="Rep alertes instantànies sobre propostes de partits, convocatòries i actualitzacions."
                            gradient="bg-gradient-to-br from-red-500 to-rose-500"
                            details={[
                                "Alertes de propostes noves",
                                "Avisos de convocatòria",
                                "Recordatoris de partits"
                            ]}
                        />
                        <FeatureCard
                            icon={Shield}
                            title="Panell d'Àrbitre"
                            description="Eines específiques perquè els àrbitres puguen registrar i validar els resultats oficials."
                            gradient="bg-gradient-to-br from-indigo-500 to-violet-500"
                            details={[
                                "Registre de marcadors",
                                "Validació de resultats",
                                "Historial d'arbitratges"
                            ]}
                        />
                        <FeatureCard
                            icon={BarChart3}
                            title="Estadístiques Detallades"
                            description="Consulta estadístiques completes d'equips, jugadors i competicions."
                            gradient="bg-gradient-to-br from-purple-500 to-pink-500"
                            details={[
                                "Rendiment per equip",
                                "Gràfics i mètriques",
                                "Comparatives de resultats"
                            ]}
                        />
                    </div>
                </div>
            </section>
            { }
            <section className="py-20 section-gradient-amber relative overflow-hidden">
                { }
                <div className="absolute top-1/2 left-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
                <div className="absolute top-1/2 right-0 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="container mx-auto px-4 relative">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 mb-4 backdrop-blur-sm">
                            <BarChart3 className="w-4 h-4 text-amber-500" />
                            <span className="text-sm font-medium text-amber-600 dark:text-amber-400">Estadístiques</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            La nostra comunitat en xifres
                        </h2>
                        <p className="text-muted-foreground">
                            Una plataforma en creixement amb una comunitat activa
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                        <StatCard value={500} label="Usuaris registrats" icon={Users} />
                        <StatCard value={1200} label="Partits organitzats" icon={Trophy} />
                        <StatCard value={50} label="Equips actius" icon={Target} />
                        <StatCard value={98} label="% Satisfacció" icon={Award} />
                    </div>
                </div>
            </section>
            { }
            {!isLoggedIn && (
                <section className="py-20 section-gradient-blue relative overflow-hidden">
                    { }
                    <div className="absolute top-0 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
                    <div className="container mx-auto px-4 relative">
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 mb-4 backdrop-blur-sm">
                                <Star className="w-4 h-4 text-blue-500" />
                                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Testimonis</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                El que diuen els nostres usuaris
                            </h2>
                            <p className="text-xl text-muted-foreground">
                                Experiències reals de persones que utilitzen la plataforma
                            </p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                            <TestimonialCard
                                quote="Abans organitzàvem els partits per WhatsApp i era un caos. Ara tot està centralitzat i és molt més fàcil coordinar-se amb els altres equips."
                                author="Marc García"
                                role="Entrenador - Club Pàdel València"
                                rating={5}
                            />
                            <TestimonialCard
                                quote="Com a àrbitre, m'encanta poder registrar els resultats directament des del mòbil. El sistema actualitza la classificació automàticament."
                                author="Laura Martínez"
                                role="Àrbitre oficial"
                                rating={5}
                            />
                            <TestimonialCard
                                quote="Rebo les convocatòries amb temps i puc confirmar la meua assistència fàcilment. Ja no em perdo cap partit per falta d'informació."
                                author="Pau Soler"
                                role="Jugador"
                                rating={5}
                            />
                        </div>
                    </div>
                </section>
            )}
            { }
            {!isLoggedIn && (
                <section className="py-24 relative overflow-hidden">
                    { }
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600" />
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
                    { }
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
                    { }
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-10 left-10 w-32 h-32 border border-white/20 rounded-full animate-pulse" />
                        <div className="absolute bottom-10 right-10 w-48 h-48 border border-white/20 rounded-full animate-pulse delay-500" />
                        <div className="absolute top-1/2 left-1/4 w-24 h-24 border border-white/10 rounded-full animate-pulse delay-1000" />
                    </div>
                    <div className="container mx-auto px-4 relative">
                        <div className="max-w-3xl mx-auto text-center text-white">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">
                                Preparat per organitzar la teua lliga?
                            </h2>
                            <p className="text-xl opacity-90 mb-10 leading-relaxed">
                                Uneix-te a la nostra comunitat d'entrenadors, àrbitres i jugadors.
                                El registre és completament gratuït i pots començar a utilitzar
                                la plataforma immediatament.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link to="/register">
                                    <Button size="lg" className="shimmer-btn text-lg px-10 py-7 bg-white text-purple-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                                        <span className="relative z-10 flex items-center font-semibold">
                                            Crear compte gratuït
                                            <ArrowRight className="w-5 h-5 ml-2" />
                                        </span>
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            )}
            { }
            {isLoggedIn && (
                <section className="py-16 bg-muted/30">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto text-center">
                            <h3 className="text-2xl font-bold mb-2">Explora la plataforma</h3>
                            <p className="text-muted-foreground mb-8">
                                Accedeix a les diferents seccions segons les teues necessitats
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <Link to="/ranking">
                                    <Button size="lg" className="gap-2">
                                        <BarChart3 className="w-5 h-5" />
                                        Veure Rànquing
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};
export default Home;
