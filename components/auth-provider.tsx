"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

type User = {
  email: string
} | null

type AuthContextType = {
  user: User
  setUser: (user: User) => void
  signOut: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  signOut: () => {},
  isLoading: true,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Load user from localStorage on initial mount
  useEffect(() => {
    try {
      // Check if we're in a browser environment
      if (typeof window !== "undefined") {
        const storedUser = localStorage.getItem("althea_user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      }
    } catch (error) {
      console.error("Error loading auth state:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Handle auth redirects
  useEffect(() => {
    if (!isLoading) {
      const isAuthRoute = pathname?.startsWith("/auth")

      if (!user && !isAuthRoute && pathname !== "/" && pathname !== "/dashboard") {
        // Redirect to login if not authenticated and trying to access protected routes
        router.push("/auth/login")
      } else if (user && isAuthRoute) {
        // Redirect to home if authenticated and trying to access auth routes
        router.push("/")
      }
    }
  }, [user, isLoading, pathname, router])

  const handleSignOut = () => {
    localStorage.removeItem("althea_user")
    setUser(null)
    router.push("/auth/login")
  }

  // For debugging
  useEffect(() => {
    console.log("Auth state updated:", { user, isLoading })
  }, [user, isLoading])

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        signOut: handleSignOut,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

