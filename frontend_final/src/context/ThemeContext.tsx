import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
    theme: Theme
    toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(() => {
        // Comprueba si hay tema guardado en localStorage
        const saved = localStorage.getItem('theme')
        if (saved === 'dark' || saved === 'light') {
            return saved
        }
        // Por defecto modo claro
        return 'light'
    })

    useEffect(() => {
        // Actualiza el atributo HTML y localStorage
        const htmlElement = document.documentElement
        if (theme === 'dark') {
            htmlElement.classList.add('dark')
        } else {
            htmlElement.classList.remove('dark')
        }
        localStorage.setItem('theme', theme)
    }, [theme])

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light')
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme debe ser usado dentro de ThemeProvider')
    }
    return context
}
