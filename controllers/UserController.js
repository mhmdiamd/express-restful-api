import User from '../models/User.js';
// GET ALL DATA
export const getUsers = (req, res) => {
  User.find()
    .then((response) => {
      let users = [];
      response.forEach((user) => {
        const { password, isAdmin, ...othersDetail } = user._doc;
        users.push({ ...othersDetail });
      });
      res.send(users);
    })
    .catch((err) => {
      res.status(409).json({
        message: err.message || 'Some Error while get data!',
      });
    });
};

// Get Specific Data!
export const getUser = (req, res) => {
  User.findById(req.params.id)
    .then((response) => {
      if (!response) {
        return res.status(404).json({ message: 'data not Found!' });
      }
      const { password, isAdmin, ...othersDetail } = response._doc;
      res.status(200).json({ ...othersDetail });
    })
    .catch((err) => {
      res.status(409).json({
        message: err.message || 'Some error while get detail data!',
      });
    });
};

export const updateUser = (req, res) => {
  User.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    { new: true }
  )
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((err) => {
      res.status(409).json({
        message: err.message || 'Some Error while update User!',
      });
    });
};

export const deleteUser = (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then((response) => {
      res.status(200).json({
        message: 'Delete Success!',
      });
    })
    .catch((err) => {
      res.status(409).json({
        message: err.message || 'Some Error while delete data!',
      });
    });
};
