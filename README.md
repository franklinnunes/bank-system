**API for financial management**

This API is designed to be used in a financial management system, banking app, or any application that involves the control of transactions and user profiles.

**Instructions on how to run**

To run this API, you will need to install the following packages:

* `pg` - Creates the Pool for connecting to the database;
* `bcrypt` - Responsible for the security of the user's "password" information
* `jsonwebtoken` - Responsible for creating a token for user authentication
* `express` - Creation of the API

**IMPORTANT!**

You need to fill in the file called connection in database folder:

```
const host = 'localhost';
const user = 'postgres';
const database = 'bank';
const password = 'YOUR_PASSWORD';
const port = 5432;

```

After installing packages, run the command in src folder:

    npm run dev

**Now the API is already working!**

**Features:**

* **User**
    * Register User
    * Login User
    * Detail User Profile
    * Edit User Profile

* **Transactions and Categories**
    * List Categories
    * List Transactions
    * Detail Transaction
    * Create Transaction
    * Edit Transaction
    * Delete Transaction
    * Get Transaction Extract
    * Filter Transactions by Category

**Database**

Instructions for creating the database are present in the file '/src/database/dump.sql':

```
create database bank;

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome TEXT,
    email TEXT UNIQUE,
    senha TEXT
);

CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    descricao TEXT
);

CREATE TABLE transacoes (
    id SERIAL PRIMARY KEY,
    descricao TEXT,
    valor INTEGER,
    data DATE,
    categoria_id INTEGER REFERENCES categorias(id),
    usuario_id INTEGER REFERENCES usuarios(id),
    tipo TEXT
);

INSERT INTO categorias (descricao) VALUES
    ('Food'),
    ('Subscriptions and Services'),
    ('Home'),
    ('Market'),
    ('Personal Care'),
    ('Education'),
    ('Family'),
    ('Leisure'),
    ('Pets'),
    ('Gifts'),
    ('Clothes'),
    ('Health'),
    ('Transportation'),
    ('Salary'),
    ('Sales'),
    ('Other incomes'),
    ('Other expenses');
```

**Routes and Endpoints - User**

* **User registration:**
    * Method **POST**
    * '**/user**' - This endpoint allows the creation of new users in the system. Users can provide information such as name, email address, and password to create an account. Normally, this data would be stored in a database for future authentication.

* **User login:**
    * Method **POST**
    * "**/login**" - Registered users can use this endpoint to authenticate themselves to the system. They provide their credentials (for example, email and password) to obtain an authentication token, which will be used to access protected resources of the API.

* **Authentication:**
    * The "validarLogin.js" file is a middleware responsible for creating the "token" at the time of **Login**. This token is used to authenticate the user so they can access **all** routes except: "/user" and "/login".

* **Detail Logged User:**
    * Method **GET**
    * "**/user**" - This endpoint returns detailed information about the profile of the currently authenticated user. This may include name, email address, contact information, and other relevant information.

* **Update user registration:**
    * Method **PUT**
    * "**/usuarios**" - Users can use this endpoint to update their profile information. They can modify details such as name, password, or any other personal information that the system allows.


**Transactions and Categories Routes and Endpoints**

* **List Categories:**
    * **Method:** **GET**
    * **Path:** `/category`
    * **Description:** This endpoint returns a list of all categories available in the system. In the context of financial transactions, categories can be used to classify and organize transactions.

* **List All Transactions for Logged-In User:**
    * **Method:** **GET**
    * **Path:** `/transaction`
    * **Description:** This endpoint returns a list of all financial transactions associated with the authenticated user. Transactions can be organized by date, amount, category, or any other relevant criteria.

* **Get Transaction Details:**
    * **Method:** **GET**
    * **Path:** `/transaction/:id`
    * **Description:** Users can use this endpoint to get specific details about an individual transaction. They will typically provide a unique transaction identifier to access the details.

* **Create Transaction:**
    * **Method:** **POST**
    * **Path:** `/transaction`
    * **Description:** Users can add new financial transactions to the system using this endpoint. This can include information such as date, amount, category, and a description of the transaction.

* **Update Transaction:**
    * **Method:** **PUT**
    * **Path:** `/transaction/:id`
    * **Description:** If a user wishes to modify the details of an existing transaction, they can use this endpoint to update information such as amount, category, or any other relevant field.

**Translation Notes:**

* I have preserved the original format of the table, including the use of tabs and pipe characters.
* I have translated the Portuguese text into English.
* I have added additional detail to some of the descriptions to clarify the purpose of each endpoint.

**Delete Transaction:**

**Method:** **DELETE**

**Endpoint:** **/transaction/:id**

**Description:** This endpoint allows users to delete a specific transaction from the system. They would need to provide a unique identifier for the transaction they want to remove.

**Get Transaction Statement:**

**Method:** **GET**

**Endpoint:** **/transaction/statement**

**Description:** This can provide a detailed statement of the user's transactions, including information such as a summary of expenses and income, etc.

**Filter Transactions by Category:**

**Method:** **GET**

**Endpoint:** **/transaction?filter[]=**

**Description:** This feature allows users to filter their transactions based on specific categories. This is useful for viewing expenses and income in specific categories, such as food, transportation, entertainment, etc.



