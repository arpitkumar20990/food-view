const userModel = require('../models/user.model')
const foodPartnerModel = require('../models/foodPartner.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


async function registerUser(req, res){
    const{fullName, email, password} = req.body;

    const isUserAlreadyExists = await userModel.findOne({
        email
    })

    if(isUserAlreadyExists){
        return res.status(400).json({
            message : "User Already Exists"
        })
    }

    const hashedPassword = await bcrypt.hash(password,10);

    const user = await userModel.create({
        fullName,
        email,
        password : hashedPassword
    })

    const token = jwt.sign({
        id:user._id,
    }, process.env.JWT_SECRET)

    res.cookie("token", token)

    return res.status(201).json({
        message : "user created successfully",
        user : {
            _id : user._id,
            fullName : user.fullName,
            email : user.email
        }
    })
}

async function loginUser(req, res){
    const {email, password} = req.body;

    const user = await userModel.findOne({
        email
    })

    if(!user){
        return res.status(400).json({
            message : "Invalid Email or Password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if(!isPasswordValid){
        return res.status(400).json({
            message : "Invalid Email or Password"
        })
    }

    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET);

    res.cookie("token", token);

    return res.status(200).json({
        message : "User loggedin successfully ",
        user : {
             _id : user._id,
            fullName : user.fullName,
            email : user.email
        }
    })
}

function logoutUser(req, res){
    res.clearCookie("token");
    res.status(200).json({
        message : "User logged out successfully"
    })
}

async function registerFoodPartner(req, res){
    const {name, email , password , address} = req.body;

    const isAccountAlreadyExists = await foodPartnerModel.findOne({
        email
    })

    if(isAccountAlreadyExists){
        return res.status(400).json({
            message : "User Already Exists"
        })
    }

    const hashedPassword = await bcrypt.hash(password , 10);

    const user = await foodPartnerModel.create({
        name,
        email,
        password : hashedPassword,
        address
    })

    const token = jwt.sign({
        id:user._id,
    }, process.env.JWT_SECRET)

    res.cookie("token", token);

    res.status(201).json({
        message: "user created successfully",
        user : {
             _id : user._id,
            name : user.name,
            email : user.email
        }
    })
}

async function loginFoodPartner(req,res){
    const {email, password} = req.body;

    const foodPartner = await foodPartnerModel.findOne({
        email
    })

    if(!foodPartner){
        return res.status(400).json({
            message : "Invalid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, foodPartner.password);

    if(!isPasswordValid){
        return res.status(400).json({
            message : "Invalid email or password"
        })
    }

    const token = jwt.sign({
        id:foodPartner._id,
    }, process.env.JWT_SECRET)

    res.cookie("token", token);

    res.status(200).json({
        message : "User Logged In Successfully",
        foodPartner : {
            _id : foodPartner._id,
            name : foodPartner.name,
            email : foodPartner.email
        }
    })
}

function logoutFoodPartner(req,res){
    res.clearCookie("token")
    res.status(200).json({
        message : "Food partner logged out successfully"
    })
}


module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    registerFoodPartner,
    loginFoodPartner,
    logoutFoodPartner
}