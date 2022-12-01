import { Router } from 'express';
import { createRoom, updateRoom, getRooms, getRoom, deleteRoom, updateAvailabilityRooms } from '../controllers/RoomController.js';
import { verifyIsAdmin, verifyUser } from '../utils/Verify.js';

const route = Router();

route.get('/', getRooms);
route.get('/:roomId', getRoom);
route.post('/:hotelId', verifyIsAdmin, createRoom);
route.put('/:roomId', verifyIsAdmin, updateRoom);
route.put('/availability/:roomId', updateAvailabilityRooms);
route.delete('/:roomId/hotels/:hotelId', verifyIsAdmin, deleteRoom);

export default route;
