## Users
    * Index [token required] 'users/' [GET]
    * Show [token required] 'users/:id' [GET]`
    *  Create '/users' [POST]`
    *  [ADDED] update [token required]: 'users/:id [PATCH]
    *  [ADDED] Delete [token required]: 'users/:id [DELETE]

## Orders
    *  [ADDED] index: '/orders [GET]
    *  [ADDED] show: '/orders/:id [GET]
    *  [ADDED] create [token required]: '/orders [POST]
    *  [ADDED] update [token required]: '/orders/:id [PATCH]
    *  [ADDED] Delete [token required]: '/orders/:id [DELETE]

## Products
    *  Index [token required] '/products' [GET]
    *  Show [token required] '/products/:id' [GET]`
    *  Create '/products' [POST]`
    *  [ADDED] update [token required]: '/products/:id [PATCH]
    *  [ADDED] Delete [token required]: '/products/:id [DELETE]    

## User
    id?:number;
    first_name:string;
    last_name:string;
    username: string;
    password:string;

## DATABASE
    CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name varchar(50) NOT NULL,
    last_name varchar(50) NOT NULL,
    username varchar(50) NOT NULL,
    password varchar(255) NOT NULL
);

//////////////////////////////////////////////

## Order
    id?:number;
    user_id:number;
    status: string;

## DATABASE
   CREATE TYPE mod AS ENUM ('active', 'complete');
   CREATE TABLE orders (
   id SERIAL PRIMARY KEY,
   user_id INTEGER NOT NULL REFERENCES users (id),
   status mod NOT NULL
);

//////////////////////////////////

## Product
    id?:number;
    name: string;
    price:number;
    category:string;
    rating:number; 
   
## DATABASE
  CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price INTEGER NOT NULL,
  category VARCHAR(50) NOT NULL,
  rating INTEGER NOT NULL
);

////////////////////////////////////

## order_products
  id?:number;
  order_id:number;
  product_id:number;
  quantity:number;
  
## DATABASE
  CREATE TABLE order_products (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products (id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL
);


   
connect to the default postgres database as the server's root user psql -U postgres
In psql run the following to create the dev and test database
CREATE DATABASE storefront_dev;
CREATE DATABASE storefront_test;
Connect to the databases and grant all privileges using pgadmin
Migrate Database
Navigate to the root directory and run the command below to migrate the database

db-migrate up -c 5

Enviromental Variables Set up
Bellow are the environmental variables that needs to be set in a .env file. This is the default setting that I used for development, but you can change it to what works for you.

PORT=3000 POSTGRES_HOST=127.0.0.1 POSTGRES_DB=storefront_dev POSTGRES_TEST__DB=storefront_test POSTGRES_USER=postgres POSTGRES_PASSWORD=8773 ENV=dev SALT_ROUNDS=1 TOKEN_TEST = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImZpcnN0bmFtZSI6ImFzZCIsImxhc3RuYW1lIjoiYXNkIn0sImlhdCI6MTY1MTM3MDk1NX0.Ik3sQnSCWshS7fPDepmY6A0EU7XqMZJHLdE94__Popo.e30.J8BgsyqA3Y6F71NXbfuYIfRVuvRa_qb08RStxrCVhlQ TOKEN_SECRET = ####  
Running Ports
After start up, the server will start on port 3000 and the database on port 5432

Endpoint Access
All endpoints are described in the REQUIREMENT.md file.

Token and Authentication
Tokens are passed along with the http header as

Authorization   Bearer <token> 
 Owner source ahmedhem

Please leave your answer here:


# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index 
- Show (args: product id)
- Create (args: Product)[token required]
- [OPTIONAL] Top 5 most popular products 
- [OPTIONAL] Products by category (args: product category)

#### Users
- Index [token required]
- Show (args: id)[token required]
- Create (args: User)[token required]

#### Orders
- Current Order by user (args: user id)[token required]
- [OPTIONAL] Completed Orders by user (args: user id)[token required]

## Data Shapes
#### Product
-  id
- name
- price
- [OPTIONAL] category

#### User
- id
- firstName
- lastName
- password

#### Orders
- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)

