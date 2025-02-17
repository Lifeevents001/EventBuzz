const mongoose=require('mongoose')

const GallerySchema = mongoose.Schema({
    image:{type:String},
});

const GalleryModel=mongoose.model('galleries',GallerySchema)

module.exports=GalleryModel