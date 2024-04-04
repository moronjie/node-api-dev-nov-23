const router = express.Router();
const foodModel = require("../models/foodModel")
const verifyToken = require("../middleware/verifyToken")
const {customError} = require("../middleware/errorMiddleware")
const upload = require("../middleware/multer")
const {cloudinary} = require("../config/cloudinary")

// endpoint to fetch all foods 
router.get("/foods", verifyToken, async(req, res, next)=>{

    try 
    {
        let foods = await foodModel.find();
        res.send(foods);
    }
    catch(err)
    {
        console.log(err);
        next(customError(500, err.message))
    }

})


//endpoint to create food 
router.post("/foods", upload.single("imageUrl"), verifyToken, async (req, res, next)=>{
    let foodData = req.body;
    if(!foodData.name || !foodData.calories || !foodData.fat || !foodData.carbs || !foodData.protein){
        return next(customError(400, "Please provide all the required fields"))
    }

    if(req.file==undefined){
        return next(customError(400, "Please provide a valid image"))
    }
    const cloud_img = await cloudinary.uploader.upload(req.file.path);

    try {
        const newFood = new foodModel({...foodData, imageUrl: cloud_img.secure_url, cloudID: cloud_img.public_id});;
        const food = await newFood.save();
        res.status(201).send(food);
    } catch (err) {
        next(customError(500, err.message))
    }
})


// endpoint to search food by name 
router.get("/foods/:name", verifyToken, async (req, res, next)=>{

    try
    {
        let foods = await foodModel.find({name:{$regex:req.params.name,$options:'i'}})
        if(foods.length!==0)
        {
            res.send(foods);
        }
        else 
        {
            res.status(404).send({message:"Food Item Not Fund"})
        }
       
    }
    catch(err)
    {
        console.log(err);
        next(customError(500, err.message))
    }
    

})

module.exports = router;
