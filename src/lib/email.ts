// src/lib/email.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export async function sendPasswordResetEmail(
  email: string,
  token: string,
  fullName: string
) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

  const mailOptions = {
    // Use your actual Gmail address but with a custom name
    from: {
      name: "nrivizi Platform",
      address: process.env.SMTP_USER!, // This will be youb.nader@gmail.com
    },
    to: email,
    replyTo: "noreply@nrivizi.com", // Users will see this as reply address
    subject: "Réinitialisation de votre mot de passe - nrivizi",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px 20px; }
          .button { display: inline-block; background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
          .footer { background: #374151; color: #d1d5db; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 14px; }
          .warning { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Réinitialisation de mot de passe</h1>
            <p>nrivizi - Plateforme Académique</p>
          </div>
          
          <div class="content">
            <h2>Bonjour ${fullName},</h2>
            
            <p>Vous avez demandé la réinitialisation de votre mot de passe pour votre compte nrivizi.</p>
            
            <p>Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe :</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Réinitialiser mon mot de passe</a>
            </div>
            
            <div class="warning">
              <p><strong>⚠️ Important :</strong></p>
              <ul>
                <li>Ce lien est valide pendant <strong>1 heure</strong> seulement</li>
                <li>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email</li>  
                <li>Ne partagez jamais ce lien avec personne</li>
              </ul>
            </div>
            
            <p>Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :</p>
            <p style="word-break: break-all; background: #e5e7eb; padding: 10px; border-radius: 4px; font-family: monospace;">${resetUrl}</p>
            
            <p>Cordialement,<br>L'équipe nrivizi</p>
          </div>
          
          <div class="footer">
            <p>© 2025 nrivizi - Campus IFAG, Hydra, Alger</p>
            <p>📧 nexusclub@insag.edu.dz</p>
            <p>🚫 Ceci est un email automatique, ne pas répondre</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}
