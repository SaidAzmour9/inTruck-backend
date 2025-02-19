const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient()

async function signUp(req,res) {
    try {
        const { email, password, name, phone } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (user) {
            return res.status(400).json({ message: 'Email already exists' });
            }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                email:email,
                password:hashedPassword,
                fullName:name,
                phone:phone
            }
        });
        res.status(200).json(newUser)

        
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


async function logOut(req,res) {
    try {
        res.clearCookie('token');
        res.status(200).json({ message: 'Logged out successfully' });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
        
    }
}


module.exports = {signUp,login,logOut};