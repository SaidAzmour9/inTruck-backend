const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {PrismaClient} = require('@prisma/client');
const transporter = require('../utils/email');
const crypto = require('crypto');

const prisma = new PrismaClient()

async function signUp(req,res) {
    try {
        const { email, password, phone,userType,fullName,nationalId,address,companyName,rc,nIf,responsableName } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (user) {
            return res.status(400).json({ message: 'Email already exists' });
            }
            console.log(email, password, phone,userType,fullName,nationalId,address,companyName,rc,nIf,responsableName);
            
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                email:email,
                password:hashedPassword,
                userType:userType,
            }
        })
            if(userType === 'Company'){
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
                })
            }
            if(userType === 'Individual'){
                await prisma.individual.create({
                    data: {
                        userId: newUser.id,
                        fullName: fullName,
                        nationalId: nationalId,
                        address: address,
                        phone: phone,
                    }   
                })
            }
            return res.status(201).json({ message: 'Account created successfully' }); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
        
    }
}

async function login(req,res) {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Email not found' });
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ message: 'Invalid password' });
        }
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, {
            expiresIn: '1h',
        });
        res.cookie('token',token,{
            httpOnly:true,

        })
        res.status(200).json({ token, userId: user.id });

        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function forgetPassword(req,res) {
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
        
        
        const resetLink = `${req.protocol}://${req.get('host')}/reset_password/${resetToken}`;
        const info = await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: "Reset Password",
            text: `Click on this link to reset your password: ${resetLink}`,
        });
          res.status(200).json({ "Message sent: %s": info.messageId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
        
    
}

async function resetPassword(req,res) {
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
        const hashedPassword = await bcrypt.hash(password, 10);
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



async function logOut(req,res) {
    try {
        res.clearCookie('token');
        res.status(200).json({ message: 'Logged out successfully' });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
        
    }
}


module.exports = {signUp,login,logOut,forgetPassword,resetPassword};