import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendMaintenanceNotificationEmail(email: string) {
  const mailOptions = {
    from: {
      name: "nrivizi Platform",
      address: process.env.SMTP_USER!,
    },
    to: email,
    subject:
      "Notification de Maintenance - nrivizi / Maintenance Notification - nrivizi",
    html: `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #000; 
            margin: 0; 
            padding: 0; 
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          }
          .container { 
            max-width: 600px; 
            margin: 20px auto; 
            background: white; 
            border-radius: 16px; 
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            overflow: hidden;
          }
          .header { 
            background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); 
            color: white; 
            padding: 30px 40px; 
            text-align: center; 
            position: relative;
          }
          .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="0.5" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="0.5" fill="white" opacity="0.1"/><circle cx="75" cy="25" r="0.3" fill="white" opacity="0.1"/><circle cx="25" cy="75" r="0.3" fill="white" opacity="0.1"/></pattern></defs><rect width="100%" height="100%" fill="url(%23grain)"/></svg>');
          }
          .logo {
            width: 60px;
            height: 60px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            margin: 0 auto 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: bold;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.3);
          }
          .content { 
            padding: 40px; 
            background: white;
          }
          .section {
            margin-bottom: 30px;
            padding: 25px;
            border-radius: 12px;
            border: 1px solid #e5e7eb;
            background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
          }
          .section-fr { border-left: 4px solid #3b82f6; }
          .section-en { border-left: 4px solid #8b5cf6; }
          .flag { 
            display: inline-block; 
            margin-right: 8px; 
            font-size: 18px;
          }
          .language-header {
            color: #1f2937;
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
          }
          .maintenance-icon {
            background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
            width: 48px;
            height: 48px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            font-size: 24px;
          }
          .apology-box {
            background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
            border: 1px solid #93c5fd;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            text-align: center;
          }
          .apology-box p {
            margin: 0;
            color: #1e40af;
            font-weight: 500;
          }
          .contact-info {
            background: #f3f4f6;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
          }
          .contact-info h4 {
            margin: 0 0 10px 0;
            color: #374151;
            font-size: 16px;
            font-weight: 600;
          }
          .contact-item {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
            color: #6b7280;
            font-size: 14px;
          }
          .contact-item:last-child { margin-bottom: 0; }
          .footer { 
            background: linear-gradient(135deg, #374151 0%, #1f2937 100%); 
            color: #d1d5db; 
            padding: 25px 40px; 
            text-align: center; 
            font-size: 14px; 
          }
          .footer p { margin: 5px 0; }
          .divider {
            height: 1px;
            background: linear-gradient(90deg, transparent 0%, #e5e7eb 50%, transparent 100%);
            margin: 30px 0;
          }
          .estimated-time {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 15px;
            text-align: center;
            margin: 20px 0;
          }
          .estimated-time p {
            margin: 0;
            color: #92400e;
            font-weight: 500;
            font-size: 14px;
          }
          @media (max-width: 640px) {
            .container { margin: 10px; }
            .header, .content, .footer { padding: 20px; }
            .section { padding: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">N</div>
            <h1 style="margin: 0; font-size: 28px; font-weight: 700;">nrivizi</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">Plateforme Académique / Academic Platform</p>
          </div>
          
          <div class="content">
            <div class="maintenance-icon">🔧</div>
            
            <!-- French Section -->
            <div class="section section-fr">
              <div class="language-header">
                <span class="flag">🇫🇷</span>
                Maintenance en Cours
              </div>
              <h2 style="color: #1f2937; margin: 0 0 15px 0; font-size: 20px;">Merci pour votre inscription !</h2>
              <p style="margin-bottom: 15px;">Nous avons bien reçu votre demande de notification concernant la maintenance de <strong>nrivizi</strong>.</p>
              
              <div class="apology-box">
                <p><strong>Nexus Club s'excuse du désagrément et nous vous enverrons un email dès qu'il sera prêt.</strong></p>
              </div>
              
              <p>Nous effectuons actuellement une maintenance programmée pour améliorer votre expérience. Notre équipe travaille dur pour vous remettre en ligne dès que possible.</p>
              
              <div class="estimated-time">
                <p>⏱️ Temps d'achèvement estimé : 2-4 heures</p>
              </div>
              
              <p style="margin-bottom: 0;"><strong>Vous recevrez un email de confirmation dès que la plateforme sera de nouveau opérationnelle.</strong></p>
            </div>

            <div class="divider"></div>

            <!-- English Section -->
            <div class="section section-en">
              <div class="language-header">
                <span class="flag">🇬🇧</span>
                Under Maintenance
              </div>
              <h2 style="color: #1f2937; margin: 0 0 15px 0; font-size: 20px;">Thank you for signing up!</h2>
              <p style="margin-bottom: 15px;">We have received your notification request regarding the <strong>nrivizi</strong> maintenance.</p>
              
              <div class="apology-box">
                <p><strong>Nexus Club apologizes for the inconvenience and we will send you an email as soon as it's ready.</strong></p>
              </div>
              
              <p>We are currently performing scheduled maintenance to improve your experience. Our team is working hard to bring you back online as soon as possible.</p>
              
              <div class="estimated-time">
                <p>⏱️ Estimated completion time: 2-4 hours</p>
              </div>
              
              <p style="margin-bottom: 0;"><strong>You will receive a confirmation email as soon as the platform is operational again.</strong></p>
            </div>

            <!-- Contact Information -->
            <div class="contact-info">
              <h4>📞 Contact Information / Informations de Contact</h4>
              <div class="contact-item">
                <span style="margin-right: 8px;">📧</span>
                <span>nexusclub@insag.edu.dz</span>
              </div>
              <div class="contact-item">
                <span style="margin-right: 8px;">📍</span>
                <span>Campus IFAG, Hydra, Alger</span>
              </div>
              <div class="contact-item">
                <span style="margin-right: 8px;">🌐</span>
                <span>Pour les questions urgentes / For urgent matters</span>
              </div>
            </div>
          </div>
          
          <div class="footer">
            <p><strong>© 2025 nrivizi - Campus IFAG, Hydra, Alger</strong></p>
            <p>📧 nexusclub@insag.edu.dz</p>
            <p>🚫 Ceci est un email automatique, ne pas répondre / This is an automated email, please do not reply</p>
            <p style="margin-top: 15px; font-size: 12px; opacity: 0.7;">
              Construit avec passion pour l'éducation / Built with passion for education
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Maintenance notification email sent to: ${email}`);
  } catch (error) {
    console.error("Error sending maintenance notification email:", error);
    throw error;
  }
}

