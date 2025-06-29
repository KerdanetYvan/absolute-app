"use client";

import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
        <div>
            <form onSubmit={handleSubmit} className="space-y-1">
                <div className="mb-[20px] flex flex-col items-center justify-center gap-[12px]">
                    <div>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 block w-[226px] px-3 py-2 border border-[#FFB151] dark:border-[#3CBDD1] text-[#828282] text-sm rounded-[6px] shadow-sm"
                            placeholder="Email"
                        />
                    </div>
                
                    <div>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 block w-[226px] px-3 py-2 border border-[#FFB151] dark:border-[#3CBDD1] text-[#828282] text-sm rounded-[6px] shadow-sm"
                            placeholder="Enter your password"
                        />
                    </div>

                    <a href="/auth/forgot-password" className="text-gray-400 dark:text-white text-sm hover:underline">
                        Mot de passe oublié ?
                    </a>
                </div>
                
                {error && (
                    <div className="text-red-600 text-sm mt-2 p-2 bg-red-50 rounded">
                        {error}
                    </div>
                )}
                
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-[226px] flex justify-center mx-auto py-2 px-4 rounded-[14px] shadow-sm font-medium text-black bg-[#FFB151] dark:bg-[#3CBDD1] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Connexion...' : 'Se connecter'}
                </button>

                <p className='text-center font-bold dark:text-white'>Ou</p>

                <button
                    type="button"
                    onClick={() => window.location.href = '/auth/register'}
                    className="w-[226px] flex justify-center mx-auto py-2 px-4 rounded-[14px] shadow-sm font-medium text-black bg-[#FFCF9B] dark:bg-[#3CBDD1] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    S'inscrire
                </button>
            </form>
        </div>
    );
};
