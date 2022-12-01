import jwt from 'jsonwebtoken';
import { createError } from './Error.js';

// Comparation Token
export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(createError(401, 'Unauthorized'));
  }

  // Verifikasi Akses Token user yang login dan akses
  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) return next(createError(404, 'Token is not valid!'));
    req.user = user;
    next();
  });
};

// Middleware : Verifikasi user, yang mana untuk memberikan akses hapus akun antara user yang login (user itu sendiri) atau admin!
export const verifyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.params.id == req.user.id || req.user.isAdmin) {
      return next();
    } else {
      return next(createError(403, 'You are not authorized!'));
    }
  });
};

// Middleware : Melakukan authorization admin, yang mana untuk memberikan akses lebih untuk admin!
export const verifyIsAdmin = (req, res, next) => {
  verifyToken(req, res, next, () => {
    console.log(req.user);
    if (req.user.isAdmin) {
      return next();
    } else {
      return next(createError(403, 'You are not authorized!'));
    }
  });
};
