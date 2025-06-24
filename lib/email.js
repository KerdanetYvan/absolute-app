import nodemailer from 'nodemailer';
import { Resend } from 'resend';

// Configuration du transporteur d'email
const createTransporter = async () => {
    // Si on a une clé Resend en production, on l'utilise (plus simple)
    if (process.env.RESEND_API_KEY) {
        return new Resend(process.env.RESEND_API_KEY);
    }
    // Sinon Gmail si configuré
    else if (process.env.NODE_ENV === 'production' && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        return nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    } else {
        // Mode développement avec Ethereal
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
    }
};

export const sendVerificationEmail = async (email, username, verificationToken) => {
    try {
        const transporter = await createTransporter();
        
        // URL de vérification
        const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/auth/verify-email?token=${verificationToken}`;
        
        // Template HTML commun
        const htmlTemplate = `
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #333; margin-bottom: 10px;">ANOMI</h1>
                    <p style="color: #666; font-size: 16px;">Toute l'info sur l'animation</p>
                </div>
                
                <div style="background-color: #f9f9f9; padding: 30px; border-radius: 8px;">
                    <h2 style="color: #333; margin-bottom: 20px;">Bienvenue ${username} !</h2>
                    
                    <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 25px;">
                        Merci de vous être inscrit sur ANOMI. Pour activer votre compte, 
                        veuillez cliquer sur le bouton ci-dessous pour vérifier votre adresse email.
                    </p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${verificationUrl}" 
                           style="display: inline-block; background-color: #007bff; color: white; 
                                  padding: 12px 30px; text-decoration: none; border-radius: 5px; 
                                  font-weight: bold; font-size: 16px;">
                            Vérifier mon email
                        </a>
                    </div>
                    
                    <p style="color: #777; font-size: 14px; margin-top: 25px;">
                        Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :
                        <br>
                        <a href="${verificationUrl}" style="color: #007bff; word-break: break-all;">
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
            </div>        `;
        
        // Si c'est Resend (plus simple)
        if (process.env.RESEND_API_KEY) {
            try {
                const result = await transporter.emails.send({
                    from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
                    to: email,
                    subject: 'Vérifiez votre adresse email - ANOMI',
                    html: htmlTemplate
                });
                
                console.log('📧 Réponse Resend complète:', JSON.stringify(result, null, 2));
                console.log('✅ Email Resend envoyé:', result.data?.id || result.id);
                return { success: true, messageId: result.data?.id || result.id };
            } catch (resendError) {
                console.log('⚠️ Erreur Resend:', resendError.message);
                
                // Si Resend échoue (restrictions de domaine/adresse), utiliser Ethereal en fallback
                console.log('🔄 Fallback vers Ethereal Mail pour le développement...');
                
                const testAccount = await nodemailer.createTestAccount();
                const etherealTransporter = nodemailer.createTransporter({
                    host: 'smtp.ethereal.email',
                    port: 587,
                    secure: false,
                    auth: {
                        user: testAccount.user,
                        pass: testAccount.pass
                    }
                });
                
                const mailOptions = {
                    from: 'noreply@anomi.app',
                    to: email,
                    subject: 'Vérifiez votre adresse email - ANOMI',
                    html: htmlTemplate
                };

                const result = await etherealTransporter.sendMail(mailOptions);
                console.log('✅ Email de vérification envoyé via Ethereal:', result.messageId);
                console.log('📧 Prévisualisation email:', nodemailer.getTestMessageUrl(result));
                
                return { success: true, messageId: result.messageId, previewUrl: nodemailer.getTestMessageUrl(result) };
            }
        } else {
            // Mode Nodemailer (Gmail ou Ethereal)
            const mailOptions = {
                from: process.env.EMAIL_FROM || 'noreply@anomi.app',
                to: email,
                subject: 'Vérifiez votre adresse email - ANOMI',
                html: htmlTemplate
            };

            const result = await transporter.sendMail(mailOptions);
            console.log('✅ Email de vérification envoyé:', result.messageId);
            
            // En développement, afficher l'URL de prévisualisation Ethereal
            if (process.env.NODE_ENV !== 'production') {
                console.log('📧 Prévisualisation email:', nodemailer.getTestMessageUrl(result));
            }
            
            return { success: true, messageId: result.messageId };
        }
        
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
                    
                    <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 25px;">
                        Bonjour ${username}, vous avez demandé la réinitialisation de votre mot de passe. 
                        Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe.
                    </p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" 
                           style="display: inline-block; background-color: #dc3545; color: white; 
                                  padding: 12px 30px; text-decoration: none; border-radius: 5px; 
                                  font-weight: bold; font-size: 16px;">
                            Réinitialiser mon mot de passe
                        </a>
                    </div>
                    
                    <p style="color: #777; font-size: 14px; margin-top: 25px;">
                        Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :
                        <br>
                        <a href="${resetUrl}" style="color: #dc3545; word-break: break-all;">
                            ${resetUrl}
                        </a>
                    </p>
                    
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
        
        // Si c'est Resend
        if (process.env.RESEND_API_KEY) {
            const result = await transporter.emails.send({
                from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
                to: email,
                subject: 'Réinitialisation de votre mot de passe - ANOMI',
                html: htmlTemplate
            });
            
            console.log('✅ Email Resend reset envoyé:', result.data?.id);
            return { success: true, messageId: result.data?.id };
        } else {
            // Mode Nodemailer
            const mailOptions = {
                from: process.env.EMAIL_FROM || 'noreply@anomi.app',
                to: email,
                subject: 'Réinitialisation de votre mot de passe - ANOMI',
                html: htmlTemplate
            };

            const result = await transporter.sendMail(mailOptions);
            console.log('✅ Email de réinitialisation envoyé:', result.messageId);
            
            return { success: true, messageId: result.messageId };
        }
    } catch (error) {
        console.error('❌ Erreur envoi email:', error);
        return { success: false, error: error.message };
    }
};
