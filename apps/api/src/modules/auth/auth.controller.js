import { loginUser, registerUser } from "./auth.service.js";

export function getCurrentUser(req, res) {
    res.status(200).json({
      data: {
        user: {
          id: req.user.id,
          role: req.user.role,
        },
      },
    });
}
  
export async function register(req, res, next) {
  try {
    const result = await registerUser(req.body);

    res.status(201).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const result = await loginUser(req.body);

    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
}