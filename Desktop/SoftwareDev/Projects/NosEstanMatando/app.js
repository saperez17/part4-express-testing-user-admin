const bodyParser = require('body-parser');
const express = require("express");
const ejs = require("ejs");
const fs = require('fs');
const mongoose = require('mongoose');
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

const app = express()
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static('public'))

var imgPath1 = './public/assets/sm.png';
// var imgPath1 = '/path/yourimage.png';


// mongoose.connect('mongodb://127.0.0.1:27017/nemDB', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect('mongodb+srv://admin-santiago:admin-santiago@cluster0.neqzd.mongodb.net/testDB', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set("useCreateIndex", true);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

// a.img.data = fs.readFileSync(imgPath);
// a.img.contentType = 'image/png';
const personSchema = new mongoose.Schema({
    name: String,
    city: String,
    age: String,
    description: String,
    ocupation: String,
    img:
    {
        data: Buffer,
        contentType: String
    },
    date: { type: Date, required: true, default: Date.now }
})

const Person = new mongoose.model('Person', personSchema);

// santiago = new Person({
//     name: 'Santiago Murillo',
//     age: '19',
//     city: 'Tolima',
//     description: 'Fue asesinado por el disparo de un arma de fuego durante las protestas en Tolima.',
//     ocupation: 'Estudiante',
//     img: {data: fs.readFileSync(imgPath1), contentType: String },
// })

// santiago.save(function(err, a){
//     if (err) throw err;
//       console.error('saved img to mongo');
// })

let port = process.env.PORT;
if (port==null || port==""){
    port=9000;
}

app.get('/', function(req,res){
    return res.render('home')
})

app.get('/gallery', async function(req,res){
    const persons = await Person.find({}, function(err, result){
        if (err) throw err;
        return result
    })
    return res.render('gallery', {persons: persons})
})

app.get('/register', function(req,res){
    return res.render('register')
})

app.post('/register',upload.single('profilePicture'), function(req,res){
    var img = fs.readFileSync(req.file.path);
    const newPerson = new Person({
        name: req.body.name,
        age: req.body.age,
        city: req.body.city,
        description: req.body.description,
        ocupation: req.body.occupation,
        img: {data: fs.readFileSync(req.file.path), contentType: String },
    });
    newPerson.save(function(err, a){
        if (err) throw err;
        res.redirect('/gallery')
        })
    
})


app.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
})




