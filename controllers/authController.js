const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const { sendRegistrationEmail } = require('../services/emailService');

dotenv.config();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const registerUser = async (req, res) => {
  const { firstName, lastName, email, password, phone, address, role, language } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Создаем пользователя
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      address,
      role,
      language,
    });

    if (user) {
      // Генерируем токен верификации
      const verificationToken = crypto.randomBytes(32).toString('hex');
      user.emailVerificationToken = verificationToken;
      user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 часа

      await user.save();

      const frontendUrl =
        process.env.FRONTEND_URL && process.env.NODE_ENV === 'production'
          ? process.env.FRONTEND_URL
          : 'http://localhost:3000';

      // Формируем ссылку и отправляем письмо
      const verificationLink = `${frontendUrl}/#/verify-email?token=${verificationToken}`;
      await sendRegistrationEmail(user, verificationLink);

      // Возвращаем ответ
      res.status(201).json({
        message: 'User registered. Please check your email to verify your account.',
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.log('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({ emailVerificationToken: token });

    if (user) {
      if (user.emailVerificationExpires > Date.now()) {
        user.isVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;
        await user.save();
        return res.status(200).json({ message: 'Email подтверждён успешно!' });
      }

      if (user.isVerified) {
        return res.status(200).json({ message: 'Email уже подтверждён ранее.' });
      }

      return res.status(400).json({ message: 'Срок действия токена истёк.' });
    }


    // Если не найден токен — попробуем найти пользователя с этим email, уже подтверждённого
    const previouslyVerified = await User.findOne({
      isVerified: true,
      emailVerificationToken: undefined,
    });

    if (previouslyVerified) {
      return res.status(200).json({ message: 'Email уже подтверждён ранее.' });
    }

    // Если ни один вариант не сработал — считаем токен невалидным
    return res.status(400).json({ message: 'Недействительный или просроченный токен' });
  } catch (error) {
    console.error('Ошибка при подтверждении email:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

const authUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error authenticating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateUserProfile = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    Object.assign(user, updates);
    await user.save();

    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Error updating profile", error });
  }
};

module.exports = {
  registerUser,
  verifyEmail,
  authUser,
  updateUserProfile,
};
