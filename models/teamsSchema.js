const mongoose=require('mongoose')

const TeamsSchema = mongoose.Schema({
    image:{type:String},
    name:{type:String},
    post:{type:String},
    text:{type:String},
});

const TeamsModel=mongoose.model('teams',TeamsSchema)

module.exports=TeamsModel