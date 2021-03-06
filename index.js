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


app.get("/create", (req, res) => {
    res.render("create", {message: ''});
});

// /delete/slpfsofopsdf, /delete/101, ... но не /delete
app.get("/delete/:id", (req, res) => {
    (async () => {
        const data = await dblib.getRecordById(req.params.id);
        res.render("delete", {message: '', data: data.records});
    })();
});

app.get("/update/:id", (req, res) => {
    (async () => {
        const data = await dblib.getRecordById(req.params.id);
        res.render("update", {message: '', data: data.records});
    })();
});

app.get("/customers", (req, res) => {
    dblib.getTotalRecords().then(result => {
            res.render("customers", {
                model: result.records,
                type: "get",
            });
        }
    );
});

app.post("/customers", async (req, res) => {
    // Omitted validation check
    //  Can get this from the page rather than using another DB call.
    //  Add it as a hidden form value.
    const totRecs = await dblib.getTotalRecords();

    dblib.findCustomers(req.body)
        .then(result => {
            res.render("customers", {
                type: "post",
                model: totRecs.records,
                result: result, // массив результатов поиска
                prod: req.body
            })
        })
        .catch(err => {
            res.render("customers", {
                type: "post",
                model: totRecs.records,
                result: `Unexpected Error: ${err.message}`,
                prod: req.body
            });
        });
});

app.post("/delete/:id", (req, res) => {
    (async () => {
        const data = await dblib.getRecordById(req.params.id);
        const result = await dblib.deleteRecordById(req.params.id);
        res.render("delete",{message: result.msg, data: data.records});
    })();
});


app.post("/update/:id", (req, res) => {
    (async () => {
        const result = await dblib.updateRecordById(req.body);
        const data = await dblib.getRecordById(req.params.id);
        res.render("update",{message: result.msg, data: data.records});
    })();
});


app.post("/create",  (req, res) => {
    (async () => {
        const result = await dblib.insertCustomer(req.body);
        res.render("create",{message: result.msg});
    })();
});




app.get("/export", (req, res) => {
    dblib.getTotalRecords().then(result => {
        res.render("export", {
            model: result.records,
            message: result.msg
        })
    });
});

app.post("/export",  (req, res) => {
    const sql = "SELECT * FROM customer ORDER BY cus_id";
    pool.query(sql, [], (err, result) => {
        let message = "";
        if(err) {
            message = `Error - ${err.message}`;
            res.render("export", { message: message })
        } else {
            let output = "";
            result.rows.forEach(customer => {
                output += `${customer.cus_id},${customer.cus_fname}, ${customer.cus_lname}, ${customer.cus_state}, ${customer.cus_sales_ytd}, ${customer.cus_sales_prev}\r\n`;
            });
            const fileName = req.body && req.body.exFilename ? req.body.exFilename : 'export.txt'; // тернаный оператор
            res.setHeader('Content-disposition', `attachment; filename=${fileName}`);
            res.header("Content-Type", "text/csv");
            res.attachment(fileName);
            res.send(output);
        };
    });
});

app.get("/import", (req, res) => {
    res.render("import");
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
            const result = await dblib.insertCustomer(line.split(",")); // 1,2,3,4 -> [1, 2, 3, 4]
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
       res.send({
               errorMessage,
               numInserted,
               numFailed
           });
    })();
});
