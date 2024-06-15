const express=require('express');
const router = express.Router();
const NoteSchema=require("../../model/NoteSchema");
const MongoooseConnection=require('../../middleware/DatabaseConnection')
const requestIp = require('request-ip')

router.use(requestIp.mw())
// title update
router.patch('/',async(req,res)=>{
   
    let {title,id}=await req.body;
    const clientIp = req.clientIp;
if(title==undefined){
    return res.status(400).json({message:"Please Enter Notes Title"})
}
if(id==undefined){
    return res.status(400).json({message:"Please Provide Id To Update Note"})
}
if(title.length<=3){
    return res.status(400).json({message:"Notes Must Contain atleast 3 character"})
}

// db connection
await MongoooseConnection();

// dublicate entery prevent
let checkWeatherNoteExistOrNot=await NoteSchema.findOne({systemId:clientIp,_id:id});
if(checkWeatherNoteExistOrNot==null){
    return res.status(400).json({message:"This Todo List is Not Exists"})

}
// check weather updated data or not
if(checkWeatherNoteExistOrNot.title==title){
    
    return res.status(400).json({message:"Please Update This Record"})

}
let dublicateCheck=await NoteSchema.findOne({systemId:clientIp,title:title});
if(dublicateCheck){
    return res.status(409).json({message:"This Todo List is already Exists"})

}
await NoteSchema.findByIdAndUpdate(id,{$set:{"title":title}});
return res.status(200).json({message:"success"})
})

// update status of notes
router.patch('/status',async(req,res)=>{

    let {status,id}=await req.body;
    console.log(status,id)
    const clientIp = req.clientIp;
if(status==undefined){
    return res.status(400).json({message:"Please Enter Notes status"})
}
if(id==undefined){
    return res.status(400).json({message:"Please Provide Id To Update Note"})
}
if(status.length<=3){
    return res.status(400).json({message:"Notes Must Contain atleast 3 character"})
}

// db connection
await MongoooseConnection();

// duplicate entry prevent
let checkWeatherNoteExistOrNot=await NoteSchema.findOne({systemId:clientIp,_id:id});
if(checkWeatherNoteExistOrNot==null){
    return res.status(400).json({message:"This Todo List is Not Exists"})

}


await NoteSchema.findByIdAndUpdate(id,{$set:{"status":status}});
return res.status(200).json({message:"success"})
})

module.exports=router;