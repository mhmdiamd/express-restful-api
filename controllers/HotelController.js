// import { ConnectionStates } from 'mongoose';
import Hotel from '../models/Hotel.js';
import Room from '../models/Room.js';

class HotelController {
  // Show All
  showHotel = (req, res) => {
    const { min, max, ...others } = req.query;
    Hotel.find({
      ...others,
      cheapestPrice: { $gt: min || 0, $lt: max || 9999 },
    })
      .limit(req.query.limit)
      .then((response) => {
        res.status(200).json({
          success: true,
          status: 200,
          data: response,
        });
      })
      .catch((err) => {
        res.status(409).json({
          message: err.message || 'Some Error while get data',
        });
      });
  };

  // Show Detail Hotel
  showDetailHotel = (req, res) => {
    Hotel.findById(req.params.id)
      .then((response) => {
        res.status(200).json({
          success: true,
          status: 200,
          data: response,
        });
      })
      .catch((err) => {
        res.status(409).json({
          message: err.message || 'Some Error while get data',
        });
      });
  };

  createHotel = (req, res) => {
    const newHotel = new Hotel(req.body);

    newHotel
      .save()
      .then((response) => {
        res.send(response);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  };

  // Update
  updateHotel = (req, res) => {
    Hotel.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then((response) => {
        res.send(response);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  };

  // Delete
  deleteHotel = (req, res) => {
    Hotel.findByIdAndDelete(req.params.id)
      .then((response) => {
        res.status(200).json({
          message: 'Data has been deleted!',
        });
      })
      .catch((err) => {
        res.status(500).json(err.message);
      });
  };

  // Count By City
  countByCity = async (req, res) => {
    const cities = req.query.cities.split(',');

    try {
      const list = await Promise.all(
        cities.map((city) => {
          return Hotel.countDocuments({ city: city });
        })
      );
      res.status(200).send(list);
    } catch (err) {
      // next(err);
      console.log(err);
    }
  };

  countByType = async (req, res, next) => {
    let type = req.query.type.split(',');
    let items = [];
    await type.forEach((data) => {
      Hotel.find({ type: data })
        .count()
        .then((result) => {
          items.push({
            type: data,
            total: result,
          });

          if (items.length == type.length) {
            res.status(200).send(items);
          }
        })
        .catch((err) => {
          next(err);
        });
    });
  };

  hotelRooms = async (req, res, next) => {
    const hotel = await Hotel.findById(req.params.id);
    try {
      const list = await Promise.all(
        hotel.rooms.map((room) => {
          return Room.findById(room);
        })
      );
      res.status(200).json(list);
    } catch (err) {
      next(err);
    }
  };
}

export default HotelController;
