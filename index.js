// Add required packages
const express = require("express");
const multer = require("multer");

require('dotenv').config();
const app = express();

// Set up EJS
app.set("view engine", "ejs");

const upload = multer();



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
    const sql = "SELECT * FROM CUSTOMERS ORDER BY CUST_ID";
    pool.query(sql, [], (err, result) => {
        let message = "";
        let model = {};
        if(err) {
            message = `Error - ${err.message}`;
        } else {
            message = "success";
            model = result.rows;
        };
        res.render("index", {
            message: message,
            model : model
        });
    });
});

app.get("/export", (req, res) => {
    const sql = "SELECT * FROM CUSTOMERS ORDER BY CUST_ID";
    pool.query(sql, [], (err, result) => {
        var message = "";
        var model = {};
        if(err) {
            message = `Error - ${err.message}`;
        } else {
            message = "success";
            model = result.rows;
        };
        res.render("export", {
            model : model,
            message: message
        });
    });
});

app.post("/export", (req, res) => {
    console.log(req.body);
    const sql = "SELECT * FROM CUSTOMERS ORDER BY CUST_ID";
    pool.query(sql, [], (err, result) => {
        let message = "";
        if(err) {
            message = `Error - ${err.message}`;
            res.render("export", { message: message })
        } else {
            let output = "";
            result.rows.forEach(customer => {
                output += `${customer.cust_id},${customer.cust_fname}, ${customer.cust_lname}, ${customer.cust_state}, ${customer.cust_curr_sales}, ${customer.cust_prev_sales}\r\n`;
            });
            res.header("Content-Type", "text/csv");
            res.attachment("export.txt");
            return res.send(output);
        };
    });
});
