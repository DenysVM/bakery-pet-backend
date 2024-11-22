const User = require('../models/User');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password'); 
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId, '-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateUserProfile = async (req, res) => {
    const userId = req.params.id;
    const { firstName, lastName, phone, address, role } = req.body;
  
    try {
      const user = await User.findById(userId);
  
      if (user) {
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.phone = phone || user.phone;
  
        if (address) {
          user.address = {
            street: address.street || user.address.street,
            houseNumber: address.houseNumber || user.address.houseNumber,
            apartmentNumber: address.apartmentNumber || user.address.apartmentNumber,
            city: address.city || user.address.city,
          };
        }
  
        if (req.user.role === 'admin' && role) {
          user.role = role;
        }
  
        const updatedUser = await user.save();
        res.json({
          _id: updatedUser._id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          phone: updatedUser.phone,
          address: updatedUser.address,
          role: updatedUser.role,
        });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  
const deleteUser = async (req, res) => {
    const userId = req.params.id;
  
    try {
      const user = await User.findById(userId);
  
      if (user) {
        await User.deleteOne({ _id: userId });
        res.json({ message: 'User removed' });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
 
module.exports = {
  getAllUsers,
  getUserById,
  updateUserProfile,
  deleteUser,
};
