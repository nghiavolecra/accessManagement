import User from '../models/User.js';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json({message: 'Registered'});
    } catch (err) {
        res.status(400).json({error: err.message});
    }
};

export const login = async (req, res) => {
    const {username, password} = req.body;
    const user = await User.findOne({username});
    if (!user || !(await user.comparePassword(password)))
        return res.status(401).json({error: 'Invalid creds'});
    const token = jwt.sign(
        {id : user_id},
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRES_IN}
    );
    res.json({token});
};

