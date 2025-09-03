const mongoose=require('mongoose')
const schema = mongoose.Schema

const userSchema = new schema({
    email:{type:String,require},    
    username:{type:String,require},
    password:{type:String,require}
})
const User=mongoose.model('User',userSchema);


module.exports=User