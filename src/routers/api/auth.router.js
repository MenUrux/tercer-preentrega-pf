import { Router } from 'express';
import UsersController from '../../controllers/users.controller.js';

const router = Router();

router.post('/register', async (req, res, next) => {
  try {
    const newUser = await UsersController.register(req.body);
    if (newUser) {
      res.status(201).json(newUser);
    }
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  // Lógica de inicio de sesión
});

export default router;
