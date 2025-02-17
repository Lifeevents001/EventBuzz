require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const GalleryModel = require('./models/GallerySchema');
const ServicesModel = require('./models/ServicesSchema');
const SliderModel = require('./models/SliderSchema');
const TeamsModel = require('./models/teamsSchema');
const TestimonialModel = require('./models/TestimonialSchema');
const UserModel = require('./models/User');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./config/cloudinary');
const axios = require('axios'); 

const app = express();
const PORT = 3000;


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
      folder: 'Untitled', 
      allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage: storage });




// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Routes
app.get('/', async (req, res) => {
    const galleries = await GalleryModel.find();
    const services = await ServicesModel.find();
    const sliders = await SliderModel.find();
    const teams = await TeamsModel.find();
    const testimonials = await TestimonialModel.find();
    const users = await UserModel.find();
    res.render('index', { galleries, services, sliders, teams, testimonials, users });
});

// Add Data
app.post('/add', async (req, res) => {
    const { type, data } = req.body;
    let Model;
    switch (type) {
        case 'gallery': Model = GalleryModel; break;
        case 'services': Model = ServicesModel; break;
        case 'slider': Model = SliderModel; break;
        case 'teams': Model = TeamsModel; break;
        case 'testimonials': Model = TestimonialModel; break;
        default: return res.status(400).send('Invalid type');
    }
    try {
        const newItem = new Model(data);
        await newItem.save();
        res.redirect('/');
    } catch (err) {
        res.status(500).send(err);
    }
});

// Delete Data

app.post('/upload-gallery', upload.single('image'), async (req, res) => {
  try {
    if (req.file) {
      console.log('File uploaded:', req.file);  // Check the full file object
      const imageUrl= req.file.path;
      const newGalleryItem = new GalleryModel({
        image:imageUrl,
      });
      
      await newGalleryItem.save();
      res.redirect('/'); 
    } else {
      res.status(400).send('No file uploaded');
    }
  } catch (err) {
    console.log('Error uploading file:', err);
    res.status(500).send('Error uploading the image');
  }
});



app.post('/delete-gallery', async (req, res) => {
  const { imageId } = req.body;
  try {
    const galleryItem = await GalleryModel.findById(imageId);
    if (galleryItem) {
      await GalleryModel.findByIdAndDelete(imageId);
      res.redirect('/'); 
    } else {
      res.status(404).send('Image not found');
    }
  } catch (err) {
    console.log(err);
    res.status(500).send('Error deleting the image');
  }
});

app.post('/upload-slide', upload.single('image'), async (req, res) => {
  try {
    if (req.file) {
      console.log('File uploaded:', req.file);
      const imageUrl= req.file.path;
      const newSlideItem = new SliderModel({
        image:imageUrl,
      });
      
      await newSlideItem.save();
      res.redirect('/'); 
    } else {
      res.status(400).send('No file uploaded');
    }
  } catch (err) {
    console.log('Error uploading file:', err);
    res.status(500).send('Error uploading the image');
  }
});



app.post('/delete-slide', async (req, res) => {
  const { imageId } = req.body;
  try {
    const slideItem = await SliderModel.findById(imageId);
    if (slideItem) {
      await SliderModel.findByIdAndDelete(imageId);
      res.redirect('/'); 
    } else {
      res.status(404).send('Image not found');
    }
  } catch (err) {
    console.log(err);
    res.status(500).send('Error deleting the image');
  }
});

app.post('/upload-service', upload.single('image'), async (req, res) => {
  try {
    if (req.file) {
      console.log('File uploaded:', req.file);
      const imageUrl= req.file.path;
      const newServiceItem = new ServicesModel({
        image:imageUrl,
      });
      
      await newServiceItem.save();
      res.redirect('/'); 
    } else {
      res.status(400).send('No file uploaded');
    }
  } catch (err) {
    console.log('Error uploading file:', err);
    res.status(500).send('Error uploading the image');
  }
});



app.post('/delete-service', async (req, res) => {
  const { imageId } = req.body;
  try {
    const serviceItem = await ServicesModel.findById(imageId);
    if (serviceItem) {
      await ServicesModel.findByIdAndDelete(imageId);
      res.redirect('/'); 
    } else {
      res.status(404).send('Image not found');
    }
  } catch (err) {
    console.log(err);
    res.status(500).send('Error deleting the image');
  }
});

// Add Team
app.post('/add-team', upload.single('image'), async (req, res) => {
  try {
    if (req.file) {
      const newTeam = new TeamsModel({
        image: req.file.path,
        name: req.body.name,
        post: req.body.post,
        text: req.body.text
      });
      await newTeam.save();
      res.redirect('/');
    } else {
      res.status(400).send('No file uploaded');
    }
  } catch (err) {
    console.log(err);
    res.status(500).send('Error adding the team member');
  }
});

// Delete Team
app.post('/delete-team', async (req, res) => {
  const { teamId } = req.body;
  try {
    await TeamsModel.findByIdAndDelete(teamId);
    res.redirect('/');
  } catch (err) {
    console.log(err);
    res.status(500).send('Error deleting the team member');
  }
});


app.post('/add-testimonial', upload.single('image'), async (req, res) => {
  try {
    if (req.file) {
      const newTestimonial = new TestimonialModel({
        image: req.file.path,
        name: req.body.name,
        location: req.body.location,
        text: req.body.text
      });
      await newTestimonial.save();
      res.redirect('/');
    } else {
      res.status(400).send('No file uploaded');
    }
  } catch (err) {
    console.log(err);
    res.status(500).send('Error adding the testimonial');
  }
});


app.post('/delete-testimonial', async (req, res) => {
  const { testimonialId } = req.body;
  try {
    await TestimonialModel.findByIdAndDelete(testimonialId);
    res.redirect('/');
  } catch (err) {
    console.log(err);
    res.status(500).send('Error deleting the testimonial');
  }
});


const url = `https://eventbuzz.onrender.com/`;
const interval = 30000;

function reloadWebsite() {
    axios
        .get(url)
        .then((response) => {
            console.log("Website reloaded successfully:", response.status);
        })
        .catch((error) => {
            console.error(`Error: ${error.message}`);
        });
}

setInterval(reloadWebsite, interval);


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  
});
