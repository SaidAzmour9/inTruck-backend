// user controller
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

        const hashedPassword = await bcrypt.hash(password, 12); // Increase bcrypt rounds for stronger encryption
        const newUser = await prisma.user.create({
            data: {
                email: email,
                password: hashedPassword,
                userType: userType.toUpperCase(),
                role: role ? role.toUpperCase() : 'USER',
            }
        });

        
        if (userType.toUpperCase() === 'ADMIN') {
            return res.status(201).json({ message: 'Admin account created successfully', user: newUser });
        }

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

        // Include all user data in the response
        res.status(200).json({ token, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function forgetPassword(req, res) {
    try {
        const { email } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Email not found' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        await prisma.user.update({
            where: { email },
            data: { resetToken },
        });

        const resetLink = `http://localhost:5173/reset-password/${resetToken}`; // Dynamically use the FRONTEND_URL
        const info = await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: "Reset Password",
            text: `Click on this link to reset your password: ${resetLink}`,
        });

        res.status(200).json({ message: 'Password reset link sent successfully', messageId: info.messageId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function resetPassword(req, res) {
    try {
        const { password, confirmPassword } = req.body;
        const { token } = req.params;
        const user = await prisma.user.findUnique({
            where: { resetToken: token },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid token or user not found' });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        const hashedPassword = await bcrypt.hash(password, 12); // Increase bcrypt rounds for stronger encryption
        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword, resetToken: null },
        });

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function getAllUsers(req, res) {
    try {
        const users = await prisma.user.findMany();
        if (!users) {
            return res.status(404).json({ message: 'No users found' });
        }
        res.status(200).json({ users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function logOut(req, res) {
    try {
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function checkAuthStatus(req, res) {
    try {
        // Get user ID either from the authenticated user object or query parameter
        let userId = req.user?.id;
        
        // If not found in req.user, check query parameters
        if (!userId) {
            userId = req.query.userId;
        }
        
        if (!userId) {
            return res.status(400).json({ message: 'User ID is missing from request' });
        }

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

async function getUserProfile(req, res) {
    try {
      const userId = req.user.id;
  
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          company: true,
          individual: true,
        }
      });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // ⚡ Wrap inside { user: {...} }
      return res.status(200).json({
        user: {
          userType: user.userType,
          email: user.email,
          phone: user.phone,
          address: user.address,
          company: user.company || {},
          individual: user.individual || {},
        }
      });
  
    } catch (error) {
      console.error('Error fetching profile:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  

async function updateUserProfile(req, res) {
    try {
      const userId = req.user.id;
      const profileData = req.body;
  
      if (!profileData) {
        return res.status(400).json({ message: 'profileData not found' });
      }
  
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update main user fields
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          userType: profileData.userType,
          email: profileData.email,
          phone: profileData.phone,
          address: profileData.address,
        },
      });
  
      // Update company or individual info — protect against missing data
      if (profileData.userType === 'COMPANY' && profileData.company) {
        await prisma.company.updateMany({
          where: { userId },
          data: {
            companyName: profileData.company.companyName || '',
            rc: profileData.company.rc || '',
            nIf: profileData.company.nIf || '',
            responsableName: profileData.company.responsableName || '',
            phone: profileData.company.phone || '',
            address: profileData.company.address || '',
          },
        });
      } else if (profileData.userType === 'INDIVIDUAL' && profileData.individual) {
        await prisma.individual.updateMany({
          where: { userId },
          data: {
            fullName: profileData.individual.fullName || '',
            nationalId: profileData.individual.nationalId || '',
            phone: profileData.individual.phone || '',
            address: profileData.individual.address || '',
          },
        });
      }
  
      return res.status(200).json({ 
        message: 'Profile updated successfully',
        user: updatedUser
      });
  
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  


module.exports = { signUp, login, logOut, forgetPassword, resetPassword, checkAuthStatus, getUserProfile, updateUserProfile, getAllUsers };
