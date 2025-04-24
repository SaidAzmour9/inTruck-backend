
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

        // Prepare user data to send
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

module.exports = { signUp, login, logOut, forgetPassword, resetPassword, getUserProfile, getAllUsers };
