const mongoose=require("mongoose");
const url=process.env.MONGODBCONNECTION;

const MongoooseConnection=async()=>{

try {
const res=mongoose.connect(url);
    if(res){
console.log("successfully connected")
}
} catch (error) {
    console.log("not connected")
}



}



module.exports=MongoooseConnection;