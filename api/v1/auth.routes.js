const express = require('express');
const router = express.Router();
const authService = require('../services/authService');

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
            return res.status(400).json({
                success: false,
                message: 'Por favor proporcione email y contraseña'
            });
        }

        // Intentar login
        const result = await authService.login(email, password);

        if (!result.success) {
            return res.status(401).json({
                success: false,
                message: result.message
            });
        }

        // Login exitoso
        res.status(200).json({
            success: true,
            message: 'Login exitoso',
            data: {
                token: result.token,
                user: result.user
            }
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            success: false,
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
        const { name, email, password, roleId } = req.body;

        // Validar datos requeridos
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Por favor proporcione nombre, email y contraseña'
            });
        }

        // Registrar usuario
        const result = await authService.register(name, email, password, roleId);

        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: result.message
            });
        }

        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            data: {
                token: result.token,
                user: result.user
            }
        });

    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({
            success: false,
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
        res.status(200).json({
            success: true,
            data: req.user
        });
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor'
        });
    }
});

module.exports = router;