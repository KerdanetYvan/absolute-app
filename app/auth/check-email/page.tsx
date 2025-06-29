export default function CheckEmailPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-orange-100">
                            <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h1 className="mt-6 text-3xl font-bold text-gray-900">ANOMI</h1>
                        <h2 className="mt-2 text-xl text-gray-600">Vérifiez votre email</h2>
                        <p className="mt-4 text-gray-500">
                            Nous avons envoyé un lien de vérification à votre adresse email. 
                            Cliquez sur le lien dans l'email pour activer votre compte.
                        </p>
                        
                        <div className="mt-6 p-4 bg-blue-50 rounded-md">
                            <p className="text-sm text-blue-700">
                                💡 N'oubliez pas de vérifier votre dossier spam si vous ne trouvez pas l'email.
                            </p>
                        </div>

                        <div className="mt-6">
                            <a 
                                href="/auth/register" 
                                className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                            >
                                ← Retour à l'inscription
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
