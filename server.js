var express = require('express')
var app = express();
var path = require("path");
var bodyParser = require("body-parser");
const fs = require("fs");
const alert = require('alert');
const cors = require('cors');


app.use(express.static('static'));
app.use(cors());

var HTTP_PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

function onStart(){
    console.log("Serve listening at" + HTTP_PORT);
}

app.get("/", function(req,res){
    res.sendFile(path.join(__dirname,"/public/home.html"))   
})
function indexFinder(){
    let index = 0;
    const data = fs.readFileSync('./data.txt',
    { encoding: 'utf8', flag: 'r' });
    data.split(/[\r\n]+/).forEach(line=>{
        ++index;
    });
    return index;
}
app.get("/delete",function(req,res){
    res.sendFile(path.join(__dirname,"/public/delete.html"));
})

app.get("/up", function(req,res){
    res.sendFile(path.join(__dirname,"/data.txt"));

})
app.post("/deleteit", (req, res) => {
    let data = req.body;
    var result = Object.keys(data)
    var datastring = result.toString();
    var dataArray = datastring.split(",");
    var nums = dataArray.map(function(str) {
        // using map() to convert array of strings to numbers
        return parseInt(str.replace(/"/g, ''), 10)-1; });
        const removeLines = (data, lines = []) => {
            return data
                .split('\n')
                .filter((val, idx) => lines.indexOf(idx) === -1)
                .join('\n');
        }
    fs.readFile('./data.txt', 'utf8', (err, data) => {
        if (err) throw err;
        let newData = removeLines(data, nums);
        console.log(newData);
        newData = newData.split('\n');
        newData.forEach(function(data, index, arr){
            if(index<9)
            {
            arr[index] = data.replace(/^(.{2}\d*)/gm, `${index + 1} `);
            }
            else
            {
                arr[index] = data.replace(/^(.{2}\d*)/gm, `${index + 1}`);
            }
        });
        newData = newData.join('\n');
        // remove the first line and the 5th and 6th lines in the file
        fs.writeFile('./data.txt',newData, 'utf8', function(err) {
            if (err) throw err;
            console.log("the lines have been removed.");
        });
    })
    
})

app.post("/up",function(req,res){
    
    var item = req.body.ItemName;
    var itname = item.toString();
    fs.appendFileSync(path.join("./data.txt"), `${indexFinder()}  ${itname}\n`);
    alert(`${itname} is added to the list`)
    res.redirect('/');
    
})

app.get("/item", function(req,res){

    res.sendFile(path.join(__dirname,"/public/item.html"));
})

app.listen(HTTP_PORT, onStart);