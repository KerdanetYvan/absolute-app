"use client";

import { createContext, useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { 
    setupAxiosInterceptors, 
    saveAuthData, 
    clearAuthData, 
    restoreAuthData, 
    isTokenExpired 
} from "@/lib/auth-utils";

// Interface defining types for authentication context
interface AuthContextType {
    auth: any; // Connected user data
    token: string | null; // JWT token
    login: (dataForm: any) => Promise<void>; // Login function
    logout: () => void; // Logout function
    isLoading: boolean; // Loading state during operations
    isAuthenticated: boolean; // Authentication status
}

// Creating the authentication context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider that wraps the application to provide authentication context
export const AuthProvider = ({ children }: { children: ReactNode }) => {    // State to manage loading during requests
    const [isLoading, setIsLoading] = useState(false);
    // State to store authentication data
    const [auth, setAuth] = useState(null);
    // State to store JWT token
    const [token, setToken] = useState<string | null>(null);
    // State to track if component is mounted (client-side)
    const [isClient, setIsClient] = useState(false);

    const router = useRouter();

    // Computed property for authentication status
    const isAuthenticated = !!auth && !!token;    // Effect to initialize client-side state
    useEffect(() => {
        setIsClient(true);
        
        // Restaurer les données d'authentification depuis le localStorage
        const { user, token: storedToken } = restoreAuthData();
        
        if (user && storedToken) {
            console.log('🔄 Restauration des données d\'authentification');
            setAuth(user);
            setToken(storedToken);
        }
    }, []);    // User login function
    const login = async (dataForm: any) => {
        setIsLoading(true);

        try {
            console.log('🔄 Sending login request...');
            // Send login request to API
            const { data, status } = await axios.post('/api/auth/login', dataForm);
            console.log('📨 Login response:', data);
            
            if (status === 200 && data.success) {
                // Extract user data and token from response
                const { user, token: receivedToken } = data;
                
                console.log('✅ Login successful, saving auth data');
                console.log('👤 User:', user);
                console.log('🔑 Token received:', !!receivedToken);
                
                // Save user data and token in state
                setAuth(user);
                setToken(receivedToken);
                
                // Save in localStorage and setup Axios
                saveAuthData(user, receivedToken);
                
                // Redirect to home page after successful login
                router.push('/');
                setIsLoading(false);
            } else {
                throw new Error('Login response format incorrect');
            }
        } catch (error) {
            console.error("❌ Login failed:", error);
            setIsLoading(false);
            throw error; // Re-throw error to handle it in component
        }
    }    // User logout function
    const logout = () => {
        console.log('🔄 Logging out...');
        
        // Remove authentication data from state
        setAuth(null);
        setToken(null);
        
        // Clear localStorage and cookies
        clearAuthData();
        
        // Redirect to login page
        router.push('/auth/login');
    };

    // Don't render until client-side hydration is complete
    if (!isClient) {
        return null;
    }    // Provide context to all child components
    return (
        <AuthContext.Provider value={{ 
            auth, 
            token, 
            login, 
            logout, 
            isLoading, 
            isAuthenticated 
        }}>
            {children}
        </AuthContext.Provider>
    );
};