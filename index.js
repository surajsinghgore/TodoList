const expess=require('express');
const app=expess();
const cors = require('cors') 
const bodyParser = require('body-parser');
const dotenv=require("dotenv");
const corsOptions = {
    origin: 'http://localhost:5173', // Allow only this origin
    optionsSuccessStatus: 200 // For legacy browser support
  };

  require('dotenv').config()
  app.use(bodyParser.json())
  // Use CORS middleware with the specified options
  app.use(cors(corsOptions));
// requiring notes file path
const notesRouter=require('./routes/notesRouter')

// handling home page request 
app.get('/',(req,res)=>{
    
    return res.status(200).json({message:"dummy routes"})
})


// handle /notes request
app.use('/notes',notesRouter)



app.listen(5000,()=>{
    console.log('server is running on port 5000')
})