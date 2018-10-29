var express=require("express");
var router=express.Router();
var Person=require('../database/dataFile')
router.get('/index',function(req,resp,next){
     
    resp.render('k1');
});


router.post('/k1', function(req, res){
  var personInfo = req.body; //Get the parsed information
  console.log(req.body);
   
   if(!personInfo.no|| !personInfo.name|| !personInfo.des)  {
      res.render('k2', {
         message: "Sorry, you provided worng info", type: "error"});
    } else {
      var newPerson = new Person({
         no: personInfo.no,
         name: personInfo.name,
         des: personInfo.des
        });
        
      newPerson.save(function(err, Person){
         if(err)
            res.render('k2', {message: "Database error", type: "error"});
         else
            res.render('k2', {message: "New person added", type: "success", person: personInfo});
      });
   }
   
});

module.exports=router;