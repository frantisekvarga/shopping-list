const bcrypt = require("bcryptjs");
const User = require("../models/users");
const jwt = require('jsonwebtoken');
require('dotenv').config();



exports.createUser = async (req, res) => {
  try {
    const existingUserByUsername = await User.findOne({ username: req.body.username });
      if (existingUserByUsername) {
          return res.status(400).json({ message: 'Toto používateľské meno je už obsadené.' });
      }

      const existingUserByEmail = await User.findOne({ email: req.body.email });
      if (existingUserByEmail) {
          return res.status(400).json({ message: 'Tento e-mail je už obsadený.' });
      }
      const hashedPassword = await bcrypt.hash(req.body.password, 10); 
      
      const user = new User({
        username: req.body.username,
        email: req.body.email,
        passwordHash: hashedPassword, 
        ownedLists: [],
        memberOfLists: []
      });

      const token = jwt.sign(
        { id: user._id, username: user.username, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      
      await user.save();
      return res.status(200).json({ message: "Úspešné prihlásenie !", userId: user._id, token });
  } catch (error) {
      res.status(500).json({ message: 'Problém s vytvorením použivateľa', error });
      console.log(error);
  }
};





exports.refreshToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  
  if (!refreshToken) {
    return res.status(401).json({ message: 'No refresh token provided' });
  }

  try {

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

 
    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } 
    );


    return res.status(200).json({ accessToken: newAccessToken });

  } catch (error) {
    return res.status(403).json({ message: 'Invalid refresh token' });
  }
};


exports.Login = async (req, res) => {
   

  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(404).json({ message: "User sa nenašiel" });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Zle vstupy' });
    }

    
    const accessToken = jwt.sign(
      { 
        id: user._id, 
        username: user.username, 
        email: user.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } 
    );

    const refreshToken = jwt.sign(
      { id: user._id }, 
      process.env.JWT_REFRESH_SECRET, 
      { expiresIn: '7d' } 
    );

    
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 
    });

   
    return res.status(200).json({
      message: "Connected!",
      user: { 
        id: user._id,
        username: user.username,
        email: user.email,
        ownedLists: user.ownedLists, 
        memberOfLists: user.memberOfLists
      },
      accessToken 
    });

  } catch (err) {
    console.error("Problém s prihlásením:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};


exports.searchUsers = async (req, res) => {
  try {
      const query = req.query.query; 
      const users = await User.find({ username: new RegExp(query, 'i') }); 
      res.json({ members: users });
  } catch (error) {
      console.error('Problém s vyhľadavaním users:', error);
      res.status(500).json({ error: 'Problém s vyhľadavaním users.' });
  }
};