const mongoose = require("mongoose");
const { Schema } = mongoose;

const NoteSchema = new Schema({

    systemId: {
        type: String,
        required: true
      } ,
  title: {
    type: String,
    required: true,
  },
  status:{
    type: String,
    required: true,
    default: 'pending'
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
const todoList = mongoose.model("todoList", NoteSchema);
module.exports = todoList;
