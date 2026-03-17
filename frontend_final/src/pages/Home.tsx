import { useAuth } from "@/context/AuthContext"
import { LandingPage } from "@/components/home/LandingPage"
import { AuthenticatedHome } from "@/components/home/AuthenticatedHome"

const Home = () => {
    const { isAuthenticated, isLoading } = useAuth()

    if (isLoading) return null

    return isAuthenticated ? <AuthenticatedHome /> : <LandingPage />
}

export default Home