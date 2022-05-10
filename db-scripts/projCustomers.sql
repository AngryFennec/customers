-- Drop the table
DROP TABLE CUSTOMERS;

-- Create table
CREATE TABLE CUSTOMERS (
   cust_id    	SERIAL PRIMARY KEY,
   cust_fname  	VARCHAR(20) NOT NULL,
   cust_lname  	VARCHAR(20) NOT NULL,
   cust_state  	VARCHAR(2),
   cust_curr_sales  NUMERIC,
   cust_prev_sales  NUMERIC
);

-- Insert records
INSERT INTO CUSTOMERS (cust_id, cust_fname, cust_lname, cust_state, cust_curr_sales, cust_prev_sales)
VALUES
 ('101', 'A', 'Aa', 'NY', '2000', '3000'),
 ('102', 'B', 'Bb', 'YT', null, null),
 ('103', 'C', 'Cc', 'AL', '1000', null),
 ('104', 'D', 'Dd', 'TX', '1500', '2000'),
 ('105', 'E', 'Ee', null, '1000', '1500');
