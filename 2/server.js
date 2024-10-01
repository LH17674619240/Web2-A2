const express=require("express");
const bodyParser=require("body-parser");
const path=require("path");
const app=express();
const cors = require('cors');
app.use(cors());


//to parse URL-encoded & JSON data 
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//to serve static files
app.use(express.static(__dirname));

//route to serve index.html
app.get("/Home",(req,res)=>{
  res.sendFile(path.join(__dirname,"Home.html"));
});

app.get("/Search",(req,res)=>{
    res.sendFile(path.join(__dirname,"Search.html"));
  });

app.get("/Fundraiser",(req,res)=>{
    res.sendFile(path.join(__dirname,"Fundraiser.html"));
  });

//we will add more routes here

app.listen(8080,()=>{
  console.log("Running in 8080");
});