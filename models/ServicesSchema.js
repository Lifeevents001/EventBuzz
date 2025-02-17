const mongoose=require('mongoose')

const ServicesSchema = mongoose.Schema({
    image:{type:String},
    text:{type:String},
    wedding_type:{type:String}
});

const ServicesModel=mongoose.model('services',ServicesSchema)

module.exports=ServicesModel