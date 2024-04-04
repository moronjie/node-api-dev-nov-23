const router = express.Router();
const foodModel = require("../models/foodModel")
const verifyToken = require("../middleware/verifyToken")
const {customError} = require("../middleware/errorMiddleware")


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
router.post("/foods", verifyToken, async (req, res, next)=>{
    let foodData = req.body;

    try {
        const newFood = new foodModel(foodData);
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
