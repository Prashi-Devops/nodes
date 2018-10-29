var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/pop2',function(error){
if(error){
	console.log(error);
}
else{
	console.log("connected.....wait");
}
});

var personSchema = mongoose.Schema({
   no:{type: Number, required: true, max: 5},
   name: {type: String, required: true, max: 20},
   des: {type: String, required: true, max: 40}
   
});
var Person = mongoose.model("Person", personSchema,"pop3");

module.exports=Person;