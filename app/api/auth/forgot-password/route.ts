import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/mongodb';
import User from '@/models/user.model';
import { sendEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    console.log('🔄 Forgot password API called');
    
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      );
    }

    console.log('📧 Email pour réinitialisation:', email);

    // Connexion à la base de données
    await connectDB();
    console.log('📦 Connexion à la base de données établie');

    // Rechercher l'utilisateur
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('❌ Utilisateur non trouvé pour email:', email);
      // Pour des raisons de sécurité, on ne révèle pas si l'email existe ou non
      return NextResponse.json({
        success: true,
        message: 'Si cette adresse email est associée à un compte, vous recevrez un lien de réinitialisation.'
      });
    }

    console.log('👤 Utilisateur trouvé:', user.username);

    // Générer un token de réinitialisation
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 heure

    console.log('🔑 Token de réinitialisation généré');
    console.log('📅 Expiration:', resetTokenExpires);

    // Sauvegarder le token dans la base de données
    await User.findByIdAndUpdate(user._id, {
      passwordResetToken: resetToken,
      passwordResetExpires: resetTokenExpires
    });

    console.log('💾 Token sauvegardé en base de données');

    // Créer l'URL de réinitialisation
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/auth/reset-password?token=${resetToken}`;

    console.log('🔗 URL de réinitialisation créée');

    // Préparer l'email
    const emailSubject = 'Réinitialisation de votre mot de passe';
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Réinitialisation de mot de passe</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .button { 
              display: inline-block; 
              padding: 12px 24px; 
              background-color: #4F46E5; 
              color: white; 
              text-decoration: none; 
              border-radius: 6px; 
              font-weight: bold;
            }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666; }
            .warning { background-color: #FEF3C7; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #F59E0B; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Réinitialisation de mot de passe</h1>
            </div>
            
            <p>Bonjour <strong>${user.username}</strong>,</p>
            
            <p>Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" class="button">Réinitialiser mon mot de passe</a>
            </div>
            
            <div class="warning">
              <strong>⚠️ Important :</strong>
              <ul>
                <li>Ce lien est valide pendant <strong>1 heure seulement</strong></li>
                <li>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email</li>
                <li>Votre mot de passe actuel reste inchangé tant que vous n'en créez pas un nouveau</li>
              </ul>
            </div>
            
            <p>Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :</p>
            <p style="word-break: break-all; background-color: #f5f5f5; padding: 10px; border-radius: 4px;">
              ${resetUrl}
            </p>
            
            <div class="footer">
              <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
              <p>Si vous rencontrez des problèmes, contactez notre support.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Envoyer l'email
    console.log('📨 Envoi de l\'email de réinitialisation...');
    
    try {
      const emailResult = await sendEmail({
        to: email,
        subject: emailSubject,
        html: emailHtml
      });

      console.log('✅ Email envoyé avec succès');

      return NextResponse.json({
        success: true,
        message: 'Un email de réinitialisation a été envoyé à votre adresse email.',
        emailSent: true,
        emailPreviewUrl: emailResult.previewUrl // URL de prévisualisation pour le développement
      });

    } catch (emailError: any) {
      console.error('❌ Erreur lors de l\'envoi de l\'email:', emailError);
      
      // Même si l'email échoue, on ne révèle pas l'erreur pour des raisons de sécurité
      return NextResponse.json({
        success: true,
        message: 'Si cette adresse email est associée à un compte, vous recevrez un lien de réinitialisation.',
        emailSent: false,
        emailError: emailError.message
      });
    }

  } catch (error) {
    console.error('❌ Erreur dans forgot-password API:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la demande de réinitialisation' },
      { status: 500 }
    );
  }
}
