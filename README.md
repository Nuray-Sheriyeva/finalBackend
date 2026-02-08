# finalBackend
final project repository for WEB Backend

 Include a README.md file with:
o Project overview
o Setup and installation instructions
o API documentation (routes, methods, access type)

## Project Overview

• This project is about a restaurant called Amphora which I have chosen as my Final idea. It has 8 folders each with dedicated purpose:
1. config -> database connection.
2. middleware -> for middleware, mostly for Joi and JWT.
3. model -> consists of model of mongoose schemas used throughout the database.
4. node_modules -> node.js express.js folder
5. public -> is for frontend content: js & css files and images.
6. routes -> for all routes that manage the backend
7. validators -> Joi library validator schemas
8. views -> all html files aka webpages
There are also some files like the actual backend back.js, .env for environmental variables, and some packages.

The website includes for main pages:
    Home Menu Booking Delivery 
1. Home 
    home page includes overall information about the restaurant. There you can find, concise menu, about restaurant, chef's special, customer reviews, and map mapping the restaurant address
2. Menu
    Everything in the menu collection is in here. The actual menu
3. Booking 
    This webpage serves as a form for user to complete in order to book a time at the restaurant.
4. Delivery
    Serves as cart for the user. Anytime user chooses a dish from menu page the dish can be seen in the delivery page and therefore be ordered.

## Setup and Installation

1. Clone the repository
2. Run `npm install` to install dependencies
3. Create a `.env` file with required environment variables
4. Run `npm run dev` to start the server

## API documentation
public
1. '/api/auth/register' GET -> for registering users
2. '/api/auth/login' GET -> for logging in
3. '/logout' -> for logging out

private
4. '/api/users/profile' GET -> for getting logged in user profile
5. '/api/users/profile' PUT -> for updating the profile of logged in user
6. '/api/resource' GET -> for getting all foods in the menu
7. '/api/resource' POST -> for creating new food
8. '/api/resource/:id' GET -> for getting specific food based on given id
9. '/api/resource/:id' PUT -> for updating specific food based on given id
10. '/api/resource/:id' DELETE -> for deleting specific food based on given id

Access Type	
1. Public	Anyone can access (no token, using express-session)
2. Private	Requires authentication (JWT)
