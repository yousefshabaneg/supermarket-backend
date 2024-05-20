# SuperMarket Backend API

This project is a SuperMarket backend API built using Typescript, Node.js, Express.js, and MongoDB with Mongoose. It includes features for managing admins, cashiers, branches, products, categories and receipts, along with JWT-based authentication and authorization.

### **Try the live version [https://supermarket-backend-sxx3.onrender.com](https://supermarket-backend-sxx3.onrender.com/)**

## Table of Contents

- [Project Requirements](#project-requirements)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
  - [Auth Routes](#auth-routes)
  - [Branch Routes](#branch-routes)
  - [Category Routes](#category-routes)
  - [Product Routes](#product-routes)
  - [Receipt Routes](#receipt-routes)
  - [User Routes](#user-routes)
- [Database Schema](#database-schema)
- [Validation and Error Handling](#validation-and-error-handling)
- [Authentication and Authorization](#authentication-and-authorization)
- [Postman Collection](#postman-collection)
- [SQL Replication](#sql-replication)
- [About the Author](#about-the-author)

## Project Requirements

1. **Backend Framework and Database:**

   - Utilize Node.js as the backend framework.
   - Use MongoDB with the Mongoose library for data storage.
   - Set up schemas for collections:
     - Users (Admin-Cashier)
     - Branches
     - Products
     - Receipts
     - Categories

2. **Validation and Error Handling:**

   - Validate user input to ensure required fields are provided and have appropriate formats.
   - Handle errors during database operations and provide meaningful error messages in API responses.

3. **Database Interaction:**

   - Create functions for CRUD operations:
     - Insert, retrieve, update, and delete for branches, cashiers, and products.
     - Functionality for cashiers to create receipts for purchases.

4. **RESTful API Endpoints:**

   - Implement endpoints for CRUD operations using Express.js:
     - Create, retrieve, update, and delete documents.
     - Use appropriate HTTP methods and URL patterns for each endpoint.

5. **Authentication with JWT:**

   - Implement JWT-based authentication to secure endpoints.
   - Allow only authenticated requests to access management functionality.

6. **Protected Routes (Authorization):**
   - Restrict access to authorized users with admin or cashier privileges.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yousefshaban/supermarket-backend.git
   cd supermarket-backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   replace a `.env.example` file in the root directory to `.env` and update values of the environment variables:

   ```
    API_PORT =
    BASE_URL =
    NODE_ENV=
    LOG_PATH=

    #Database
    DATABASE_URI = ""

    DEFAULT_PAGE_NUMBER=1
    DEFAULT_PAGE_SIZE=20

    #JWT
    JWT_SECRET =
    JWT_EXPIRES_IN = 14d
   ```

4. Start the server:
   ```bash
   npm start
   ```

## Usage

Use an API client like Postman to interact with the API. The base URL for all endpoints is `http://localhost:3000`.

## API Endpoints

### Auth Routes

| Method | Endpoint     | Description         | Parameters                          |
| ------ | ------------ | ------------------- | ----------------------------------- |
| POST   | /auth/signup | Register a new user | `name`, `email`, `password`, `role` |
| POST   | /auth/login  | Login a user        | `email`, `password`                 |

### Branch Routes

| Method | Endpoint    | Description           | Parameters                       |
| ------ | ----------- | --------------------- | -------------------------------- |
| GET    | /branch/    | Get all branches      |                                  |
| POST   | /branch/    | Create a new branch   | `name`, `address`, `phone`       |
| GET    | /branch/:id | Get a branch by ID    | `id`                             |
| DELETE | /branch/:id | Delete a branch by ID | `id`                             |
| PATCH  | /branch/:id | Update a branch by ID | `id`, `name`, `address`, `phone` |

### Category Routes

| Method | Endpoint      | Description             | Parameters            |
| ------ | ------------- | ----------------------- | --------------------- |
| GET    | /category/    | Get all categories      |                       |
| POST   | /category/    | Create a new category   | `name`, `image`       |
| GET    | /category/:id | Get a category by ID    | `id`                  |
| DELETE | /category/:id | Delete a category by ID | `id`                  |
| PATCH  | /category/:id | Update a category by ID | `id`, `name`, `image` |

### Product Routes

| Method | Endpoint     | Description            | Parameters                                                             |
| ------ | ------------ | ---------------------- | ---------------------------------------------------------------------- |
| GET    | /product/    | Get all products       |                                                                        |
| POST   | /product/    | Create a new product   | `name`, `description`, `quantity`, `price`, `category`, `images`       |
| GET    | /product/:id | Get a product by ID    | `id`                                                                   |
| DELETE | /product/:id | Delete a product by ID | `id`                                                                   |
| PATCH  | /product/:id | Update a product by ID | `id`, `name`, `description`, `quantity`, `price`, `category`, `images` |

### Receipt Routes

| Method | Endpoint                                | Description                              | Parameters                                                              |
| ------ | --------------------------------------- | ---------------------------------------- | ----------------------------------------------------------------------- |
| GET    | /receipt/                               | Get all receipts                         |                                                                         |
| POST   | /receipt/                               | Create a new receipt                     | `cashierId`, `branchId`, `items`, `customerName`, `customerEmail`       |
| GET    | /receipt/filterReceiptsByDateRange      | Filter receipts by date range            | `startDate`, `endDate`                                                  |
| GET    | /receipt/filterReceiptsByProductDetails | Filter receipts by product details       | `name`, `category`, `price`                                             |
| GET    | /receipt/top3-cashiers                  | Get top 3 cashiers by number of receipts |                                                                         |
| GET    | /receipt/:id                            | Get a receipt by ID                      | `id`                                                                    |
| DELETE | /receipt/:id                            | Delete a receipt by ID                   | `id`                                                                    |
| PATCH  | /receipt/:id                            | Update a receipt by ID                   | `id`, `cashierId`, `branchId`, `items`, `customerName`, `customerEmail` |

### User Routes

| Method | Endpoint          | Description         | Parameters                                         |
| ------ | ----------------- | ------------------- | -------------------------------------------------- |
| GET    | /user/allCashiers | Get all cashiers    |                                                    |
| GET    | /user/allAdmins   | Get all admins      |                                                    |
| GET    | /user/            | Get all users       |                                                    |
| POST   | /user/            | Create a new user   | `name`, `email`, `password`, `role`, `image`       |
| GET    | /user/:id         | Get a user by ID    | `id`                                               |
| DELETE | /user/:id         | Delete a user by ID | `id`                                               |
| PATCH  | /user/:id         | Update a user by ID | `id`, `name`, `email`, `password`, `role`, `image` |

## Database Schema

- **User:**

  - `name`
  - `email`
  - `password`
  - `role` (enum: Admin, Cashier)
  - `branchId` //nullable for admin

- **Branches:**

  - `name`
  - `address`
  - `phone`

- **Products:**

  - `name`
  - `description`
  - `quantity`
  - `price`
  - `categoryId`
  - `imageCover`
  - `images`

- **Receipts:**
  - `cashierId`
  - `branchId`
  - `items` (array of objects with `productId`, `quantity`, `price`)
  - `totalAmount`
  - `date`
  - `customerName`
  - `customerEmail`

## Validation and Error Handling

- **User Input Validation:**

  - Ensure required fields are provided and have appropriate formats.
  - Use validation middlewares to validate request data.

- **Error Handling:**
  - Handle errors during database operations.
  - Provide meaningful error messages in API responses.

## Authentication and Authorization

- **JWT Authentication:**

  - Implement JWT-based authentication to secure endpoints.
  - Allow only authenticated requests to access management functionality.

- **Authorization:**
  - Restrict access to authorized users with admin or cashier privileges.

## Postman Collection

A comprehensive Postman collection is provided to test the API functionality. You can import the collection and test the endpoints.

- you can preview the published collection of this api: [Postman Documentation](https://documenter.getpostman.com/view/15622340/2sA3QmDZti)

## SQL Replication

After completing the project using MongoDB, our next step is to replicate the project's logic using an SQL database. This includes creating table queries, ensuring the addition of constraints and relations for proper functionality.

### SQL Table Creation and Triggers

```sql
CREATE DATABASE SuperMarket;
USE SuperMarket;

CREATE TABLE Category (
    id INT PRIMARY KEY IDENTITY,
    name NVARCHAR(64) NOT NULL UNIQUE CHECK (LEN(name) >= 3),
    createdAt DATETIME DEFAULT GETDATE(),
);

CREATE TABLE Branch (
    id INT PRIMARY KEY IDENTITY,
    name NVARCHAR(64) NOT NULL UNIQUE CHECK (LEN(name) >= 3),
    address NVARCHAR(MAX) NOT NULL,
    phone NVARCHAR(255) UNIQUE,
    createdAt DATETIME DEFAULT GETDATE(),
);

CREATE TABLE Product (
    id INT PRIMARY KEY IDENTITY,
    name NVARCHAR(100) NOT NULL CHECK (LEN(name) >= 3),
    description NVARCHAR(MAX) NOT NULL CHECK (LEN(description) >= 20),
    quantity INT NOT NULL,
    price DECIMAL(18, 2) NOT NULL CHECK (price < 2000000),
    imageCover NVARCHAR(255) DEFAULT 'product-image.jpeg',
    images NVARCHAR(MAX), -- Assuming storing JSON array of strings
    categoryId INT NOT NULL,
    createdAt DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Product_Category FOREIGN KEY (categoryId) REFERENCES Category(id)
);

CREATE TABLE Users (
    id INT PRIMARY KEY IDENTITY,
    name NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) NOT NULL UNIQUE,
    password NVARCHAR(255) NOT NULL CHECK (LEN(password) >= 6),
    role NVARCHAR(50) DEFAULT 'Cashier',
    branchId INT,
    image NVARCHAR(255) DEFAULT 'user-avatar.jpeg',
    createdAt DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Users_Branch FOREIGN KEY (branchId) REFERENCES Branch(id)
);

CREATE TABLE Receipt (
    id INT PRIMARY KEY IDENTITY,
    cashierId INT NOT NULL,
    branchId INT NOT NULL,
    totalAmount DECIMAL(18, 2) DEFAULT 0,
    date DATETIME DEFAULT GETDATE(),
    customerName NVARCHAR(255),
    customerEmail NVARCHAR(255),
    createdAt DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Receipt_Users FOREIGN KEY (cashierId) REFERENCES Users(id),
    CONSTRAINT FK_Receipt_Branch FOREIGN KEY (branchId) REFERENCES Branch(id)
);

CREATE TABLE ReceiptItem (
    id INT PRIMARY KEY IDENTITY,
    receiptId INT NOT NULL,
    productId INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(18, 2) NOT NULL,
    CONSTRAINT FK_ReceiptItem_Receipt FOREIGN KEY (receiptId) REFERENCES Receipt(id),
    CONSTRAINT FK_ReceiptItem_Product FOREIGN KEY (productId) REFERENCES Product(id)
);

-- trigger to make totalAmount dynamic

CREATE TRIGGER trg_Receipt_CalculateTotal
ON ReceiptItem
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @receiptId INT;
    DECLARE @totalAmount DECIMAL(18, 2);

    SELECT @receiptId = i.receiptId
    FROM inserted i;

    SELECT @totalAmount = SUM(i.price * i.quantity)
    FROM ReceiptItem i
    WHERE i.receiptId = @receiptId;

    UPDATE Receipt
    SET totalAmount = @totalAmount
    WHERE id = @receiptId;
END;

```

### SQL query to retrieve all receipt details for each branch

```sql
SELECT
    b.id AS branch_id,
    b.name AS branch_name,
    r.id AS receipt_id,
    r.totalAmount,
    r.date,
    u.name AS cashier_name,
    ri.productId,
    p.name AS product_name,
    ri.quantity,
    ri.price,
    r.customerName,
    r.customerEmail
FROM
    Branch b
JOIN
    Receipt r ON b.id = r.branchId
JOIN
    Users u ON r.cashierId = u.id
JOIN
    ReceiptItem ri ON r.id = ri.receiptId
JOIN
    Product p ON ri.productId = p.id
ORDER BY
    b.id, r.id;
```

## About the Author

- **Name:** Youssef Shaaban Mustafa
- **Email:** yousefshaban.eg@gmail.com
- **Phone**: +201272220764
- **Resume**: [Google Drive](https://bit.ly/3w3DteJ) | [Github](https://github.com/yousefshabaneg/yousefshabaneg/blob/main/YousefShaban_Software_Engineer.pdf)

Youssef Shaaban Mustaaf © | All Rights Reserved
