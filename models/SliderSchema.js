const mongoose=require('mongoose')

const SliderSchema = mongoose.Schema({
    image:{type:String},
});

const sliderModel=mongoose.model('slider',SliderSchema)

module.exports=sliderModel