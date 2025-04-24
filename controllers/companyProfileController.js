const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const validator = require('validator');

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await prisma.company.findUnique({
      where: { userId },
    });
    if (!profile) {
      return res.status(404).json({ message: 'Company profile not found' });
    }
    res.json(profile);
  } catch (error) {
    console.error('Error fetching company profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      companyName,
      rc,
      nIf,
      phone,
      companyEmail,
      address,
      responsableName,
    } = req.body;

    // Validate email
    if (companyEmail && !validator.isEmail(companyEmail)) {
      return res.status(400).json({ message: 'Invalid company email' });
    }

    // Validate phone number (basic check)
    if (phone && !validator.isMobilePhone(phone, 'any')) {
      return res.status(400).json({ message: 'Invalid phone number' });
    }

    const data = {
      userId,
      companyName,
      rc,
      nIf,
      phone,
      companyEmail,
      address,
      responsableName,
    };

    // Upsert company profile
    const updatedProfile = await prisma.company.upsert({
      where: { userId },
      update: data,
      create: data,
    });

    res.json(updatedProfile);
  } catch (error) {
    console.error('Error updating company profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
