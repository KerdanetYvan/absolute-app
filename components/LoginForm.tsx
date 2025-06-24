"use client";

import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export const LoginForm = () => {
    const [email, setEmail] = useState('test@example.com'); // Default for testing
    const [password, setPassword] = useState('password123'); // Default for testing
    const [error, setError] = useState('');
    
    const { login, isLoading } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        try {
            console.log('🔄 Attempting login with:', { email, password: '***' });
            const formData = { email, password };
            await login(formData);
        } catch (err: any) {
            console.error('❌ Login error:', err);
            console.error('Response data:', err.response?.data);
            console.error('Response status:', err.response?.status);
            
            const errorMessage = err.response?.data?.error || 
                                err.response?.data?.message || 
                                err.message || 
                                'Login failed';
            setError(errorMessage);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Login Test</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your email"
                    />
                </div>
                
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your password"
                    />
                </div>
                
                {error && (
                    <div className="text-red-600 text-sm mt-2 p-2 bg-red-50 rounded">
                        {error}
                    </div>
                )}
                
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
            </form>
            
            <div className="mt-4 text-sm text-gray-600">
                <p>Test credentials are pre-filled.</p>
                <p>Check browser console for detailed error logs.</p>
            </div>
        </div>
    );
};
