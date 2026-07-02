const foodModel = require('../models/food.model')
const storageServices = require('../services/storage.service')
const {v4:uuid} = require('uuid')

async function createFood(req, res) {
    if (!req.file) {
        return res.status(400).json({ error: 'Video file is required' });
    }

    const fileName = req.file.originalname || `${uuid()}`;
    const fileUploadResult = await storageServices.uploadFile(req.file.buffer, fileName, req.file.mimetype);
    
    const foodItem = await foodModel.create({
        name : req.body.name,
        description : req.body.description,
        video : fileUploadResult.url,
        foodPartner : req.foodPartner._id

    })

    res.status(201).json({
         message: 'food created successfully',
        food  : foodItem
     });
}

async function getFoodItem(req,res){
    const foodItems = await foodModel.find({});

    res.status(200).json({
        message :"Food item fetched successfully",
        foodItems
    })
}

module.exports = {
    createFood,
    getFoodItem
}