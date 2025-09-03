const mongoose=require('mongoose')


const postSchema = new mongoose.Schema({
  title: {type:String,require},
  author: {type:String,require},
  post: {type:String,require},
  path:{type:String,require},
  date: { type: Date, default: Date.now }
});

const Post =mongoose.model('Post',postSchema);

module.exports=Post