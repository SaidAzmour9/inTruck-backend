const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const transporter = require('../utils/email');
const crypto = require('crypto');

const prisma = new PrismaClient();

async function signUp(req, res) {
  try {
    const { email, role, password, phone, userType, fullName, nationalId, address, companyName, rc, nIf, responsableName } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
        userType: userType.toUpperCase(),
        role: role ? role.toUpperCase() : 'USER',
      }
    });

    if (userType === 'Company') {
      await prisma.company.create({
        data: {
          userId: newUser.id,
          companyName: companyName,
          phone: phone,
          address: address,
          rc: rc,
          nIf: nIf,
          responsableName: responsableName,
        }
      });
    }

    if (userType === 'Individual') {
      await prisma.individual.create({
        data: {
          userId: newUser.id,
          fullName: fullName,
          nationalId: nationalId,
          address: address,
          phone: phone,
        }
      });
    }

    return res.status(201).json({ message: 'Account created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        individual: true,
        company: true,
      }
    });
    if (!user) {
      return res.status(400).json({ message: 'Email not found' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET_KEY, {
      expiresIn: '1h',
    });

    const userData = {
      id: user.id,
      email: user.email,
      role: user.role,
      userType: user.userType,
      fullName: user.individual ? user.individual.fullName : (user.company ? user.company.companyName : ''),
      phone: user.individual ? user.individual.phone : (user.company ? user.company.phone : ''),
    };

    res.status(200).json({ token, user: userData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function getUserProfile(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: 'User ID is missing from request' });
    }

    const userId = req.user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        individual: true,
        company: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

module.exports = { signUp, login, getUserProfile };
