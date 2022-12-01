import { Router } from 'express';
import { deleteUser, getUser, getUsers, updateUser } from '../controllers/UserController.js';
import { verifyIsAdmin, verifyToken, verifyUser } from '../utils/Verify.js';
const route = Router();

route.get('/checkauthentication', verifyToken, (req, res) => {
  res.send('Hello User Logged');
});

route.get('/checkuser/:id', verifyUser, (req, res) => {
  res.send('Hello user check');
});

route.get('/checkadmin', verifyIsAdmin, (req, res) => {
  res.send('Hello admin, you can delete all user');
});

// GET USERS
route.get('/', verifyIsAdmin, getUsers);
// GET USER
route.get('/:id', verifyUser, getUser);
// UPDATE USER
route.put('/:id', verifyUser, updateUser);
// DELETE USER
route.delete('/:id', verifyUser, deleteUser);

export default route;
