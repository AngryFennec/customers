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
    sql = "SELECT * FROM CUSTOMERS";
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

const getRecordById = (id) => {
    sql = `SELECT * FROM CUSTOMERS WHERE cust_id=${id}`;
    return pool.query(sql)
        .then(result => {
            return {
                msg: "success",
                records: result.rows[0]
            }
        })
        .catch(err => {
            return {
                msg: `Error: ${err.message}`
            }
        });
};

const deleteRecordById = (id) => {
    sql = `DELETE FROM CUSTOMERS WHERE cust_id=${id}`;
    return pool.query(sql)
        .then(result => {
            return {
                msg: `Customer id ${id} successfully deleted`,
            }
        })
        .catch(err => {
            return {
                msg: `Error: ${err.message}`
            }
        });
};

const updateRecordById = (customer) => {
    const params = convertCustomerToParams(customer);
    sql = `UPDATE customers SET cust_fname = '${params[1]}', cust_lname = '${params[2]}'`;
    if (params[3] !== null) {
        sql += `,cust_state = '${params[3]}'`;
    }
    if (params[4] !== null) {
        sql += `,cust_curr_sales = '${params[4]}'`;
    }
    if (params[5] !== null) {
        sql += `,cust_prev_sales = '${params[5]}'`;
    }
    sql +=  ` WHERE cust_id = ${params[0]}`;
    console.log(sql);
    return pool.query(sql)
        .then(result => {
            return {
                msg: `Customer id ${params[0]} successfully updated`,
                record: params
            }
        })
        .catch(err => {
            return {
                msg: `Error: ${err.message}`
            }
        });
};

const convertCustomerToParams = (customer) => {
    // Will accept either a product array or product object
    let params;
    if (customer instanceof Array) {
        params = customer;
    } else {
        params = Object.values(customer);
        if (params[4] === "") {
            params[4] = null;
        }
        if (params[5] === "") {
            params[5] = null;
        }
        if (params[3] === "") {
            params[3] = null;
        }
    };
    return params;
}

//[123, 'A', 'asdd', 'JJ', null, null]
// {id: 123, fname: 'AA', ... }
const insertCustomer = (customer) => {
    const params = convertCustomerToParams(customer);

    const sql = `INSERT INTO CUSTOMERS(cust_id, cust_fname, cust_lname, cust_state, cust_curr_sales, cust_prev_sales) 
                 VALUES ($1, $2, $3, $4, $5, $6)`;

    return pool.query(sql, params)
        .then(res => {
            return {
                trans: "success",
                msg: `Customer id ${params[0]} successfully inserted`
            };
        })
        .catch(err => {
            return {
                trans: "fail",
                msg: `Error on insert of customer id ${params[0]}.  ${err.message}`
            };
        });
};

const findCustomers = (customer) => {
    // Will build query based on data provided from the form
    //  Use parameters to avoid sql injection

    // Declare variables
    let i = 1;
    params = [];
    sql = "SELECT * FROM customers WHERE true";

    // Check data provided and build query as necessary
    if (customer.id) {
        params.push(Number(customer.id));
        sql += ` AND cust_id = ${customer.id}`;
        i++;
    };
    if (customer.fname) {
        params.push(`${customer.fname}%`);
        sql += ` AND UPPER(cust_fname) LIKE UPPER($${i})`; // регистронезависимый поиск aA = AA = aa = Aa
        i++;
    };
    if (customer.lname) {
        params.push(`${customer.lname}%`);
        sql += ` AND UPPER(cust_lname) LIKE UPPER($${i})`;
        i++;
    };
    if (customer.state) {
        params.push(`${customer.state}%`);
        sql += ` AND UPPER(cust_state) = UPPER($${i})`;
        i++;
    };

    if (customer.sales) {
        params.push(Number(customer.sales));
        sql += ` AND cust_curr_sales >= $${i}`;
        i++;
    };
    if (customer.prev) {
        params.push(Number(customer.prev));
        sql += ` AND cust_prev_sales >= $${i}`;
        i++;
    };

    sql += ` ORDER BY cust_id`;
    // for debugging
    console.log("sql: " + sql);
    console.log("params: " + params);

    return pool.query(sql, params)
        .then(result => {
            return {
                trans: "success",
                result: result.rows
            }
        })
        .catch(err => {
            return {
                trans: "Error",
                result: `Error: ${err.message}`
            }
        });
};


module.exports.insertCustomer = insertCustomer;
module.exports.findCustomers = findCustomers;
module.exports.getRecordById = getRecordById;
module.exports.deleteRecordById = deleteRecordById;
module.exports.updateRecordById = updateRecordById;
module.exports.getTotalRecords = getTotalRecords;
