import { NextPage } from 'next';
import { useRouter } from 'next/router';

const CheckEmailPage: NextPage = () => {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">ANOMI</h1>
                    <p className="text-gray-600">Toute l'info sur l'animation</p>
                </div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-18 0V6a2 2 0 012-2h14a2 2 0 012 2v2M3 8v10a2 2 0 002 2h14a2 2 0 002-2V8" />
                            </svg>
                        </div>
                        
                        <h2 className="mt-4 text-2xl font-bold text-gray-900">
                            Vérifiez votre email
                        </h2>
                        
                        <div className="mt-4 space-y-3">
                            <p className="text-gray-600">
                                Nous avons envoyé un email de vérification à votre adresse email.
                            </p>
                            
                            <p className="text-gray-600">
                                Cliquez sur le lien dans l'email pour activer votre compte.
                            </p>
                            
                            <div className="bg-blue-50 p-4 rounded-md">
                                <p className="text-sm text-blue-800">
                                    <strong>Attention :</strong> Vérifiez également votre dossier spam ou courrier indésirable.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 space-y-3">
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Email non reçu ? Actualiser la page
                            </button>
                            
                            <button
                                onClick={() => router.push('/auth/login')}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Retour à la connexion
                            </button>
                        </div>

                        <div className="mt-6 text-sm text-gray-500">
                            <p>
                                Problème avec l'email ? Contactez notre support à{' '}
                                <a href="mailto:support@anomi.app" className="text-blue-600 hover:text-blue-500">
                                    support@anomi.app
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckEmailPage;
