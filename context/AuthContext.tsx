import { createContext, useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

// Interface defining types for authentication context
interface AuthContextType {
    auth: any; // Connected user data
    login: (dataForm: any) => Promise<void>; // Login function (changed from JSON to any)
    logout: () => void; // Logout function
    isLoading: boolean; // Loading state during operations
}

// Creating the authentication context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider that wraps the application to provide authentication context
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    // State to manage loading during requests
    const [isLoading, setIsLoading] = useState(false);
    // State to store authentication data
    const [auth, setAuth] = useState(null);
    // State to track if component is mounted (client-side)
    const [isClient, setIsClient] = useState(false);

    const router = useRouter();

    // Effect to initialize client-side state
    useEffect(() => {
        setIsClient(true);
        // Initialize with data stored in localStorage if any (only on client-side)
        if (typeof window !== 'undefined') {
            const storedAuth = localStorage.getItem('auth');
            if (storedAuth) {
                setAuth(JSON.parse(storedAuth));
            }
        }
    }, []);

    // User login function
    const login = async (dataForm: any) => {
        setIsLoading(true);

        try {
            // Send login request to API
            const { data, status } = await axios.post('/api/auth/login', dataForm);
            if (status === 200) {
                // Save user data in state and localStorage
                setAuth(data);
                // Only use localStorage on client-side
                if (typeof window !== 'undefined') {
                    localStorage.setItem('auth', JSON.stringify(data));
                }
                // Redirect to home page after successful login
                router.push('/');
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Login failed:", error);
            setIsLoading(false);
            throw error; // Re-throw error to handle it in component
        }
    }

    // User logout function
    const logout = () => {
        // Remove authentication data from state and localStorage
        setAuth(null);
        // Only use localStorage on client-side
        if (typeof window !== 'undefined') {
            localStorage.removeItem('auth');
        }
    };

    // Don't render until client-side hydration is complete
    if (!isClient) {
        return null;
    }

    // Provide context to all child components
    return (
        <AuthContext.Provider value={{ auth, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};