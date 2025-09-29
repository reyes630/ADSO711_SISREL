const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../models');

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
                role: user.role
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
                FKroles: FKroles || 1 // Rol por defecto (ajustar según tu BD)
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
                FKroles: newUser.FKroles
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
}

module.exports = new AuthService();