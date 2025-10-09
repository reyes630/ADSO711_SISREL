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
        console.log('Iniciando recuperación de contraseña para:', email);
        
        const user = await db.user.findOne({ where: { emailUser: email } });
        if (!user) {
            console.log('Usuario no encontrado:', email);
            return { success: false };
        }

        // Generar código de verificación de 6 dígitos
        const verificationCode = Math.floor(100000 + Math.random() * 900000);
        const codeExpiration = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

        // Generar token adicional para seguridad
        const resetToken = crypto.randomBytes(32).toString('hex');

        console.log('Configurando transportador de correo...');
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            debug: true,
            logger: true
        });

        // Verificar conexión SMTP
        console.log('Verificando conexión SMTP...');
        await transporter.verify();
        console.log('Conexión SMTP verificada exitosamente');

        // Actualizar usuario con token y código
        await user.update({
            resetPasswordToken: resetToken,
            verificationCode: verificationCode.toString(),
            resetPasswordExpires: codeExpiration
        });

        // HTML del email con estilo SENA
        const emailHTML = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        background-color: #f5f5f5;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 20px auto;
                        background-color: #ffffff;
                        border-radius: 8px;
                        overflow: hidden;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }
                    .header {
                        background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
                        color: white;
                        padding: 30px;
                        text-align: center;
                    }
                    .header h1 {
                        margin: 0;
                        font-size: 28px;
                        font-weight: bold;
                    }
                    .header p {
                        margin: 5px 0 0 0;
                        font-size: 14px;
                        opacity: 0.95;
                    }
                    .content {
                        padding: 30px;
                        color: #333333;
                    }
                    .greeting {
                        font-size: 16px;
                        margin-bottom: 20px;
                        font-weight: 500;
                    }
                    .message {
                        font-size: 14px;
                        line-height: 1.6;
                        color: #555555;
                        margin-bottom: 25px;
                    }
                    .code-section {
                        background-color: #f8f9fa;
                        border: 2px dashed #2ecc71;
                        border-radius: 8px;
                        padding: 20px;
                        text-align: center;
                        margin: 25px 0;
                    }
                    .code-label {
                        font-size: 12px;
                        color: #666666;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        margin-bottom: 10px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 8px;
                    }
                    .code-label::before {
                        content: "🔐";
                        font-size: 16px;
                    }
                    .verification-code {
                        font-size: 36px;
                        font-weight: bold;
                        color: #2ecc71;
                        letter-spacing: 4px;
                        font-family: 'Courier New', monospace;
                    }
                    .expiration {
                        font-size: 12px;
                        color: #e74c3c;
                        margin-top: 10px;
                        font-weight: 500;
                    }
                    .warning {
                        font-size: 13px;
                        color: #7f8c8d;
                        margin-top: 30px;
                        padding-top: 20px;
                        border-top: 1px solid #ecf0f1;
                    }
                    .footer {
                        background-color: #2c3e50;
                        color: white;
                        padding: 20px;
                        text-align: center;
                        font-size: 12px;
                    }
                    .footer-icon {
                        margin-bottom: 8px;
                        font-size: 14px;
                    }
                    .footer-title {
                        color: #2ecc71;
                        font-weight: bold;
                        margin-bottom: 5px;
                    }
                    .footer-text {
                        opacity: 0.85;
                        line-height: 1.4;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Recuperación de Contraseña</h1>
                        <p>Sistema de Gestión SISREL</p>
                    </div>
                    
                    <div class="content">
                        <p class="greeting">Estimado(a) ${user.nameUser || 'Usuario'},</p>
                        
                        <p class="message">
                            Has solicitado recuperar el acceso a tu cuenta. Utiliza el siguiente código para restablecer tu contraseña:
                        </p>
                        
                        <div class="code-section">
                            <div class="code-label">Código de Verificación</div>
                            <div class="verification-code">${verificationCode}</div>
                            <div class="expiration">Este código expirará en 15 minutos</div>
                        </div>
                        
                        <p class="warning">
                            Si no solicitaste este cambio, puedes ignorar este mensaje. Tu cuenta permanecerá segura.
                        </p>
                    </div>
                    
                    <div class="footer">
                        <div class="footer-icon">📧 Mensaje Automático</div>
                        <div class="footer-title">Este correo fue generado por el Sistema de Gestión SISREL</div>
                        <div class="footer-text">
                            Por favor, no respondas a este correo.<br>
                            Si tienes problemas, contacta al administrador.
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;

        console.log('Enviando correo...');
        const info = await transporter.sendMail({
            from: `"SISREL Support" <${process.env.EMAIL_USER}>`,
            to: user.emailUser,
            subject: 'Recuperación de Contraseña - SISREL',
            html: emailHTML
        });

        console.log('Correo enviado exitosamente:', info.messageId);
        return { 
            success: true, 
            message: 'Correo de recuperación enviado exitosamente'
        };
    } catch (error) {
        console.error('Error detallado en forgotPassword:', error);
        if (error.code === 'EAUTH') {
            console.error('Error de autenticación con Gmail. Verifica las credenciales.');
        }
        throw new Error(`Error al enviar correo: ${error.message}`);
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