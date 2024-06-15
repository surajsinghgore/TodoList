const express=require('express');
const router = express.Router();
const NoteSchema=require("../../model/NoteSchema");
const MongoooseConnection=require('../../middleware/DatabaseConnection')
const requestIp = require('request-ip')
router.use(requestIp.mw())

router.delete('/:id',async(req,res)=>{
    await MongoooseConnection();
    const clientIp = req.clientIp;
    const id = req.params.id;

    const checkWeatherOwnerOrNot=await NoteSchema.findOne({systemId:clientIp,_id:id})

if(checkWeatherOwnerOrNot){
await NoteSchema.findByIdAndDelete(checkWeatherOwnerOrNot._id);
return res.status(200).json({message:`${checkWeatherOwnerOrNot.title} successfully deleted`})

}else{
    return res.status(400).json({message:'ToDo List Not Found To Delete'})

}

 



})






module.exports=router;