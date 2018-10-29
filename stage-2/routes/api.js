var express=require('express');
var router=express.Router();
var Person=require('../database/dataFile');



//to display ec1 contents
router.get('/ec1',function(req,res){
    Person.find({loc:"ec1"},function(err, response){
    res.render('ec1',{user:response});
   });
});
//to display surya contents
router.get('/surya',function(req,res){
      Person.find({loc:"suryawave"},function(err, response){
      res.render('surya',{user:response});
   });
});
//to display all contents
router.get('/display',function(req,res){

  Person.find(function(err, response){
      res.render('display',{user:response});
      });
});
//to display surya contents
router.get('/mcbp',function(req,res){
      Person.find({loc:"mcbp"},function(err, response){
      res.render('mcbp',{user:response});
   });
});

//to display sarjapur contents
router.get('/sarjapur',function(req,res){
      Person.find({loc:"sarjapur"},function(err, response){
      res.render('sarjapur',{user:response});
   });
});

router.get('/k1',function(req,resp,next){
   resp.render('k1');
});

//-------------->POST METHODS------------

module.exports=router;