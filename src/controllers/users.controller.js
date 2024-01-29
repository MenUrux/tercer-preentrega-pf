import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

import CartModel from '../dao/models/cart.model.js';

dotenv.config();

const jwtSecret = process.env.SESSION_SECRET; // Usar la variable de entorno
const jwtExpiration = '1h';

import UserDao from "../dao/user.mongodb.dao.js"

export default class UsersController {

    static async get(filter = {}, opts = {}) {
        const users = await UserDao.get(filter, opts);
        console.log(`Usuarios encontrados: ${users.length}`);
        return users;
    }

    static async getById(uid) {
        const user = await UserDao.getById(uid);
        if (user) {
            console.log(`Se encontro el usuario exitosamente ${JSON.stringify(user)}`);
        }
        return user;
    }

    static async create(data) {
        const user = await UserDao.create(data);
        console.log(`Se creo el usuario exitosamente ${JSON.stringify(user)}`);
        return user;
    }



    static async update(uid, data) {
        const updateResult = await UserDao.updateById(uid, data);
        if (updateResult.modifiedCount === 0) {
            return null;
        }
        const updatedUser = await UserDao.getById(uid);
        return updatedUser;
    }

    static async delete(uid) {
        const deleteResult = await UserDao.deleteById(uid);
        if (deleteResult) {
            console.log(`Usuario eliminado exitosamente.`);
        }
        return deleteResult;
    }

    // Controladores de auth

    static async register(userData) {
        try {
            const { email, password, ...rest } = userData;
            const existingUser = await UserDao.get({ email });

            if (existingUser.length > 0) {
                throw new Error('El usuario ya existe.'); // Lanza un error en lugar de enviar una respuesta
            }

            // Hashear la contraseña antes de guardarla en la base de datos
            const hashedPassword = bcrypt.hashSync(password, 10);
            const newUser = await UserDao.create({ email, password: hashedPassword, ...rest });

            // Crear un carrito vacío para el nuevo usuario
            await CartModel.create({ user: newUser._id, products: [] });

            // Otras operaciones necesarias después del registro
            const userCart = await CartModel.findOne({ user: newUser._id }).populate('products.product');
            console.log(userCart)

            const updatedUser = await UserDao.getById(newUser._id);
            return updatedUser; // Devuelve el nuevo usuario en lugar de enviar una respuesta
        } catch (error) {
            throw error; // Lanza el error para que sea manejado por el middleware de errores
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await UserDao.get({ email });

            if (user && bcrypt.compareSync(password, user.password)) {
                const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: jwtExpiration });
                return res.json({ token });
            }

            return res.status(401).send('Credenciales inválidas.');
        } catch (error) {
            return res.status(500).send('Error al iniciar sesión.');
        }
    }

    static async getProfile(req, res) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, jwtSecret);

            const user = await UserDao.getById(decoded.userId);
            if (!user) {
                return res.status(404).send('Usuario no encontrado.');
            }

            // Omitir información sensible como la contraseña
            const userProfile = {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
                // otros campos que desees incluir
            };

            res.json(userProfile);
        } catch (error) {
            return res.status(500).send('Error al obtener el perfil del usuario.');
        }
    }

    static async logout(req, res) {
        // Si estás usando sesiones:
        req.session.destroy((err) => {
            if (err) return res.status(500).send('Error al cerrar sesión.');
            res.send('Sesión cerrada con éxito.');
        });

        // Si estás usando JWT, no hay necesidad de manejarlo aquí
    }

}