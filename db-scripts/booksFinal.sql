DROP TABLE IF EXISTS book;

CREATE TABLE book (
	book_id	VARCHAR(10) PRIMARY KEY,
	title	VARCHAR(255),
	total_pages	INTEGER,
	rating	NUMERIC,
	isbn	VARCHAR(20),
	published_date	DATE
);

INSERT INTO book (book_id, title, total_pages, rating, isbn, published_date) VALUES 
 ('1001','Lean Software Development: An Agile Toolkit',240,4.17,'9780320000000','2003-05-18'),
 ('1002','Facing the Intelligence Explosion',91,3.87,NULL,'2013-02-01'),
 ('1003','Scala in Action',419,3.74,'9781940000000','2013-04-10'),
 ('1004','Patterns of Software: Tales from the Software Community',256,3.84,'9780200000000','1996-08-15'),
 ('1005','Anatomy Of LISP',446,4.43,'9780070000000','1978-01-01'),
 ('1006','Computing machinery and intelligence',24,4.17,NULL,'2009-03-22'),
 ('1007','XML: Visual QuickStart Guide',269,3.66,'9780320000000','2009-01-01'),
 ('1008','SQL Cookbook',595,3.95,'9780600000000','2005-12-01'),
 ('1009','The Apollo Guidance Computer: Architecture And Operation (Springer Praxis Books / Space Exploration)',439,4.29,'9781440000000','2010-07-01'),
 ('1010','Minds and Computers: An Introduction to the Philosophy of Artificial Intelligence',222,3.54,'9780750000000','2007-02-13'),
 ('1011','The Architecture of Symbolic Computers',739,4.5,'9780070000000','1990-11-01'),
 ('1012','Exceptional Ruby: Master the Art of Handling Failure in Ruby',102,4,NULL,NULL),
 ('1013','Nmap Network Scanning: The Official Nmap Project Guide to Network Discovery and Security Scanning',468,4.32,'9780980000000','2009-01-01'),
 ('1014','The It Handbook for Business: Managing Information Technology Support Costs',180,4.4,'9781450000000','2010-09-17'),
 ('1015','Accidental Empires',384,4,'9780890000000','1996-09-13');
