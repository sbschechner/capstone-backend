var express = require('express');
var app = express();

app.use(express.static('public'));
app.listen(process.env.PORT || 8080);
console.log("up and running");

if (require.main === module){
	runServer().catch(error => console.log(error));
};

module.exports = {app};