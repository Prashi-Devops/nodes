var express=require('express');
var router=express.Router();
var Person=require('../database/dataFile');
var mongoose=require("mongoose")

router.get('/k1',function(req,resp,next){
      
    resp.render('k1');
});

//to display ec1 contents

//to display all contents
router.get('/display',function(req,res){

  Person.find(function(err, response){
      res.render('display',{user:response});
      });
});
//------->POST METHODS------------
router.get('/display_page/:name',function(req,res){
    q=req.params.name;
    console.log("HIhi"+q)
  Person.findOne({"name" : q}, function(err, response){
    console.log(response);
      res.render('k5',{user:response});
      });
     
});

router.get('/delete1/:name',function(req,res){
    q=req.params.name;
    console.log("HIhi"+q)
  Person.findOne({"name" : q}, function(err, response){
    console.log(response);
      res.render('k6',{user:response});
      });
     
});
router.post('/display1',function(req,res){
    q=req.body.u1;
    r=req.body.u2;
    
    var query={"no": req.body.no}
    var newq={ "name":req.body.name,"des":req.body.des }
  Person.updateOne(query, newq,function(err, response){
    console.log(response);
      //res.render('k5',{user:response});
      res.redirect('/api/display')
  });    
});


router.post('/delete',function (req, res) {
      console.log("delete1"+req.body.name)
    Person.remove({'name':req.body.name}, function (err, prod) {
        if (err) {
            res.send(err);
        }
        console.log(prod);
        //res.send({ message: 'Successfully deleted' });
        res.redirect('/api/display')
    });
  });
module.exports=router;
