DROP TABLE IF EXISTS customer;

CREATE TABLE customer (
  cus_id        INTEGER PRIMARY KEY,
  cus_fname     VARCHAR(20) NOT NULL,
  cus_lname     VARCHAR(30) NOT NULL,
  cus_state     CHAR(2),
  cus_sales_ytd  MONEY,
  cus_sales_prev MONEY
);

INSERT INTO customer (cus_id, cus_fname, cus_lname, cus_state, cus_sales_ytd, cus_sales_prev)
VALUES
  (101, 'Alfred', 'Alexander', 'NV', 1500, 900),
  (102, 'Cynthia', 'Chase', 'CA', 900, 1200),
  (103, 'Ernie', 'Ellis', 'CA', 3500, 4000),
  (104, 'Hubert', 'Hughes', 'CA', 4500, 2000),
  (105, 'Kathryn', 'King', 'NV', 850, 500),
  (106, 'Nicholas', 'Niles', 'NV', 500, 400),
  (107, 'Patricia', 'Pullman', 'AZ', 1000, 1100),
  (108, 'Sally', 'Smith', 'NV', 1000, 1100),
  (109, 'Shelly', 'Smith', 'NV', 2500, 0),
  (110, 'Terrance', 'Thomson', 'CA', 5000, 6000),
  (111, 'Valarie', 'Vega', 'AZ', 0, 3000),
  (112, 'Xavier', 'Xerox', 'AZ', 600, 250);
