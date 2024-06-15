const express=require('express');
const router = express.Router();
const NoteSchema=require("../../model/NoteSchema");
const MongoooseConnection=require('../../middleware/DatabaseConnection')
const requestIp = require('request-ip')
router.use(requestIp.mw())

router.get('/',async(req,res)=>{
    const clientIp = req.clientIp;

// with particular id
await MongoooseConnection();

if(req.query.id!==undefined){
    return res.status(200).json({data:[],message:req.query.id})

}
// without id , means all  
else{

    const data=await NoteSchema.find({systemId:clientIp}).sort('-date')
    return res.status(200).json(data)

}


})



// parameter endpoint
router.get('/:id',(req,res)=>{
    return res.status(200).json({data:[],message:"get Id"})
    })
    

module.exports=router;