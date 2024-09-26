# Web App

Prerequisites and setup steps to build and deploy Express.js application with Sequelize as the ORM and MySQL as the database

## 1. Prerequisites for building and deploying application locally

Make sure you have the following prerequisites installed and configured on your local machine:
- Node.js
- npm
- mySQL

## 2. Build and Deploy instructions for the web application

2.1 Create `.env` file at the root directory `webapp` containing:
```
PORT=8080
DB_NAME=database_name
DB_HOST=localhost
DB_DIALECT=mysql
DB_USERNAME=username
DB_PASSWORD=password
```
2.2 Run the command below to install all required Node packages
```
npm i
```
2.3 At the root directory, start the application with
```
npm start
```