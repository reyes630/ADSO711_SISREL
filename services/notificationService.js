const db = require('../models');
const nodemailer = require('nodemailer');
const sgMail = require("@sendgrid/mail");

class NotificationService {
    async notifyCoordinators(requestData) {
        try {
            // Buscar todos los coordinadores
            const coordinators = await db.user.findAll({
                where: { coordinator: true },
                attributes: ['emailUser', 'nameUser']
            });

            if (!coordinators.length) {
                console.log('No hay coordinadores registrados');
                return;
            }

            // Crear el HTML del correo
            const emailHTML = this.createRequestNotificationEmail(requestData);

            // Enviar correo a cada coordinador
            for (const coordinator of coordinators) {
                await this.sendEmail(coordinator.emailUser, emailHTML);
            }

            return { success: true, message: 'Notificaciones enviadas a los coordinadores' };
        } catch (error) {
            console.error('Error al notificar coordinadores:', error);
            throw error;
        }
    }

    createRequestNotificationEmail(requestData) {
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
      font-family: Arial, sans-serif;
      background-color: #f5f5f5;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: white;
    }
    .header {
      background: linear-gradient(135deg, #2d8d0f 0%, #39A900 100%);
      color: white;
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 18px;
      font-weight: bold;
      letter-spacing: 0.5px;
    }
    .header p {
      margin: 8px 0 0 0;
      font-size: 13px;
      opacity: 0.95;
    }
    .greeting {
      padding: 20px 25px 10px 25px;
      color: #333;
    }
    .greeting p {
      margin: 0;
      font-size: 14px;
      line-height: 1.6;
    }
    .status-box {
      margin: 20px 25px;
      background: #39A900;
      border-radius: 8px;
      padding: 18px;
      text-align: center;
    }
    .status-box h2 {
      margin: 0;
      color: white;
      font-size: 16px;
      font-weight: 600;
    }
    .details-container {
      margin: 20px 25px;
      border: 2px solid #e8e8e8;
      border-radius: 8px;
      padding: 20px;
      background: #fafff7;
    }
    .detail-row {
      margin-bottom: 15px;
      padding-bottom: 12px;
      border-bottom: 1px solid #e8e8e8;
    }
    .detail-row:last-child {
      margin-bottom: 0;
      padding-bottom: 0;
      border-bottom: none;
    }
    .detail-label {
      display: block;
      font-size: 12px;
      color: #666;
      margin-bottom: 4px;
      font-weight: 600;
    }
    .detail-value {
      display: block;
      font-size: 14px;
      color: #333;
    }
    .status-badges {
      display: flex;
      gap: 10px;
      margin-top: 15px;
      flex-wrap: wrap;
    }
    .badge {
      display: inline-block;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }
    .badge-previous {
      background-color: #808080;
      color: white;
    }
    .badge-current {
      background-color: #39A900;
      color: white;
    }
    .description-box {
      background: white;
      padding: 15px;
      border-radius: 6px;
      margin-top: 8px;
      border: 1px solid #e0e0e0;
      min-height: 60px;
    }
    .description-text {
      font-size: 13px;
      color: #555;
      line-height: 1.5;
      margin: 0;
    }
    .info-section {
      background-color: #f0f7ff;
      border-left: 4px solid #2196F3;
      padding: 15px 20px;
      margin: 20px 25px;
      border-radius: 4px;
    }
    .info-section h3 {
      margin: 0 0 8px 0;
      font-size: 14px;
      color: #1976D2;
    }
    .info-section p {
      margin: 0;
      font-size: 13px;
      color: #555;
      line-height: 1.5;
    }
    .footer {
      background-color: #2c3e50;
      color: white;
      padding: 20px;
      text-align: center;
      margin-top: 30px;
    }
    .footer p {
      margin: 5px 0;
      font-size: 12px;
      line-height: 1.6;
    }
    .footer-note {
      font-size: 11px;
      opacity: 0.8;
      margin-top: 15px;
    }
    .action-message {
      background-color: #39A900;
      color: white;
      padding: 15px 20px;
      margin: 20px 25px;
      border-radius: 6px;
      text-align: center;
      font-size: 13px;
      font-weight: 500;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <h1>SISTEMA DE GESTIÓN DE RELACIONAMIENTO CORPORATIVO</h1>
      <p>Servicio Nacional de Aprendizaje</p>
    </div>

    <!-- Greeting -->
    <div class="greeting">
      <p>Estimado(a) <strong>Miguel</strong>,</p>
      <p style="margin-top: 10px;">Nos complace informarle que su solicitud ha sido creada exitosamente en el sistema. A continuación, encontrará los detalles de su solicitud:</p>
    </div>

    <!-- Status Box -->
    <div class="status-box">
      <h2>✓ Nueva Solicitud Creada</h2>
    </div>

    <!-- Details Container -->
    <div class="details-container">
      <div class="detail-row">
        <span class="detail-label">Cliente:</span>
        <span class="detail-value">${requestData.Client?.NameClient || 'No especificado'}</span>
      </div>

      <div class="detail-row">
        <span class="detail-label">Tipo de Servicio:</span>
        <span class="detail-value">${requestData.serviceType?.serviceType || 'No especificado'}</span>
      </div>

      <div class="detail-row">
        <span class="detail-label">Estado:</span>
        <div class="status-badges">
          <span class="badge badge-current">${requestData.State?.State || 'Pendiente'}</span>
        </div>
      </div>

      <div class="detail-row">
        <span class="detail-label">Fecha del Evento:</span>
        <span class="detail-value">${requestData.eventDate || 'No especificado'}</span>
      </div>

      <div class="detail-row">
        <span class="detail-label">Ubicación:</span>
        <span class="detail-value">${requestData.location || 'No especificado'}</span>
      </div>

      <div class="detail-row">
        <span class="detail-label">Municipio:</span>
        <span class="detail-value">${requestData.municipality || 'No especificado'}</span>
      </div>

      <div class="detail-row">
        <span class="detail-label">Fecha de Creación:</span>
        <span class="detail-value">${new Date(requestData.createdAt).toLocaleDateString()}</span>
      </div>

      <div class="detail-row">
        <span class="detail-label">Descripción de la necesidad:</span>
        <div class="description-box">
          <p class="description-text">${requestData.needDescription || 'No especificado'}</p>
        </div>
      </div>
    </div>

    <!-- Action Message -->
    <div class="action-message">
      Su solicitud ha sido registrada correctamente. En breve recibirá actualizaciones sobre el estado de su solicitud.
    </div>

    <!-- Info Section -->
    <div class="info-section">
      <h3>¿Necesita más información?</h3>
      <p>Acceda al sistema para consultar el historial completo y realizar el seguimiento correspondiente.</p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p><strong>Nota:</strong> Esta solicitud ha sido registrada automáticamente en el sistema.</p>
      <p>Si tiene alguna consulta adicional, puede contactar a su gestor asignado.</p>
      <p class="footer-note">Por favor, no responda directamente a este correo electrónico.</p>
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