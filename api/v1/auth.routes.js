const { Router } = require('express');
const router = Router();
const authService = require('../../services/authService');

/**
 * @route   POST /api/v1/auth/login
 * @desc    Autenticar usuario y obtener token
 * @access  Public
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validar que vengan los datos
        if (!email || !password) {
            return res.status(400).send({
                status: "FAILED",
                message: 'Por favor proporcione email y contraseña'
            });
        }

        // Intentar login
        const result = await authService.login(email, password);

        if (!result.success) {
            return res.status(401).send({
                status: "FAILED",
                message: result.message
            });
        }

        // Login exitoso
        res.status(200).send({
            status: "OK",
            message: 'Login exitoso',
            data: {
                token: result.token,
                user: result.user
            }
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).send({
            status: "FAILED",
            message: 'Error en el servidor',
            error: error.message
        });
    }
});

/**
 * @route   POST /api/v1/auth/register
 * @desc    Registrar nuevo usuario
 * @access  Public
 */
router.post('/register', async (req, res) => {
    try {
        const { documentUser, nameUser, emailUser, telephoneUser, passwordUser, FKroles } = req.body;

        // Validar datos requeridos
        if (!nameUser || !emailUser || !passwordUser) {
            return res.status(400).send({
                status: "FAILED",
                message: 'Por favor proporcione nombre, email y contraseña',
                received: req.body // Para debug
            });
        }

        // Registrar usuario
        const result = await authService.register(documentUser, nameUser, emailUser, telephoneUser, passwordUser, FKroles);

        if (!result.success) {
            return res.status(400).send({
                status: "FAILED",
                message: result.message
            });
        }

        res.status(201).send({
            status: "OK",
            message: 'Usuario registrado exitosamente',
            data: {
                token: result.token,
                user: result.user
            }
        });

    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).send({
            status: "FAILED",
            message: 'Error en el servidor',
            error: error.message
        });
    }
});

/**
 * @route   GET /api/v1/auth/me
 * @desc    Obtener usuario actual
 * @access  Private
 */
router.get('/me', authService.authenticate, async (req, res) => {
    try {
        // El usuario viene del middleware authenticate
        res.status(200).send({
            status: "OK",
            message: "Usuario actual",
            data: req.user
        });
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).send({
            status: "FAILED",
            message: 'Error en el servidor'
        });
    }
});

/**
 * @route   POST /api/v1/auth/forgot-password
 * @desc    Enviar código de verificación por correo
 * @access  Public
 */
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const result = await authService.forgotPassword(email);

        if (!result.success) {
            return res.status(404).send({
                status: "FAILED",
                message: "No se encontró una cuenta con ese correo"
            });
        }

        res.status(200).send({
            status: "OK",
            message: "Código de verificación enviado al correo"
        });
    } catch (error) {
        console.error('Error en forgot-password:', error);
        res.status(500).send({
            status: "FAILED",
            message: "Error al enviar código",
            error: error.message
        });
    }
});

/**
 * @route   POST /api/v1/auth/verify-reset-code
 * @desc    Verificar código de recuperación
 * @access  Public
 */
router.post('/verify-reset-code', async (req, res) => {
    try {
        const { code } = req.body;
        const result = await authService.verifyResetCode(code);

        if (!result.success) {
            return res.status(400).send({
                status: "FAILED",
                message: result.message
            });
        }

        res.status(200).send({
            status: "OK",
            message: "Código válido",
            email: result.email
        });
    } catch (error) {
        console.error('Error en verify-reset-code:', error);
        res.status(500).send({
            status: "FAILED",
            message: "Error al verificar código",
            error: error.message
        });
    }
});


router.post('/reset-password', async (req, res) => {
    try {
        const { token, newPassword } = req.body; // 👈 token, no resetToken ni code

        if (!token || !newPassword) {
            return res.status(400).send({
                status: "FAILED",
                message: "Faltan datos (token o nueva contraseña)"
            });
        }

        const result = await authService.resetPassword(token, newPassword);
        
        if (result.success) {
            res.status(200).send({
                status: "OK",
                message: "Contraseña actualizada exitosamente"
            });
        } else {
            res.status(400).send({
                status: "FAILED",
                message: result.message
            });
        }
    } catch (error) {
        res.status(500).send({
            status: "FAILED",
            message: "Error al resetear la contraseña",
            error: error.message
        });
    }
});


// Exportar el modulo
module.exports = router;