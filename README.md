# ProgramPlanner

A full-stack web application built for Paycom's Summer Engagement Program that assists with planning a multi-session event, like the summer engagement program.

## Getting Started

### Prerequisites

- XAMPP: Apache, MySQL, PHP local server
- Composer: PHP Package Manager
- NPM: NodeJS Package Manager

### Installing

Install XAMPP and run Apache and MySQL. Create a new database in MySQL with three tables: users, events, attendance. Go to /api/config/database.php and alter the following definitions:
```
define('DB_SERVER', 'localhost'); // Default Host
define('DB_USERNAME', 'root'); // Default Username
define('DB_PASSWORD', ''); // Default Password
define('DB_NAME', $YOUR_DATABASE_NAME);
```
Install PHP dependencies with composer on the root level
```
$ php composer.phar update
```
The server should now be working. Navigate to /app and install React dependencies
```
npm install
```
Start the React development server
```
npm run start
```
Navigate to http://localhost:3000 to see the login page.

### Built With

* PHP
* MySQL
* Apache
* React

## Author

* **Andy Wang** - [awangg](https://github.com/awangg)