// Function to send "back online" notification
export async function sendMaintenanceCompleteEmail(email: string) {
  const mailOptions = {
    from: {
      name: "nrivizi Platform",
      address: process.env.SMTP_USER!,
    },
    to: email,
    subject: "🎉 nrivizi est de retour en ligne ! / nrivizi is back online!",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f8fafc; }
          .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .section { margin-bottom: 25px; padding: 20px; border-radius: 8px; }
          .section-fr { background: #f0f9ff; border-left: 4px solid #0ea5e9; }
          .section-en { background: #f0fdf4; border-left: 4px solid #10b981; }
          .cta-button { display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 15px 0; }
          .footer { background: #1f2937; color: #d1d5db; padding: 20px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">🎉 nrivizi est de retour !</h1>
            <p style="margin: 10px 0 0 0;">La plateforme est maintenant opérationnelle</p>
          </div>
          
          <div class="content">
            <!-- French Section -->
            <div class="section section-fr">
              <h3>🇫🇷 Bonne nouvelle !</h3>
              <p>La maintenance de <strong>nrivizi</strong> est maintenant terminée et la plateforme est de nouveau disponible !</p>
              <p>Nous nous excusons pour le désagrément causé et vous remercions pour votre patience.</p>
              <p><strong>Quoi de neuf :</strong></p>
              <ul>
                <li>Améliorations de performance</li>
                <li>Corrections de bugs</li>
                <li>Nouvelle interface utilisateur optimisée</li>
              </ul>
              <a href="${process.env.NEXTAUTH_URL}" class="cta-button">Accéder à nrivizi</a>
            </div>

            <!-- English Section -->
            <div class="section section-en">
              <h3>🇬🇧 Great news!</h3>
              <p>The <strong>nrivizi</strong> maintenance is now complete and the platform is back online!</p>
              <p>We apologize for any inconvenience and thank you for your patience.</p>
              <p><strong>What's new:</strong></p>
              <ul>
                <li>Performance improvements</li>
                <li>Bug fixes</li>
                <li>Optimized user interface</li>
              </ul>
              <a href="${process.env.NEXTAUTH_URL}" class="cta-button">Access nrivizi</a>
            </div>
          </div>
          
          <div class="footer">
            <p><strong>© 2025 nrivizi - Campus IFAG, Hydra, Alger</strong></p>
            <p>📧 nexusclub@insag.edu.dz</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Maintenance complete email sent to: ${email}`);
  } catch (error) {
    console.error("Error sending maintenance complete email:", error);
    throw error;
  }
}
