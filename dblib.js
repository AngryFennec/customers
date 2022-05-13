// Add packages
require("dotenv").config();
// Add database package and connection string
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const getTotalRecords = () => {
    sql = "SELECT * FROM book";
    return pool.query(sql)
        .then(result => {
            return {
                msg: "success",
                records: result.rows
            }
        })
        .catch(err => {
            return {
                msg: `Error: ${err.message}`
            }
        });
};

const convertBookToParams = (book) => {
    // Will accept either a product array or product object
    let params;
    if (book instanceof Array) {
        params = book;
    } else {
        params = Object.values(book);
    }
    params.forEach((item, index) => {
          if (index !== 0 && (item === "" || item.toLowerCase() === 'null')) {
                params[index] = null;
            }
        });
        console.log(params);
    };
    return params;
}

const insertBook = (book) => {
    const params = convertBookToParams(book);

    const sql = `INSERT INTO book(book_id,  title, total_pages, rating, isbn, published_date) 
                 VALUES ($1, $2, $3, $4, $5, $6)`;

    return pool.query(sql, params)
        .then(res => {
            return {
                trans: "success",
                msg: `Book id ${params[0]} successfully inserted`
            };
        })
        .catch(err => {
            return {
                trans: "fail",
                msg: `Error on insert of book id ${params[0]}.  ${err.message}`
            };
        });
};

module.exports.insertBook = insertBook;
module.exports.getTotalRecords = getTotalRecords;
