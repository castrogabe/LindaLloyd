# LindaLloyd

# 1st Commit Create React App, Layout

npx create-react-app frontend
FRONTEND
folder:
public > add images for this course

delete some files:
App.css
App.test.css
Delete contents of index.css
logo.svg
setupTests.js

App.js delete contents:
import logo from "./logo.svg";
import "./App.css";

Add in App.js: import React from "react";

CREATE HOME PAGE WITH REACT FUNCTIONAL COMPONENTS:
#########################################

// rfc <= this is the one we are using in the lessons
import react from 'react';

export default function Home () {
Return {

<div>Home</Home>
}
};

##########################################

// rfce:
Import React from ‘react’;

function HomeScreen {
Return (

<div>Home</div>
)
};

// rafc:
Import React from ‘react’;

export const Home = () => {
Return <div>Home</div>;
};

export default Home;

// rafce:
Import React from ‘react’;

const Home = () => {
Return <div>Home</div>;
};

---

BACKEND
(root) npm init -y backend

---

export default Home;

Development tools needed
GOOGLE CHROME: https://www.google.com/chrome/ follow the steps to install on your system
VsCode: https://code.visualstudio.com/ follow the steps to install on your system
Nodejs: https://nodejs.org/en install LTS VERSION follow the steps to install on your system
Git: https://git-scm.com/ follow the steps to install on your system

Accounts needed
Canva: https://www.canva.com/ we will use this to create our logo and jumbotron
Express: https://expressjs.com/ we will use to build our backend API application
Mongodb: https://www.mongodb.com/ to save and retrieve data from the database
Cloudinary: https://cloudinary.com/ to save our images
JWT: https://jwt.io/ for user auth
PayPal Developer: https://developer.paypal.com/home to make payments for PayPal orders
Stripe: https://stripe.com/docs/development/dashboard to make payments using credit cards
Nodemailer: https://nodemailer.com/usage/using-gmail/ to email the customer’s purchase receipt, shipping confirmation, respond to questions from contact form
Git: https://github.com for version control
Render: https://render.com/ to host our application online

.gitignore uncomment node_modules and build

FRONTEND
folder: components
Header.js > added
BottomHeader.js > added
Footer.js > added
BottomFooter.js >added

folder: pages
Home.js > added
About.js > added
Gallery.js > added
Product.js > added

Add Bootstrap and all css

####### GIT COMMIT YOUR REPOSITORY ###########

1. git init
2. git add .
3. git commit -m "First Commit"
4. git branch -M master
5. git remote add origin https://github.com/(yourname)/lindalloyd.git
6. git push -u origin master

# 2nd Commit add static images data.js and for second commit

#### How to Add second commit

from terminal > cd project root

1. git add .
2. git status (shows stages files ready to commit in green)
3. git commit -m "commit message"
4. git status (tells us that everything is committed "working tree clean" on main branch)
5. git push

# 3rd Commit add static data

FRONTEND
.folder: pages
Product.js > added

data.js > added (root)

# 4th Commit create backend

Terminal: mkdir backend
cd backend
npm init (enter thru the prompts) creates {}package.json

BACKEND
data.js > added
.gitiginore > added
server.js > added
. create route for api/products
. update and fetch products from backend using axios
. get state from useReducer
. update HomeScreen.js

FRONTEND
.folder: pages
Gallery.js > updated
Home.js > updated
Product.js > updated

# 5th Commit by Reducer Hook, Helmet, Rating

BACKEND
server.js > update

FRONTEND
folder: components
LoadingBox.js (spinner) > added
MessageBox.js > added
Product.js > added
Rating.js > added

folder: pages
AboutUs.js > updated
Home.js > updated
Product.js > updated
Rating.js > added

. define reducer
. update fetch data, get state from useReducer in Home
. create product and rating components
. Use rating in product component
. Add Helmet to pages and index.js
. Jumbotron with typewriter effect in Home and components add Jumbotron.js
. Create Product details
. Create loading component
. Create message component
. Add React spinner in LoadingBox
. utils.js to define error function
. update server.js in backend

# 6th Commit, Cart

BACKEND
data.js > updated with id number
server.js > updated

FRONTEND
folder: pages
Cart.js > added

App.js > updated
Store.js > added
Product.js > updated

. Add \_id number to products array in data.js
. Create Cart page
. add app.get to server.js to fetch products by \_id
. Update index.js for React 18
