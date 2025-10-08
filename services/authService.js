const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../models');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

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
            const user = await db.user.findOne({ where: { emailUser: email } });
            if (!user) return { success: false };

            // ✅ Generar código de 6 dígitos
            const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

            // ✅ Expira en 15 minutos
            const tokenExpiration = new Date(Date.now() + 15 * 60 * 1000);

            // ✅ Guardar el código y la expiración en la BD
            await user.update({
                resetPasswordToken: resetCode,
                resetPasswordExpires: tokenExpiration,
            });

            // ✅ Configurar transporte de correo
            const transporter = nodemailer.createTransport({
                service: process.env.EMAIL_SERVICE,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            // ✅ Plantilla HTML elegante
            const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recuperación de Contraseña</title>
  <style>
    body {
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      margin: 0;
      padding: 20px;
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

    .reset-title {
      background: linear-gradient(135deg, #39A900, #66d932);
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      font-size: 18px;
      font-weight: 600;
      text-align: center;
      margin: 20px 0;
      box-shadow: 0 4px 15px rgba(57, 169, 0, 0.2);
    }

    .code-box {
      background: #f8fffe;
      border: 2px dashed #39A900;
      border-radius: 10px;
      padding: 25px;
      text-align: center;
      font-size: 28px;
      font-weight: bold;
      color: #2d8000;
      letter-spacing: 4px;
      margin: 30px 0;
    }

    .footer {
      background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
      color: #ecf0f1;
      padding: 25px 20px;
      text-align: center;
      font-size: 13px;
    }

    .footer strong {
      color: #39A900;
    }

    .note {
      font-size: 14px;
      color: #555;
      text-align: center;
      margin-top: 15px;
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="header">
      <h1>Recuperación de Contraseña</h1>
      <p style="font-size:14px; opacity:0.9;">Servicio Nacional de Aprendizaje (SENA)</p>
    </div>

    <div class="content">
      <div class="greeting">
        Estimado(a) <strong>${user.nameUser || "Usuario"}</strong>,
      </div>

      <p>Has solicitado recuperar el acceso a tu cuenta. Utiliza el siguiente código para restablecer tu contraseña:</p>

      <div class="reset-title">🔐 Código de Verificación</div>

      <div class="code-box">${resetCode}</div>

      <p class="note">Este código expirará en <strong>15 minutos</strong>.</p>

      <p class="note">Si no solicitaste este cambio, puedes ignorar este mensaje.</p>
    </div>

    <div class="footer">
      <p>🤖 <strong>Mensaje Automático</strong></p>
      <p>Este correo fue generado por el <strong>Sistema de Gestión SENA</strong>.</p>
      <p style="margin-top: 10px; opacity: 0.8;">Por favor, no respondas a este correo.</p>
    </div>
  </div>
</body>
</html>
    `;

            // ✅ Enviar correo
            await transporter.sendMail({
                from: `"Sistema SENA" <${process.env.EMAIL_USER}>`,
                to: user.emailUser,
                subject: "Código de Recuperación de Contraseña",
                html: htmlContent,
            });

            return { success: true };
        } catch (error) {
            console.error("Error en forgotPassword:", error);
            throw error;
        }
    }


    /**
     * Restablecer contraseña con token de 6 dígitos
     */
    async resetPassword(token, newPassword) {
        try {
            if (!token) {
                return { success: false, message: 'Token no proporcionado' };
            }

            // 🔹 Buscar usuario con token válido y no expirado
            const user = await db.user.findOne({
                where: {
                    resetPasswordToken: token, // <-- ya no se hashea
                    resetPasswordExpires: { [db.Sequelize.Op.gt]: new Date() }, // aún válido
                },
            });

            if (!user) {
                return { success: false, message: 'Token inválido o expirado' };
            }

            // 🔹 Hashear nueva contraseña
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // 🔹 Actualizar usuario
            await user.update({
                passwordUser: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null,
            });

            return { success: true, message: 'Contraseña actualizada exitosamente' };
        } catch (error) {
            console.error('Error al cambiar la contraseña:', error);
            return { success: false, message: 'Error al cambiar la contraseña' };
        }
    }

}

module.exports = new AuthService();