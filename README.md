# Innovacer Project
## Visitor Management Application
VMS or Visitor Management System is a utility for the receptionists who have to maintain a bulky and a very-hard-to-maintain record book for all the visitors that visit the company for their various reasons.

It has different sub-sections on its FrontPage. Button for adding new visitors. It takes the following details from the visitors:-

1.)Name

2.)Email
 
3.)Mobile No

4.)Check-In Time

<p align="center">
  <img src="https://github.com/lakshaysharma14/Innovacer_Project/blob/master/homepage.png" width="500" title="hover text">
</p>

After the user enters the check-in time the details of the visitor are sent through Email and SMS to the host.

<p align="center">
  <img src="https://github.com/lakshaysharma14/Innovacer_Project/blob/master/add_visitor.png" width="500" title="hover text">
</p>

Once the user wants to check out there is an option of editing the visiting details(EDIT BUTTON) for providing the check out time. Providing check out time, the details of the visit are sent to the visitor on his email and mobile.
<p align="center">
  <img src="https://github.com/lakshaysharma14/Innovacer_Project/blob/master/chkout.png" width="500" title="hover text">
</p>

##### Details of the host are mentioned in the config.json file and that details can be altered according to need of the company.

##### We have used twillo as an API for sending sms to mobile.You can create a trial account and just mention the following details to connect with it :-

1.) Authorization sid and token

2.) Free trial number is given to the user for free of charge that you can use to enter it in the "from" field in config.json file.

3.) Number verified with twillo account is used to enter in "to" field in config.json .

After this we are ready to go and are connected with Twillo API.

Subsequently we have used smtp protocol to send email to the user .

## Installation

Use the node package manager [npm](https://www.npmjs.com/) to first install all modules listed in package.json.

```bash
npm install

```
After this, you have to download MySql for connecting the app to the database.
Details for configuring it are mentioned in the setup.txt file .

<p align="center">
  <img src="https://github.com/lakshaysharma14/Innovacer_Project/blob/master/sql_table.png" width="500" title="hover text">
</p>

Now we are ready to go...

Then to start the web app on a local server just run the following command.
 
```bash
node index
```

Output Files are in the repository as output1 and output2.

## Tools Used
1.) Front End - Html,Css,Bootstrap

2.) Back End  - Node.js

3.) Database - MySql
