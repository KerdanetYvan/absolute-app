// Fichier email.js - Stubs pour projet d'étude (sans vérification email)
// Ces fonctions sont désactivées car la vérification email a été supprimée

console.log('📧 Module email chargé - Mode projet d\'étude (emails désactivés)');

// Fonction stub pour sendVerificationEmail (pour compatibilité)
export const sendVerificationEmail = async (email, username, verificationToken) => {
    console.log('📧 sendVerificationEmail appelée (désactivée en mode projet d\'étude)');
    console.log('   Email:', email);
    console.log('   Username:', username);
    
    return { 
        success: false, 
        error: 'Vérification email désactivée pour projet d\'étude',
        htmlContent: '<p>Vérification email désactivée pour ce projet d\'étude</p>'
    };
};

// Fonction stub pour sendEmail (pour compatibilité)
export const sendEmail = async ({ to, subject, html }) => {
    console.log('📧 sendEmail appelée (désactivée en mode projet d\'étude)');
    console.log('   To:', to);
    console.log('   Subject:', subject);
    
    return { 
        success: false, 
        messageId: 'stub-message-id',
        error: 'Envoi email désactivé pour projet d\'étude'
    };
};

// Fonction stub pour sendPasswordResetEmail (pour compatibilité)
export const sendPasswordResetEmail = async (email, username, resetToken) => {
    console.log('📧 sendPasswordResetEmail appelée (désactivée en mode projet d\'étude)');
    console.log('   Email:', email);
    console.log('   Username:', username);
    
    return { 
        success: false, 
        error: 'Réinitialisation mot de passe par email désactivée pour projet d\'étude'
    };
};