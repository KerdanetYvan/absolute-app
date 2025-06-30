// This file is required for Next.js PWA offline fallback.
// You can customize this page as you wish.
export default function Offline() {
  return (
    <html lang="fr">
      <head>
        <title>Hors ligne | ANOMI</title>
        <meta name="description" content="Vous êtes hors ligne. Certaines fonctionnalités peuvent être limitées." />
      </head>
      <body>
        <main style={{textAlign: 'center', marginTop: '20vh'}}>
          <h1>Vous êtes hors ligne</h1>
          <p>Veuillez vérifier votre connexion internet.<br/>Certaines fonctionnalités peuvent être limitées.</p>
        </main>
      </body>
    </html>
  );
}
