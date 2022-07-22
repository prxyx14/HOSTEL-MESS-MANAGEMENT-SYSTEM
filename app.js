const express = require("express") //importing modules that are libraries
const app = express();
const pug = require("pug")
const mongoose = require("mongoose")
const path = require("path")
const { param } = require("express/lib/request");
const fs = require("fs"); // (fs)file manipulation- not used
const Register = require("./db/loginschema"); //we are defining schema for mongodb
const bookings = require("./db/bookSchema");
const logins = require("./db/loginschema");
app.use(express.urlencoded({ extended: false }))
app.use(express.json()) //express is used to make web applications, it is a library
require("./db/connect")
const port = process.env.PORT || 3000;


// no variables and no calculations in html so pug is used 
// when something is repeated all along se pug is used
//EXPRESS REALTED STUFFS
app.use("/static", express.static("static"))
    //it defines sab iske andar h
    // all static files will be at one place at static eg. pics javascript files ect.




//PUG REALTED STUFFS
app.set("view engine", "pug")
    //express's functionality are used using app.---
    //it defines konsa template engine(pug instead of html) use kia hai
app.set("views", path.join(__dirname, "views"))
    //using pug path name ki jagah ye daldenge har jagah.
    //response and response


//ENDPOINTS
//whenever you req. a server ye resoponse m jaega
// get req. jab data server se apne pas(user).
app.get("/" /*'/' takes you to main or root page*/ , (req, res) => {
    res.status(200).render("index"); //first page to visit will be index page or main page
})
app.get("/loginpage", (req, res) => {
    res.status(200).render("loginpage");
})
app.get("/Eloginpage", (req, res) => {
    res.status(200).render("Eloginpage");
})
app.get("/doctor", (req, res) => {
    res.render("doctor");
})
app.get("/signup", (req, res) => {
    res.render("appoints"); //sign up page
})
app.get("/meal2", (req, res) => {
    res.render("meal2");
})
app.get("/meal3", (req, res) => {
    res.render("meal3");
})
app.get("/meal4", (req, res) => {
    res.render("meal4");
})



//POST REQUEST FOR booking for sign up page
//from us to server
app.post("/booking", async(req, res) => {
    try {
        //newbook is an object jo bhi data dalenge vo newbook m aa jaega aur phr use save krdenge in mongodb
        const newBook = new bookings({
            name: req.body.name,
            Sid: req.body.Sid,
            email: req.body.email,
            date: req.body.date,
            course: req.body.course,
            plans: req.body.plans,
            password: req.body.password
        })
        const contact_regitered = await newBook.save(); //save the data
        res.status(201).render("index"); //kya hoga save hone ke bad we will go back to main page
        //render- to send file from server to user(us)
        //acing- time lagega save hone m to hum age ni badhenge jbtk save nhi hoga to we have used await
    } catch (error) {
        console.log(error)
        res.status(400).send(error);
    }
})



//POST REQUEST FOR login FORM IN login PAGE
app.post("/elogin", async(req, res) => {
    try {
        const email = req.body.email; //we will fetch the data from email field into email
        //const is variable we do not have to define the datatype we cannot change cont.
        const password = req.body.password;
        //now we are cheking ki mongodb mein koi data hai kya is email ke liye agr hai to use lekr ao
        const usermail = await logins.findOne({ email: email });
        //usermail has verything and we will check values of mongodb with the details entered by the user
        if (usermail.password == password) {
            //redirect becoz we are using again and again
            res.status(201).redirect("/allBooking");
        } else {
            res.send("invalid login")
        }
    } catch (error) {
        console.log(error)
        res.status(400).send(error);
    }
})

//getting list of all the bookings saves
//get all route
app.get('/allBooking', async(req, res) => {
    try {
        const Book = await bookings.find()
        res.render('list', { x: Book })
    } catch (error) {
        res.status(404).send(error)
    }
})

// to get profile of single student
app.get('/student/:id', async(req, res) => {
    try {
        const learner = await bookings.findById(req.params.id);
        res.render('profile', { x: learner });
    } catch (error) {
        console.log(error);
        res.send(error);
    }
})

// to delete a record from the student list
app.get('/x/student/:id', async(req, res) => {
    try {
        const removed = await bookings.findById(req.params.id)
        await removed.deleteOne();
        res.redirect("/allBooking");
    } catch (error) {
        console.log(error)
        res.send(error);
    }
})

//login for customer
app.post("/clogin", async(req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const usermail = await bookings.findOne({ email: email });
        //    const user= await Booking.find({"email":{email}});

        if (usermail.password == password) {
            res.status(201).render("sprofile", { x: usermail });
        } else {
            res.send("invalid login")
        }
    } catch (error) {
        console.log(error)
        res.status(400).send(error);
    }
})


//START THE SERVER
app.listen(port, () => {
    console.log(`server runnig at ${port}`)
})