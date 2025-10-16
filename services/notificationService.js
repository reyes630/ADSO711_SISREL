const db = require('../models');
const nodemailer = require('nodemailer');
const sgMail = require("@sendgrid/mail");

class NotificationService {
    async notifyCoordinators(requestData) {
        try {
            const coordinators = await db.user.findAll({
                where: { coordinator: true },
                attributes: ['emailUser', 'nameUser']
            });

            if (!coordinators.length) {
                console.log('No hay coordinadores registrados');
                return;
            }

            for (const coordinator of coordinators) {
                // Crear el HTML del correo con el nombre del coordinador
                const emailHTML = this.createRequestNotificationEmail(requestData, coordinator.nameUser);
                await this.sendEmail(coordinator.emailUser, emailHTML);
            }

            return { success: true, message: 'Notificaciones enviadas a los coordinadores' };
        } catch (error) {
            console.error('Error al notificar coordinadores:', error);
            throw error;
        }
    }

    createRequestNotificationEmail(requestData, coordinatorName) {  // 👈 Añadir parámetro
        return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      margin: 0;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: linear-gradient(135deg, #f5f7fa 0%, #e8f0e8 100%);
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: white;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
    }
    .header {
      background: linear-gradient(135deg, #2d8d0f 0%, #39A900 50%, #45c018 100%);
      color: white;
      padding: 40px 30px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .header::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
      animation: pulse 8s ease-in-out infinite;
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 0.5; }
      50% { transform: scale(1.1); opacity: 0.3; }
    }
    .header-content {
      position: relative;
      z-index: 1;
    }
    .header h1 {
      margin: 0;
      font-size: 20px;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .header p {
      margin: 10px 0 0 0;
      font-size: 14px;
      opacity: 0.95;
      font-weight: 300;
    }
    .greeting {
      padding: 35px 35px 20px 35px;
      color: #2c3e50;
    }
    .greeting p {
      margin: 0;
      font-size: 15px;
      line-height: 1.7;
      color: #555;
    }
    .greeting strong {
      color: #39A900;
      font-weight: 600;
    }
    .status-box {
      margin: 25px 35px;
      background: linear-gradient(135deg, #39A900 0%, #2d8d0f 100%);
      border-radius: 16px;
      padding: 24px;
      text-align: center;
      box-shadow: 0 8px 20px rgba(57, 169, 0, 0.25);
      position: relative;
      overflow: hidden;
    }
    .status-box::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);
      animation: shimmer 3s infinite;
    }
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    .status-box h2 {
      margin: 0;
      color: white;
      font-size: 18px;
      font-weight: 600;
      position: relative;
      z-index: 1;
    }
    .summary-container {
      margin: 25px 35px;
      border-radius: 20px;
      padding: 0;
      background: linear-gradient(135deg, #f8fff5 0%, #ffffff 100%);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
      overflow: hidden;
    }
    .summary-row {
      padding: 20px 24px;
      border-bottom: 1px solid #f0f0f0;
      transition: background 0.3s ease;
    }
    .summary-row:hover {
      background: rgba(57, 169, 0, 0.03);
    }
    .summary-row:last-child {
      border-bottom: none;
    }
    .summary-label {
      display: block;
      font-size: 12px;
      color: #888;
      margin-bottom: 6px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .summary-value {
      display: block;
      font-size: 15px;
      color: #2c3e50;
      font-weight: 500;
    }
    .status-badges {
      display: flex;
      gap: 10px;
      margin-top: 8px;
      flex-wrap: wrap;
    }
    .badge {
      display: inline-block;
      padding: 8px 18px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }
    .badge-current {
      background: linear-gradient(135deg, #39A900 0%, #2d8d0f 100%);
      color: white;
    }
    .cta-section {
      background: linear-gradient(135deg, #e8f4ff 0%, #f0f8ff 100%);
      border-left: 5px solid #2196F3;
      padding: 25px 30px;
      margin: 25px 35px;
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(33, 150, 243, 0.1);
      text-align: center;
    }
    .cta-section h3 {
      margin: 0 0 15px 0;
      font-size: 16px;
      color: #1976D2;
      font-weight: 700;
    }
    .cta-section p {
      margin: 0 0 20px 0;
      font-size: 14px;
      color: #555;
      line-height: 1.6;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
      color: white;
      padding: 14px 32px;
      border-radius: 25px;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      box-shadow: 0 6px 20px rgba(33, 150, 243, 0.3);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(33, 150, 243, 0.4);
    }
    .footer {
      background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
      color: white;
      padding: 30px;
      text-align: center;
      margin-top: 40px;
      border-radius: 0 0 24px 24px;
    }
    .footer p {
      margin: 8px 0;
      font-size: 13px;
      line-height: 1.7;
      opacity: 0.95;
    }
    .footer strong {
      color: #39A900;
    }
    .footer-note {
      font-size: 12px;
      opacity: 0.7;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    .divider {
      height: 2px;
      background: linear-gradient(90deg, transparent 0%, #39A900 50%, transparent 100%);
      margin: 30px 35px;
      border-radius: 2px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <div class="header-content">
        <h1>SISTEMA DE GESTIÓN DE RELACIONAMIENTO CORPORATIVO</h1>
        <p>Servicio Nacional de Aprendizaje</p>
      </div>
    </div>

    <!-- Greeting -->
    <div class="greeting">
      <p>Estimado(a) <strong>${coordinatorName}</strong>,</p>
      <p style="margin-top: 12px;">Le informamos que se ha registrado una nueva solicitud en el sistema que requiere su atención.</p>
    </div>

    <!-- Status Box -->
    <div class="status-box">
      <h2>Nueva Solicitud Recibida</h2>
    </div>

    <!-- Summary Container -->
    <div class="summary-container">
      <div class="summary-row">
        <span class="summary-label">Cliente</span>
        <span class="summary-value">${requestData.Client?.NameClient || 'No especificado'}</span>
      </div>

      <div class="summary-row">
        <span class="summary-label">Tipo de Servicio</span>
        <span class="summary-value">${requestData.serviceType?.serviceType || 'No especificado'}</span>
      </div>

      <div class="summary-row">
        <span class="summary-label">Estado Actual</span>
        <div class="status-badges">
          <span class="badge badge-current">${requestData.State?.State || 'Pendiente'}</span>
        </div>
      </div>

      <div class="summary-row">
        <span class="summary-label">Fecha de Creación</span>
        <span class="summary-value">${new Date(requestData.createdAt).toLocaleDateString()}</span>
      </div>
    </div>

    <div class="divider"></div>

    <!-- CTA Section -->
    <div class="cta-section">
      <p>Para consultar toda la información de esta solicitud, incluyendo descripción detallada, ubicación, fechas del evento y gestionar su atención, acceda a nuestro sistema.</p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p><strong>Nota:</strong> Esta solicitud ha sido asignada a su gestión y requiere seguimiento.</p>
      <p>Revise los detalles completos en el sistema para comenzar con la atención correspondiente.</p>
      <p class="footer-note">Este es un correo automático, por favor no responda directamente a este mensaje.</p>
    </div>
  </div>
</body>
</html>
    `;
    }

    async sendEmail(to, htmlContent) {
        if (process.env.EMAIL_SERVICE === "sendgrid") {
            return this.sendWithSendGrid(to, htmlContent);
        } else {
            return this.sendWithGmail(to, htmlContent);
        }
    }

    async sendWithSendGrid(to, htmlContent) {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
            to,
            from: {
                name: "SISREL",
                email: process.env.EMAIL_FROM,
            },
            subject: "Nueva Solicitud de Servicio - SISREL",
            html: htmlContent,
        };
        await sgMail.send(msg);
    }

    async sendWithGmail(to, htmlContent) {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: `"SISREL" <${process.env.EMAIL_FROM}>`,
            to,
            subject: "Nueva Solicitud de Servicio - SISREL",
            html: htmlContent,
        });
    }
}

module.exports = new NotificationService();