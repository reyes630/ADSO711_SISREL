const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../models');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const sgMail = require("@sendgrid/mail");

// Clave secreta para JWT (en producción debe estar en variables de entorno)
const JWT_SECRET = process.env.JWT_SECRET || 'acad00f5b43383577b46398d23149b6d536c60494817d588e61f28d5f739e666c09d6e74f78cb21d7af6617beb62246d50babb2d84ba3b8d4690aa81b68d8503';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '1d';

class AuthService {
    /**
     * Iniciar sesión
     */
    async login(email, password) {
        try {
            // Buscar usuario por email
            const user = await db.user.findOne({
                where: { emailUser: email },
                include: [{
                    model: db.role,
                    as: 'role'
                }]
            });

            // Verificar si existe el usuario
            if (!user) {
                return {
                    success: false,
                    message: 'Credenciales inválidas'
                };
            }

            // Verificar contraseña
            const isPasswordValid = await bcrypt.compare(password, user.passwordUser);

            if (!isPasswordValid) {
                return {
                    success: false,
                    message: 'Credenciales inválidas'
                };
            }

            // Generar token JWT
            const token = this.generateToken(user.id);

            // Remover contraseña de la respuesta
            const userResponse = {
                id: user.id,
                documentUser: user.documentUser,
                nameUser: user.nameUser,
                emailUser: user.emailUser,
                telephoneUser: user.telephoneUser,
                FKroles: user.FKroles,
                role: user.role,
                coordinator: user.coordinator
            };

            return {
                success: true,
                token,
                user: userResponse
            };

        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        }
    }

    /**
     * Registrar nuevo usuario
     */
    async register(documentUser, nameUser, emailUser, telephoneUser, passwordUser, FKroles) {
        try {
            // Verificar si el email ya existe
            const existingUser = await db.user.findOne({
                where: { emailUser }
            });

            if (existingUser) {
                return {
                    success: false,
                    message: 'El email ya está registrado'
                };
            }

            // Hash de la contraseña
            const hashedPassword = await bcrypt.hash(passwordUser, 10);

            // Crear usuario
            const newUser = await db.user.create({
                documentUser,
                nameUser,
                emailUser,
                telephoneUser,
                passwordUser: hashedPassword,
                FKroles: FKroles || 1, // Rol por defecto (ajustar según tu BD)
                coordinator: 0
            });

            // Generar token
            const token = this.generateToken(newUser.id);

            // Remover contraseña de la respuesta
            const userResponse = {
                id: newUser.id,
                documentUser: newUser.documentUser,
                nameUser: newUser.nameUser,
                emailUser: newUser.emailUser,
                telephoneUser: newUser.telephoneUser,
                FKroles: newUser.FKroles,
                coordinator: newUser.coordinator
            };

            return {
                success: true,
                token,
                user: userResponse
            };

        } catch (error) {
            console.error('Error en registro:', error);
            throw error;
        }
    }

