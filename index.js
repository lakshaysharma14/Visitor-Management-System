const config = require("./config.json");
const path = require("path");
const express = require("express");

//====================================================================================================
var nodemailer = require("nodemailer");
//================================Create Connection======================================
const hbs = require("hbs"); //use hbs view engine
const bodyParser = require("body-parser");//use bodyParser middleware
const mysql = require("mysql"); //use mysql database

const app = express();
var nodemailer = require("nodemailer");

const PORT = process.env.PORT || 8000;

//____________________________ Establishing and Setting All Connections____________________

// Create Connection ( All these details are stored in a separate config.js file)

const conn = mysql.createConnection({
  host: config.database.host_name,
  user: config.database.username,
  password: config.database.password,
  database: config.database.database_name,
  port:config.database.port,
  socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
});

//===================================== Setting Up Twillo ==================================
// Setting Credentials for Twillo API 
const accountSid = config.twilio.accountSid;
const authToken = config.twilio.authToken;
const client = require("twilio")(accountSid, authToken);

//============================================ Nodemailer ==================================

// Setting Nodemailer Transporter
var transporter = nodemailer.createTransport({
  host: config.email_setting.host,
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: config.email_setting.email,
    pass: config.email_setting.password,
  },
});

//======================================connect to database =====================================

//Connecting to Mysql Database
conn.connect((err) => {
  if (err) throw err;
  console.log("Mysql Connected...");
});

// Setting Configuration for Using Handlebars(hbs)
app.set("views", path.join(__dirname, "views"));//set views file
app.set("view engine", "hbs");//set view engine

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//=========================================Route for Homepage =========================================
app.use("/assets", express.static(__dirname + "/public"));//set folder public as static folder for static file

//______________________________Different Routes ___________________________________________

//***Homepage***

app.get("/", (req, res) => {
  let sql = "SELECT * FROM visitors";
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.render("visitor_view", {
      results: results,
    });
  });
});

//==========================================Route for Insert data =======================================

//***Inserting User Details in Database***

app.post("/save", (req, res) => {
  
  let data =
  {
    name: req.body.name,
    email_id: req.body.email_id,
    checkin: req.body.checkin,
    mobile_no: req.body.mobile_no,
  };
  
  let sql = "INSERT INTO visitors SET ?";
  let query = conn.query(sql,data,(err, results) =>{
      if (err) throw err;
      
      let sql1 = "SELECT * FROM visitors WHERE id=" + results.insertId;
      let query1 = conn.query(sql1, (err, result) => {
        if (err) throw err;
        console.log(result);
        let htmlBody = "New visitor information : \n";
        htmlBody += "Name : " + result[0].name + " \n " + "\n" + 
        " Email : " +  result[0].email_id + " \n " + "\n" +
        "Mobile Number : " + result[0].mobile_no + " \n " + "\n" +
        " Check In Date Time :" + result[0].checkin;
      
        var mailOptions = 
        {
          from: config.host.email,
          to: config.host.email,
          subject: "New visitor has joined.",
          html: htmlBody,
        };
        transporter.sendMail(mailOptions, function (error, info)
        {
          if (error)
          { console.log(error); } 
          else 
          {
              let MobileBody = "New visitor information : ";
              MobileBody += "Name : " + data.name + " " +
              " Email : " + data.email_id + " " +
              "Mobile Number : " + data.mobile_no + " " +
              " Check In Date Time :" + data.checkin;
              
              client.messages.create({
                  body: MobileBody,
                  from: config.twilio.from_number,
                  to: config.twilio.to_number,
              },
              function (error, info){
                  if (error) 
                  { console.log(error); } 
                  else 
                  { console.log("Message sent: " + info); }
              }
            );
            //.then(message => console.log(message.sid));
            console.log("Email sent: " + info.response);
         }
      });
    });

    res.redirect("/");
  });
});

//==================================== Route for Update Data ===============================================

//***Updating Checkout Time***

app.post("/update", (req, res) => {
  //console.log(req.body.checkout);
  let sql = "UPDATE visitors SET checkout='" + req.body.checkout + "' WHERE id=" + req.body.id;
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;

    let sql1 = "SELECT * FROM visitors WHERE id=" + req.body.id;
    let query = conn.query(sql1, (err, result) => {
      if (err) throw err;

      let data = result[0];
      //================================= Sending Mail To Visitor =======================================
      let htmlBody = `Vistor Information 
      <br> Name : ${data.name}  
      <br> Email : ${data.email_id} 
      <br> Mobile Number : ${data.mobile_no}
      <br> Check In Date Time : ${data.checkin} 
      <br> Checked Out Datetime : ${data.checkout} 
      <br> Host Name : ${config.host.name} 
      <br> Host Address : ${config.host.address};
    `;
      var mailOptions = {
        from: config.email_setting.email,
        to: data.email_id,
        subject: "Visited Information.",
        html: htmlBody,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) 
        { console.log(error); } 
        else 
        { console.log("Email sent: " + info.response);}
      });
    });
    res.redirect("/");
  });
});


//*** Deleting any User Record***

app.post("/delete", (req, res) => {
  let sql = "DELETE FROM visitors WHERE id=" + req.body.product_id + "";
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.redirect("/");
  });
});
//__________________________________________________________________________________________________________________

//server listening
app.listen(PORT, () => {
  console.log("Server is running at port 8000");
});
