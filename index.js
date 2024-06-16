const expess = require("express");
const app = expess();
const path=require('path')
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const PORT = process.env.PORT || 3000;
const corsOptions = {
  origin: "https://todolist.surajsingh.online", // Allow only this origin
  optionsSuccessStatus: 200, // For legacy browser support
};
const buildPath = path.join(__dirname, 'client/dist')
require("dotenv").config();
app.use(bodyParser.json());
// Use CORS middleware with the specified options
app.use(cors(corsOptions));


app.use(expess.static(buildPath))
// requiring notes file path
const notesRouter = require("./routes/notesRouter");

// handling home page request
app.get('/', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'))
  })
  

// handle /notes request
app.use("/notes", notesRouter);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
