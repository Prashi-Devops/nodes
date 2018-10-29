var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/pop1',function(error){
if(error){
	console.log(error);
}
else{
	console.log("connected.....wait");
}
});

var personSchema = mongoose.Schema({
   name: String,
   id: Number,
   age: Number,
   loc: String
});
var Person = mongoose.model("Person", personSchema,"pop1");

module.exports=Person;