const express=require('express');
const router = express.Router();
 

// require all mvc
const getNotesRouter=require('./notes/get')
const postNotes=require('./notes/post')
const deleteNotesRouter=require('./notes/delete')
const patchNotesRouter=require('./notes/patch')

// get all notes
router.use('/',getNotesRouter)

// post all notes
router.use('/post',postNotes)

// delete all notes
router.use('/delete',deleteNotesRouter)
// patch all notes
router.use('/patch',patchNotesRouter)

module.exports=router;