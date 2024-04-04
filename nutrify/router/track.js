const router = express.Router();
const trackingModel = require("../models/trackingModel")
const {customError} = require("../middleware/errorMiddleware")

// endpoint to track a food 

router.post("/track", verifyToken, async (req,res, next)=>{
    
    let trackData = req.body;
   
    try 
    {
        let data = await trackingModel.create(trackData);
        console.log(data)
        res.status(201).send({message:"Food Added"});
    }
    catch(err)
    {
        console.log(err);
        next(customError(500, err.message))
    }
    

})


// endpoint to fetch all foods eaten by a person 

router.get("/track/:userid/:date",async (req,res, next)=>{

    let userid = req.params.userid;
    let date = new Date(req.params.date);
    let strDate = date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();

    try
    {

        let foods = await trackingModel.find({userId:userid,eatenDate:strDate}).populate('userId').populate('foodId')
        res.send(foods);

    }
    catch(err)
    {
        console.log(err);
        next(customError(500, err.message))
    }


})

module.exports = router;
