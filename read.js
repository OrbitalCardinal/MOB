var fs = require('fs');
fs.readFile('token.txt', (err,data) => {
    if(err) throw err;
    console.log(data.toString());
});