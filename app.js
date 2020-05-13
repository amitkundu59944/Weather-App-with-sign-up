

const express = require("express");
const app= express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended : true}));
const request = require("request");
app.use(express.static("public"));
const https = require("https");





app.get("/", function(req ,res){

res.sendFile(__dirname  +"/signup.html");
})

app.post("/signup.html", function(req,res){
  const fName = req.body.firstName;
  const lName  = req.body.lastName;
  const email = req.body.emailID;



const data = {
  members: [
    {
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME : fName,
        LNAME : lName
      }
    }
  ]
};

const jsonData = JSON.stringify(data);


const url = "https://us8.api.mailchimp.com/3.0/lists/f598ed9fca";
const options = {
  method :"post",
  auth:"amit:9a2705fff06c4f3dff12a5f765d677e6-us8"
}
const request = https.request(url, options, function(response){
  console.log(response.statusCode);
  if(response.statusCode === 200){
      res.sendFile(__dirname +"/success.html");

  }
  else{
    res.sendFile(__dirname +"/failure.html");
  }
  response.on("data",function(data){
    console.log(JSON.parse(data));
  })


})


request.write(jsonData);
request.end();


  console.log(fName);
  console.log(lName);
  console.log(email);

})

app.post("/failure",function(req,res){
  res.redirect("/")
})

app.post("/success.html", function(req,res){


  const city = req.body.cityName;
  const apiKey = "504ae79ada38da4ad1e03992e046e3e3"
  const unit = req.body.unitType;

    const url = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid="+apiKey+"&units="+unit;
    https.get(url,function(response){
      console.log(response.statusCode);

      response.on("data",function(data){
        const weatherData = JSON.parse(data);
        console.log(weatherData);

        const temp =weatherData.main.temp;
        const description = weatherData.weather[0].description;
        console.log("Present temparature is "+temp);
        console.log(description);
        const icon = weatherData.weather[0].icon;
        const imageUrl = "http://openweathermap.org/img/wn/"+icon+"@2x.png";

        res.write("<p>The present weather of "+city+" is "+ description + "</p>");
        res.write("<h1>Present temparature is "+temp +"degree celcius.</h1>" );
        res.write("<img src="+imageUrl+">");
        res.send();

      })
    })


})




app.listen(process.env.PORT || 3000,function(){
  console.log("server started at port 3000");
})

// app.listen(3000,function(){
//   console.log("server started at port 3000");
// })


// mailchimp api apiKey
//
// 9a2705fff06c4f3dff12a5f765d677e6-us8
// audience apiKey
// f598ed9fca