    /**
     * Generar token JWT
     */
    generateToken(userId) {
        return jwt.sign(
            { userId },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRE }
        );
    }

    /**
     * Verificar token JWT
     */
    verifyToken(token) {
        try {
            return jwt.verify(token, JWT_SECRET);
        } catch (error) {
            return null;
        }
    }

    /**
     * Middleware de autenticación
     */
    authenticate = async (req, res, next) => {
        try {
            // Obtener token del header
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).send({
                    status: "FAILED",
                    message: 'No autorizado. Token no proporcionado'
                });
            }

            const token = authHeader.split(' ')[1];

            // Verificar token
            const decoded = this.verifyToken(token);

            if (!decoded) {
                return res.status(401).send({
                    status: "FAILED",
                    message: 'Token inválido o expirado'
                });
            }

            // Buscar usuario
            const user = await db.user.findByPk(decoded.userId, {
                include: [{
                    model: db.role,
                    as: 'role'
                }],
                attributes: { exclude: ['passwordUser'] } // No incluir contraseña
            });

            if (!user) {
                return res.status(401).send({
                    status: "FAILED",
                    message: 'Usuario no encontrado'
                });
            }

            // Agregar usuario al request
            req.user = user;
            next();

        } catch (error) {
            console.error('Error en autenticación:', error);
            res.status(500).send({
                status: "FAILED",
                message: 'Error en la autenticación'
            });
        }
    };

    /**
     * Middleware para verificar roles
     */
    authorize = (...allowedRoles) => {
        return (req, res, next) => {
            if (!req.user) {
                return res.status(401).send({
                    status: "FAILED",
                    message: 'No autorizado'
                });
            }

            const userRole = req.user.role?.nameRole;

            if (!allowedRoles.includes(userRole)) {
                return res.status(403).send({
                    status: "FAILED",
                    message: 'No tiene permisos para realizar esta acción'
                });
            }

            next();
        };
    };

    /**
 * Verificar código de recuperación
 */
    async verifyResetCode(code) {
        try {
            const user = await db.user.findOne({
                where: {
                    resetPasswordToken: code,
                    resetPasswordExpires: { [db.Sequelize.Op.gt]: new Date() }
                }
            });

            if (!user) {
                return { success: false, message: 'Código inválido o expirado' };
            }

            return { success: true, email: user.emailUser };
        } catch (error) {
            console.error('Error en verifyResetCode:', error);
            throw error;
        }
    }

    async forgotPassword(email) {
        try {
            console.log("Iniciando recuperación de contraseña para:", email);

            const user = await db.user.findOne({ where: { emailUser: email } });
            if (!user) {
                console.log("Usuario no encontrado:", email);
                return { success: false, message: "Usuario no encontrado" };
            }

            // Generar código y token
            const verificationCode = Math.floor(100000 + Math.random() * 900000);
            const codeExpiration = new Date(Date.now() + 15 * 60 * 1000);
            const resetToken = crypto.randomBytes(32).toString("hex");

            // Guardar en BD
            await user.update({
                resetPasswordToken: resetToken,
                verificationCode: verificationCode.toString(),
                resetPasswordExpires: codeExpiration,
            });

            // Plantilla de correo (idéntica a la tuya)
            const emailHTML = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recuperación de Contraseña - SISREL</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      margin: 0;
      padding: 20px;
      line-height: 1.6;
    }

    .email-wrapper {
      max-width: 650px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }

    .header {
      background: linear-gradient(135deg, #39A900 0%, #2d8000 100%);
      color: #ffffff;
      padding: 30px 20px;
      text-align: center;
      position: relative;
    }

    .header::before {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #39A900, #66d932, #39A900);
    }

    .header h1 {
      font-size: 22px;
      font-weight: 600;
      margin: 0;
      letter-spacing: 0.5px;
    }

    .header .subtitle {
      font-size: 14px;
      opacity: 0.9;
      margin-top: 5px;
      font-weight: 300;
    }

    .content {
      padding: 35px 30px;
      color: #333333;
    }

    .greeting {
      font-size: 16px;
      margin-bottom: 20px;
      color: #2c3e50;
    }

    .greeting .user-name {
      color: #39A900;
      font-weight: 600;
    }

    .alert-box {
      background: linear-gradient(135deg, #fff3cd 0%, #fffbea 100%);
      border: 2px solid #ffc107;
      border-radius: 10px;
      padding: 20px;
      margin: 25px 0;
      text-align: center;
    }

    .alert-box h2 {
      color: #ff6b6b;
      font-size: 18px;
      margin-bottom: 10px;
    }

    .code-section {
      background: linear-gradient(135deg, #f8fffe 0%, #f0f9f0 100%);
      border: 2px solid #39A900;
      border-radius: 10px;
      padding: 30px 20px;
      margin: 30px 0;
      text-align: center;
      position: relative;
    }

    .code-section::before {
      content: "🔐";
      position: absolute;
      top: -15px;
      left: 50%;
      transform: translateX(-50%);
      background: #39A900;
      color: white;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }

    .code-label {
      font-size: 14px;
      color: #666;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 15px;
    }

    .verification-code {
      font-size: 48px;
      font-weight: 700;
      color: #39A900;
      letter-spacing: 8px;
      font-family: "Courier New", monospace;
      word-spacing: 10px;
      margin: 15px 0;
      background: #ffffff;
      padding: 20px;
      border-radius: 8px;
      border: 1px solid #e8f5e8;
    }

    .expiration {
      background: #ffe8e8;
      border-left: 4px solid #ff6b6b;
      padding: 12px 15px;
      border-radius: 6px;
      margin: 15px 0;
      font-size: 14px;
      color: #c92a2a;
      font-weight: 600;
    }

    .info-section {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 20px;
      margin: 25px 0;
      font-size: 14px;
      color: #555;
    }

    .info-section h3 {
      color: #2c3e50;
      margin-bottom: 10px;
      font-size: 16px;
    }

    .info-section ul {
      list-style: none;
      margin: 10px 0;
    }

    .info-section ul li {
      padding: 8px 0;
      padding-left: 25px;
      position: relative;
    }

    .info-section ul li::before {
      content: "✓";
      position: absolute;
      left: 0;
      color: #39A900;
      font-weight: bold;
      font-size: 18px;
    }

    .divider {
      height: 2px;
      background: linear-gradient(90deg, #39A900, #66d932, #39A900);
      margin: 25px 0;
      border-radius: 2px;
    }

    .footer {
      background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
      color: #ecf0f1;
      padding: 25px 20px;
      text-align: center;
      font-size: 13px;
    }

    .footer-content {
      max-width: 500px;
      margin: 0 auto;
    }

    .footer strong {
      color: #39A900;
    }

    @media (max-width: 600px) {
      body {
        padding: 10px;
      }

      .content {
        padding: 25px 20px;
      }

      .header h1 {
        font-size: 18px;
      }

      .verification-code {
        font-size: 36px;
        letter-spacing: 4px;
        word-spacing: 8px;
      }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="header">
      <div>
        <h1>SISREL - Gestión de Relacionamiento</h1>
        <div class="subtitle">Sistema de gestión de relacionamiento Corporativo</div>
      </div>
    </div>

    <div class="content">
      <div class="greeting">
        Hola <span class="user-name">${user.nameUser}</span>,
      </div>

      <p>Hemos recibido tu solicitud para restablecer tu contraseña. A continuación, encontrarás el código de verificación que necesitas:</p>

      <div class="code-section">
        <div class="code-label">Tu código de verificación</div>
        <div class="verification-code">${verificationCode}</div>
      </div>

      <div class="expiration">
        ⏱️ Este código expirará en <strong>15 minutos</strong>
      </div>

      <div class="divider"></div>

      <div class="info-section">
        <h3>📋 Pasos a seguir:</h3>
        <ul>
          <li>Copia el código de verificación anterior</li>
          <li>Regresa a la pantalla de recuperación en SISREL</li>
          <li>Pega el código en el campo indicado</li>
          <li>Ingresa tu nueva contraseña</li>
          <li>Confirma el cambio</li>
        </ul>
      </div>

      <div class="alert-box">
        <h2>⚠️ Importante</h2>
        <p>Si <strong>no solicitaste</strong> este cambio de contraseña, puedes ignorar este correo. Tu cuenta seguirá siendo segura.</p>
      </div>

      <p style="color: #7f8c8d; font-size: 14px; margin-top: 20px;">
        <strong>Recomendaciones de seguridad:</strong>
      </p>
      <ul style="color: #7f8c8d; font-size: 13px; margin-top: 10px; margin-left: 20px;">
        <li>No compartas este código con nadie</li>
        <li>SISREL nunca te pedirá que reveles tu contraseña</li>
      </ul>
    </div>

    <div class="footer">
      <div class="footer-content">
        <p>🔒 <strong>Mensaje de Seguridad Automático</strong></p>
        <p>Este correo ha sido generado automáticamente por <strong>SISREL</strong> para proteger tu cuenta.</p>
        <p style="margin-top: 10px; opacity: 0.8;">Por favor, no responda directamente a este correo electrónico.</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

            // Envío condicional según entorno
            if (process.env.EMAIL_SERVICE === "sendgrid") {
                console.log("📨 Enviando correo con SendGrid API...");

                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                const msg = {
                    to: user.emailUser,
                    from: {
                        name: "SISREL",
                        email: process.env.EMAIL_FROM,
                    },
                    subject: "Recuperación de Contraseña - SISREL",
                    html: emailHTML,
                };

                await sgMail.send(msg);
                console.log("✅ Correo enviado correctamente con SendGrid");
            } else {
                console.log("📨 Enviando correo con Gmail...");
                const transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS,
                    },
                });

                await transporter.sendMail({
                    from: `"SISREL" <${process.env.EMAIL_FROM}>`,
                    to: user.emailUser,
                    subject: "Recuperación de Contraseña - SISREL",
                    html: emailHTML,
                });

                console.log("✅ Correo enviado correctamente con Gmail");
            }

            return { success: true, message: "Correo de recuperación enviado exitosamente" };
        } catch (error) {
            console.error("❌ Error en forgotPassword:", error);
            throw new Error(`Error al enviar correo: ${error.message}`);
        }
    }



    /**
     * Restablecer contraseña con token de 6 dígitos
     */
    async resetPassword(token, newPassword) {
        try {
            if (!token || !newPassword) {
                return { success: false, message: 'Token y contraseña son obligatorios' };
            }

            // Buscar usuario con token válido y no expirado
            const user = await db.user.findOne({
                where: {
                    resetPasswordToken: token,
                    resetPasswordExpires: { [db.Sequelize.Op.gt]: new Date() },
                },
            });

            if (!user) {
                return { success: false, message: 'Token inválido o expirado' };
            }

            // Hashear nueva contraseña
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Actualizar usuario
            await user.update({
                passwordUser: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null,
                updatedAt: new Date(),
            });

            return { success: true, message: 'Contraseña actualizada exitosamente' };
        } catch (error) {
            console.error('Error al cambiar la contraseña:', error);
            return { success: false, message: 'Error al cambiar la contraseña' };
        }
    }

}

module.exports = new AuthService();

