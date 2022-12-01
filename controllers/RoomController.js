import Hotel from '../models/Hotel.js'; // Class model dari Hotel
import Room from '../models/Room.js'; // Class model dari Room

export const getRooms = (req, res) => {
  Room.find()
    .then((rooms) => {
      res.status(200).send(rooms);
    })
    .catch((err) => {
      res.status(409).json({
        message: err.error || 'Some error while get data!',
      });
    });
};

export const getRoom = (req, res) => {
  Room.findById(req.params.roomId)
    .then((room) => {
      if (!room) {
        return res.status(404).json({ message: 'room not Found!' });
      }
      res.status(200).send(room);
    })
    .catch((err) => {
      err.status(409).json({
        message: err.message || 'some error while show data',
      });
    });
};

export const createRoom = (req, res) => {
  const room = new Room(req.body);
  const savedRooms = room.save();

  // Menambahkan Rooms dulu untuk mendapatkan Id nya
  savedRooms
    .then((room) => {
      // mencari hotel berdasarkan id parameter hotel
      Hotel.findByIdAndUpdate(
        req.params.hotelId,
        {
          // Menambhkan id room yang baru saja ditambahkan ke hotel
          $push: { rooms: room._id },
        },
        { new: true }
      )
        .then((response) => {
          res.status(200).send(room);
        })
        .catch((err) => {
          res.status(409).json({
            message: err.message || 'Some Error while update hotel Room!!',
          });
        });
    })
    .catch((err) => {
      res.status(409).json({
        message: err.message || 'Some Error while create Rooms!',
      });
    });
};

export const updateRoom = (req, res) => {
  Room.findByIdAndUpdate(
    req.params.roomId,
    {
      $set: req.body,
    },
    { new: true }
  )
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(409).json({
        message: err.message || 'Some Error while update Room!',
      });
    });
};

export const deleteRoom = (req, res, next) => {
  const hotelId = req.params.hotelId;
  const roomId = req.params.roomId;
  Room.findByIdAndDelete(roomId)
    .then((response) => {
      Hotel.findOneAndUpdate(hotelId, {
        $pull: { rooms: roomId },
      })
        .then((response) => {
          res.status(200).send({
            success: true,
            status: 200,
            message: 'Room has deleted!',
          });
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
};

export const updateAvailabilityRooms = (req, res) => {
  Room.updateOne(
    { 'roomNumbers._id': req.params.roomId },
    {
      $push: {
        'roomNumbers.$.unavailableDates': req.body.dates,
      },
    }
  )
    .then((result) => {
      res.status(200).send('Success!');
    })
    .catch((err) => {
      res.status(409).json({
        message: err.message || 'Some Error while update Room!',
      });
    });
};
