require('dotenv').config();
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: 'sisrelnotification@gmail.com', // correo destino (tu Gmail)
  from: process.env.EMAIL_FROM, // remitente verificado en SendGrid
  subject: '🔑 Prueba de SendGrid desde Node.js',
  text: 'Si ves este mensaje, tu API Key funciona correctamente.',
};

sgMail
  .send(msg)
  .then(() => console.log('✅ Correo enviado correctamente'))
  .catch((error) => {
    console.error('❌ Error al enviar:', error.response?.body || error.message);
  });
