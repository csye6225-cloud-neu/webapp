# Web App

[![Packer CI Pipeline](https://github.com/csye6225-cloud-neu/webapp/actions/workflows/packer.yml/badge.svg)](https://github.com/csye6225-cloud-neu/webapp/actions/workflows/packer.yml)
[![App CI Pipeline](https://github.com/csye6225-cloud-neu/webapp/actions/workflows/app-ci.yml/badge.svg)](https://github.com/csye6225-cloud-neu/webapp/actions/workflows/app-ci.yml)

## Overview
This is a web application built with Node.js, Express, and Sequelize. It includes features such as user authentication, image upload to AWS S3, and verification via AWS SNS.

## 1. Prerequisites

Make sure you have the following prerequisites installed and configured on your local machine:
- Node.js
- npm
- mySQL
- AWS account

## 2. Installation

2.1 Create `.env` file at the root directory `webapp` containing:
```properties
PORT=8080
DB_HOST=localhost
DB_DIALECT=mysql
DB_USERNAME=root
DB_PASSWORD=yourpassword
AWS_ACCESS_KEY_ID=youraccesskeyid
AWS_SECRET_ACCESS_KEY=yoursecretaccesskey
AWS_REGION=us-east-1
S3_BUCKET_NAME=yourbucketname
STATSD_PORT=8125
SNS_TOPIC_ARN=arn:aws:sns:us-east-1:yourtopicarn
```
2.2 Run the command below to install all required Node packages
```sh
npm i
```

## 3. Running the Application
3.1 At the root directory, start the application with
```sh
npm start
```
3.2 The application will be available at `http://localhost:8080`.

## 4. Running Tests
4.1 Run the tests:
```sh
npm test
```

## 5. Deployment
The application is configured to use GitHub Actions for Continuous Integration. The following workflows are set up:
- **Packer**: Validates the Packer template file when pull requests are raised.
- **App CI/CD**: Runs tests and deploys the application when pull requests are merged.