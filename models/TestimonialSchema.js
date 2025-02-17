const mongoose=require('mongoose')

const TestimonialSchema = mongoose.Schema({
    image:{type:String},
    text:{type:String},
    name:{type:String},
    location:{type:String}
});

const TestimonialModel=mongoose.model('testimonials',TestimonialSchema)

module.exports=TestimonialModel