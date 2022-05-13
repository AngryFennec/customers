// Add required packages
const express = require("express");
const multer = require("multer");
const dblib = require("./dblib.js");


require('dotenv').config();
const app = express();

// Set up EJS
app.set("view engine", "ejs");

const upload = multer();


app.use(express.urlencoded({ extended: false }));


// Add database package and connection string (can remove ssl)
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});


// Start listener
app.listen(process.env.PORT || 3000, () => {
    console.log("Server started (http://localhost:3000/) !");
});

// Setup routes
app.get("/", (req, res) => {
    res.render("index");
});

app.get("/sum", (req, res) => {
    dblib.getTotalRecords().then(result => {
        res.render("sum", {
            errorMessage: '',
            message: ''
        })
    });
});

app.post("/sum",  (req, res) => {
    const start = req.body.start;
    const end = req.body.end;
    const inc = req.body.inc;
    if (start >= end) {

        res.render("sum", {
            errorMessage: 'Starting number must be less than ending number',
            message: ''
        });
        return;
    } else {

    }
});

app.get("/import", (req, res) => {
    dblib.getTotalRecords().then(result => {
        console.log(result);
        res.render("import", {
            model: result.records,
            message: result.msg
        })
    });
});

app.post("/import",  upload.single('filename'), (req, res) => {
    if(!req.file || Object.keys(req.file).length === 0) {
        message = "Error: Import file not uploaded";
        return res.send(message);
    };
    //Read file line by line, inserting records
    const buffer = req.file.buffer;
    const lines = buffer.toString().split(/\r?\n/);

    let numInserted = 0; // кол-во добавленных записей
    let numFailed = 0; // кол-во ошибок
    let errorMessage = ''; // текст ошибок

    (async () => {
        for (line of lines) {
            const result = await dblib.insertBook(line.split(",")); // 1,2,3,4 -> [1, 2, 3, 4]
            if (result.trans === "success") {
                numInserted++;
            } else {
                numFailed++;
                errorMessage += `${result.msg} \r\n`;
            };
        };
        console.log(`Records processed: ${numInserted + numFailed}`);
        console.log(`Records successfully inserted: ${numInserted}`);
        console.log(`Records with insertion errors: ${numFailed}`);
        if(numFailed > 0) {
            console.log("Error Details:");
            console.log(errorMessage);
        };
        const total = await dblib.getTotalRecords();
       res.send({
           model: total.records,
           message: '',
           errorMessage,
           numInserted,
           numFailed,
           });
    })();
});
