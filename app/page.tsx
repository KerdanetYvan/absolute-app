import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Logo/Brand */}
        <div className="space-y-4">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-white to-indigo-50 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl font-bold">
              <Image
                src="/logo.webp"
                alt="ANOMI Logo"
                width={64}
                height={64}
              />
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white">
            ANOMI
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 font-medium">
            Toute l'info sur l'animation
          </p>
        </div>

        {/* Work in Progress Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 border border-gray-200 dark:border-gray-700">
          <div className="space-y-6">
            {/* Icon */}
            <div className="mx-auto w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Travaux en Cours
            </h2>
            
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              Nous travaillons activement sur cette plateforme pour vous offrir la meilleure 
              expérience possible dans le monde de l'animation. Restez connectés !
            </p>

            {/* Progress indicators */}
            <div className="space-y-4 text-left">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">Système d'authentification</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">API des articles et commentaires</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">Interface utilisateur</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">Fonctionnalités avancées</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact/Social */}
        <div className="space-y-4">
          <p className="text-gray-500 dark:text-gray-400">
            Une question ? Un retour ?
          </p>
          <div className="flex justify-center space-x-4">
            <a 
              href="mailto:y_kerdanet@stu-digital-campus.fr" 
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Nous contacter
            </a>
            <a 
              href="/test-goback-simple" 
              className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Test GoBack
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2025 ANOMI - Plateforme d'information sur l'animation
          </p>
        </div>
      </div>
    </div>
  );
}
