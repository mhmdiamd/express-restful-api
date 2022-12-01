import express from 'express';
import HotelController from '../controllers/HotelController.js';
import { verifyIsAdmin, verifyToken } from '../utils/Verify.js';
const route = express.Router();

// Hotel Controller
const hotelController = new HotelController();

route.get('/', hotelController.showHotel);
route.get('/:id', hotelController.showDetailHotel);
route.post('/', verifyIsAdmin, hotelController.createHotel);
route.put('/:id', verifyIsAdmin, hotelController.updateHotel);
route.delete('/:id', verifyIsAdmin, hotelController.deleteHotel);

// CountById
route.get('/find/countByCity', hotelController.countByCity);
route.get('/find/countByType', hotelController.countByType);
route.get('/find/rooms/:id', hotelController.hotelRooms);
export default route;
