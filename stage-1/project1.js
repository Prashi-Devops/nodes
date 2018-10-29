var express=require("express");
var bodyParser=require("body-parser");
var multer=require("multer");
var app=express();
var upload=multer();
var mongoose = require('mongoose');
var path=require('path');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


//app.use(express.bodyParser());
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/pop1');
var personSchema = mongoose.Schema({
   name: String,
   id: Number,
   age: Number,
   loc: String
});
var Person = mongoose.model("Person", personSchema);

app.get('/k1', function(req, res){
   res.render('k1');
});
app.post('/k1', function(req, res){
  var personInfo = req.body; //Get the parsed information
  console.log(req.body);
   
   if(!personInfo.name|| !personInfo.id|| !personInfo.age|| !personInfo.loc)  {
      res.render('k2', {
         message: "Sorry, you provided worng info", type: "error"});
   	} else {
      var newPerson = new Person({
         name: personInfo.name,
         id: personInfo.id,
         age: personInfo.age,
         loc: personInfo.loc
    	  });
		    
      newPerson.save(function(err, Person){
         if(err)
            res.render('k2', {message: "Database error", type: "error"});
         else
            res.render('k2', {message: "New person added", type: "success", person: personInfo});
      });
   }
});

app.get('/ec1',function(req,res){
   
  Person.find({loc:"ec1"},function(err, response){
    //res.json(response);
     res.render('ec1',{user:response});
   });
});
app.get('/surya',function(req,res){

  Person.find({loc:"suryawave"},function(err, response){
      res.render('surya',{user:response});
   });
});
app.get('/display',function(req,res){

  Person.find(function(err, response){
      res.render('display',{user:response});
   });
});
app.listen(8000);
