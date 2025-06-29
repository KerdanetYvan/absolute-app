import nodemailer from 'nodemailer';

// Configuration du transporteur d'email avec Ethereal uniquement
const createTransporter = async () => {
    // Toujours utiliser Ethereal pour la simplicité
    const testAccount = await nodemailer.createTestAccount();
    
    return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass
        }
    });
};

export const sendVerificationEmail = async (email, username, verificationToken) => {
    try {
        const transporter = await createTransporter();
          // URL de vérification
        const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/auth/verify-email?token=${verificationToken}`;
        
        // Template HTML
        const htmlTemplate = `
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #333; margin-bottom: 10px;">ANOMI</h1>
                    <p style="color: #666; font-size: 16px;">Toute l'info sur l'animation</p>
                </div>
                
                <div style="background-color: #f9f9f9; padding: 30px; border-radius: 8px;">
                    <h2 style="color: #333; margin-bottom: 20px;">Bienvenue ${username} !</h2>
                    
                    <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                        Merci de vous être inscrit sur ANOMI. Pour finaliser votre inscription, 
                        veuillez cliquer sur le lien ci-dessous pour vérifier votre adresse email :
                    </p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${verificationUrl}" style="background-color: #FCB259; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                            Vérifier mon email
                        </a>
                    </div>
                    
                    <p style="color: #666; font-size: 14px; margin-top: 20px;">
                        Ou copiez et collez ce lien dans votre navigateur :
                    </p>
                    <p style="color: #666; font-size: 12px; word-break: break-all;">
                        <a href="${verificationUrl}" style="color: #FCB259; word-break: break-all;">
                            ${verificationUrl}
                        </a>
                    </p>
                    
                    <p style="color: #999; font-size: 12px; margin-top: 20px;">
                        Ce lien expirera dans 24 heures pour des raisons de sécurité.
                    </p>
                </div>
                
                <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
                    <p>Si vous n'avez pas créé de compte, ignorez cet email.</p>
                    <p>© 2025 ANOMI - Tous droits réservés</p>
                </div>
            </div>
        `;

        const mailOptions = {
            from: 'noreply@anomi.app',
            to: email,
            subject: 'Vérifiez votre adresse email - ANOMI',
            html: htmlTemplate
        };

        const result = await transporter.sendMail(mailOptions);
        
        console.log('✅ Email de vérification envoyé via Ethereal:', result.messageId);
        console.log('📧 Prévisualisation email:', nodemailer.getTestMessageUrl(result));
        
        return { 
            success: true, 
            messageId: result.messageId, 
            previewUrl: nodemailer.getTestMessageUrl(result),
            htmlContent: htmlTemplate  // Ajouter le contenu HTML pour l'affichage
        };
        
    } catch (error) {
        console.error('❌ Erreur envoi email:', error);
        return { success: false, error: error.message };
    }
};

export const sendPasswordResetEmail = async (email, username, resetToken) => {
    try {
        const transporter = await createTransporter();
        
        const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;
        
        const htmlTemplate = `
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #333; margin-bottom: 10px;">ANOMI</h1>
                    <p style="color: #666; font-size: 16px;">Toute l'info sur l'animation</p>
                </div>
                
                <div style="background-color: #f9f9f9; padding: 30px; border-radius: 8px;">
                    <h2 style="color: #333; margin-bottom: 20px;">Réinitialisation de mot de passe</h2>
                    
                    <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                        Bonjour ${username}, vous avez demandé la réinitialisation de votre mot de passe.
                        Cliquez sur le lien ci-dessous pour créer un nouveau mot de passe :
                    </p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" style="background-color: #FCB259; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                            Réinitialiser mon mot de passe
                        </a>
                    </div>
                    
                    <p style="color: #999; font-size: 12px; margin-top: 20px;">
                        Ce lien expirera dans 1 heure pour des raisons de sécurité.
                    </p>
                </div>
                
                <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
                    <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
                    <p>© 2025 ANOMI - Tous droits réservés</p>
                </div>
            </div>
        `;

        const mailOptions = {
            from: 'noreply@anomi.app',
            to: email,
            subject: 'Réinitialisation de mot de passe - ANOMI',
            html: htmlTemplate
        };

        const result = await transporter.sendMail(mailOptions);
        
        console.log('✅ Email de réinitialisation envoyé via Ethereal:', result.messageId);
        console.log('📧 Prévisualisation email:', nodemailer.getTestMessageUrl(result));
        
        return { 
            success: true, 
            messageId: result.messageId, 
            previewUrl: nodemailer.getTestMessageUrl(result) 
        };
        
    } catch (error) {
        console.error('❌ Erreur envoi email:', error);
        return { success: false, error: error.message };
    }
};

// Fonction générique pour envoyer des emails
export const sendEmail = async ({ to, subject, html }) => {
    try {
        console.log('📧 Envoi d\'email générique...');
        console.log('📧 Destinataire:', to);
        console.log('📧 Sujet:', subject);
        
        const transporter = await createTransporter();
        
        const mailOptions = {
            from: 'noreply@anomi.app',
            to: to,
            subject: subject,
            html: html
        };

        const result = await transporter.sendMail(mailOptions);
        
        console.log('✅ Email envoyé via Ethereal:', result.messageId);
        console.log('📧 Prévisualisation email:', nodemailer.getTestMessageUrl(result));
        
        return { 
            success: true, 
            messageId: result.messageId, 
            previewUrl: nodemailer.getTestMessageUrl(result) 
        };
        
    } catch (error) {
        console.error('❌ Erreur envoi email:', error);
        throw error; // Re-lancer l'erreur pour gestion dans l'API
    }
};
