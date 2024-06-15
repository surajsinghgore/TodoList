const express=require('express');
const router = express.Router();
const NoteSchema=require("../../model/NoteSchema");
const MongoooseConnection=require('../../middleware/DatabaseConnection')
const requestIp = require('request-ip')

router.use(requestIp.mw())
router.post('/',async(req,res)=>{
    let {title}=await req.body;
    const clientIp = req.clientIp;
 
if(title==undefined){
    return res.status(400).json({message:"Please Enter Notes Title"})
}
if(title.length<=3){
    return res.status(400).json({message:"Notes Must Contain atleast 3 character"})
}
// db connection
await MongoooseConnection();

// dublicate entery prevent
let dublicateCheck=await NoteSchema.findOne({systemId:clientIp,title:title});
if(dublicateCheck){
    return res.status(409).json({message:"This Todo List is already Exists"})

}
const noteSchema=new NoteSchema({
    systemId:clientIp,
    title:title
     });
   await noteSchema.save();
return res.status(200).json({data:[],message:"post"})
})



module.exports=router;