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
        <style>
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            font-family: Arial, sans-serif;
          }
          .header {
            background: #39A900;
            color: white;
            padding: 20px;
            text-align: center;
          }
          .content {
            padding: 20px;
            background: #f9f9f9;
          }
          .request-details {
            background: white;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>Nueva Solicitud de Servicio</h1>
          </div>
          <div class="content">
            <h2>Detalles de la Solicitud:</h2>
            <div class="request-details">
              <p><strong>ID de Solicitud:</strong> ${requestData.id}</p>
              <p><strong>Cliente:</strong> ${requestData.client?.nameClient || 'No especificado'}</p>
              <p><strong>Tipo de Servicio:</strong> ${requestData.serviceType?.nameServiceType || 'No especificado'}</p>
              <p><strong>Estado:</strong> ${requestData.state?.nameState || 'Pendiente'}</p>
              <p><strong>Fecha de Solicitud:</strong> ${new Date(requestData.createdAt).toLocaleDateString()}</p>
            </div>
            <p>Por favor, revise esta solicitud en el sistema SISREL.</p>
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