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

# 7th Commit-CSS, Jumbotron

BACKEND
data.js > comment out id number updated
env.example > added
server.js > updated

folder: models
productModel.js > added
userModel.js > added

folder: routes
productRoutes.js > added
seedRoutes.js > added
userRoutes.js > added

utils.js > added

FRONTEND
folder: components
Header.js > updated
Product.js > updated
Jumbotron.js > added

folder: pages
Home.js > updated Typewriter Effect
Product.js > updated
Signing.js > added

Store.js > updated

index.css > updated
. CSS adjustments for Responsive logo in Navbar.Brand
left side use ClassName="me-auto" (Line 22)
CSS realignment by category
. Add toast notification to components > Product.js (Line 29-32)
app.js (Lines 11-12, 20)
. Jumbotron with react-typewriter-effect
add components > Jumbotron.js
add Jumbotron in Home.js (Lines 46-50)
. Connect to MongoDB using Atlas (create account if you don't have one)
add: JWT_SECRET = your secret word
add: MONGODB_URI = your mongo_db connection
. Update and install all dependencies in {}package.json needed in backend
. Signin to API
. read data.js to database (fix data.js, all lowercase)
. fix components > Product.js in frontend (Line 16)
. fix pages > Product.jd (Line 81)
. Comment out \_id's in data.js (backend)

# 8th Commit-Checkout/OrderHistory

BACKEND
folder: models
orderModel.js > added

folder: routes
orderRoutes.js > added

server.js > updated
utils.js > updated

FRONTEND
folder: components
CheckoutSteps.js > added
Searchbox.js > added
Header1.js > added (optional)

folder: pages
Order.js > added
OrderHistory.js > added
PaymentMethod.js > added
PlaceOrder.js > added
Profile.js > added
ShippingAddress.js added
Signup.js > added

. Create Bottom header for categories.
. Create SideBar for categories (optional), Header1
. Create Categories for categories (optional), Header
. Create SearchScreen (optional).
components/Header.js without searchBar or sideBar
components/Header1.js with searchBar and sideBar (optional)
. Update App.js

# 9th Commit-Admin

BACKEND
folder: models
orderModel > updated
productModel > updated

folder: routes
orderRoutes > updated
productRoutes > updated
userRoutes > updated
uploadRoutes > added

server.js > updated
utils.js > updated
index.js > updated

FRONTEND
folder: components
AdminRoute.js > added
protectedRoute.js > added
Header.js > updated
Header1.js > updated
Product.js > updated

folder: pages
Cart.js > updated
Dashboard.js > added
Order.js > updated
OrderList.js > added
Product.js > updated
ProductEdit.js > added
ProductList.js > added
Search.js > added
Signin.js > updated
Signup.js > updated
UserEdit.js > added
UserList.js > added

Modify > App.js, index.js, package.json

# 10th Commit-Contact Page, Stripe, PayPal, Multiple Images, Cloudinary

. Create Cloudinary Account, update .env
. Create PayPal Account (sandbox)
. Create Stripe Account (test account), npm i stripe
. Create ContactPage update App.js
. Rate and review products
. Pagination on HomeScreen
. Multiple Images on Product Page and Image Magnifier
. Rename Product.js to ProductMag.js so it is less confusing with components: product.js

BACKEND
folder: models
messageModel.js > added
productModel.js > updated (multiple images)

folder: routes
messageRoutes > added
productRoutes > updated
stripeRoutes > added
userRoutes > updated

config.js > added
server.js > updated
.env.example > update
utils.js > updated

FRONTEND
npm i stripe, paypal

folder: components  
StripeCheckout.js > added
Header.js > updated
Header1.js > updated
BottomHeader.js > updated
Footer.js > updated
BottomFooter.js > updated
LoadingBox.js > updated
Product.js > updated

App.js > updated (divided so it is easier to read)
index.css > updated

folder: pages
Cart.js > updated
Contact.js > added
Dashboard.js > updated
Home.js > updated
Messages.js > added
Order.js > updated
OrderHistory.js > updated
OrderList.js > updated
PaymentMethod.js > updated
PlaceOrder.js > updated
ProductEdit.js > updated
ProductList.js > updated
Product.js to ProductMag > updated multiple images carousel & react-image-magnify
Profile.js > updated
Search.js > updated
ShippingAddress.js > updated
UserList.js > updated

# 11th Commit-ProductMag Lightbox, Options, nodemailer purchase receipt

. Add Toast notifications to components > Product.js
. Update count in stock
. Low Quantity Alert!
. Optional vertical thumbnails for ProductMag.js or horizontal thumbnails for ProductMagRow.js
. Add Lightbox and carousel for ProductMag.js
. Add nodemailer for payment receipt

BACKEND
folder: routes
orderRoutes > updated/count in stock

config.js > updated
utils.js > updated (nodemailer receipt)

FRONTEND
folder: components
Header.js > updated
Header1.js > updated
Product.js > updated

folder: pages
Messages.js > updated
ProductMag > updated
ProductMagRow (optional) > added
Home.js > updated
ProductMagRow.js > added (optional use)
ShippingAddress.js > updated

index.css > updated

# 12th Commit-Stripe Delivery Receipt thru nodemailer, sidebar toast notification, low quantity

. Modify toast notification and create sidebar for desktop, keeping toast notification for mobile
. Add Delivery email information thru nodemailer for admin (added deliveryDays, carrierName, trackingNumber)

BACKEND
folder: models
orderModel.js > updated (added deliveryDays, carrierName, trackingNumber)

folder: routes
orderRoutes.js > update (added deliveryDays, carrierName, trackingNumber)
stripeRoutes.js > updated

server.js > updated
utils.js > updated

FRONTEND
folder: components
Header.js > updated
Product.js > updated (low quantity, count in stock 5 or less)
Sidebar.js > added

folder: pages
Home.js > updated (added sidebar toast notification in desktop)
Order.js > updated (added deliveryDays, carrierName, trackingNumber)
OrderHistory.js > updated (added deliveryDays, carrierName, trackingNumber)
OrderList.js > updated (added deliveryDays, carrierName, trackingNumber), add user info for admin mailing @ contact info
Search.js > updated (added sidebar toast notification in desktop)

index.css > updated

# 13th Commit-Add Skeleton and replace LoadingBox component

FRONTEND
npm i react-loading-skeleton
css > add css marked for Skeleton.css

folder > components:
Skeleton.js
SkeletonDashboard.js
SkeletonHome.js
SkeletonMessage.js
SkeletonOrderHistory.js
SkeletonOrderList.js.js
SkeletonProductList.js
SkeletonProductMag.js
SkeletonUseEdit.js
SkeletonUserList.js

folder > pages:
Dashboard.js (Lines 8, 37-39, 60)
Home.js (Lines 12, 49-50, 114-122)
Messages.js (Lines 9, 71-73, 130-138)
OrderHistory.js (Lines 3, 9, 36-38, 74-80)
OrderList.js (Lines 3, 11, 57-59, 122-130)
ProductList.js (Lines 10, 81-83, 160-170)
ProductMag.js (Lines 26, 71-73, 173)
UserEdit.js (Lines 10, 50-52, 101, 137)
UserList.js (Lines 3, 11, 57-59, 112-120)

# 14th Commit-Modify Backend Utils.js, Password reset added

BACKEND
utils.js > update for date format (mm/dd/yyyy)

folder: models
userModel.js > updated

folder: routes
orderRoutes.js > updated
userRoutes.js > updated

FRONTEND
folder: components
Header.js > updated
Header1.js > updated

folder > pages
Signin.js > updated
ForgetPassword.js > added
ResetPassword.js > added

App.js > updated (ForgetPassword.js, ResetPassword.js)

# 15th Commit-Regex complexity for password

BACKEND
folder > routes
stripeRoutes > updated
userRoutes > updated

utils.js > updated

FRONTEND
folder > components
Header.js > updated
Product.js > updated

folder > pages
ResetPassword.js > updated
Signup.js > updated
Signup.js > updated

index.css > update image size in components > Product.js

# 16 Commit-Converted BACKEND from ES6 to CommonJS, EmailList, Slugify

BACKEND
npm i: "slugify": "^1.6.6",
folder: models
aboutContentModel.js > added
askedQuestionsModel.js > added
designListModel.js > added
emailListModel.js > added
homeContentModel.js > added
faqContentModel.js > added
productModel.js > updated for slugify

folder: routes
aboutRoutes.js > added for dynamic edit
designRoutes.js > added for dynamic edit
emailRoutes.js > added sends automated mass email with attachments
faqRoutes.js > added for dynamic edit
homeContentRoutes.js > added for dynamic title, h4, p, jumbotron
productRoutes.js > updated to handle image deletion from uploads directory
uploadRoutes.js > updated, removed Cloudinary and using Multer to store images

. mkdir uploads in root to handle images and delete images when product is deleted in DB

server.js > updated with /api/emails, api/about, api/design, api/faqs, api/homeContent
utils.js > updated with corrected client email (lindalloydantantiques@gmail.com)

FRONTEND
npm i : > "xlsx": "^0.17.0" for downloading orders to Excel/google sheets
folder: components
Header.js > updated with Admin dropdown > Edit Pages: AboutUsEdit, AskedQuestionsEdit, DesignEdit, HomeEdit
Footer.js > updated
ProductCard.js > updated (comment out Add to Cart) add href for Chairish and Contact page

folder: pages
UserList.js > added EmailList Form to UserList.js
AboutUs.js > updated from static to dynamic
AboutUsEdit.js > added
AskedQuestions.js > updated from static to dynamic
AskedQuestion.js > added
Design.js > updated from static to dynamic
DesignEdit.js > added
Home.js > updated from static to dynamic
HomeContentEdit.js > added
Signin.js > updated to show password
Signup.js > updated to show password
ProductMag.js > updated with href and Link commented out

index.css > updated
CustomCarousel.css > added

App.js > updated with AboutUsEdit, AskedQuestionsEdit, DesignEdit, HomeEdit

# 16th Commit-UserList, Chairish, PaymentMethod Icons, Backend to ES6, package.json for render, fix config

ROOT FOR RENDER
{}package.json in root

BACKEND
{}package.json > updated

config > updated with stripe keys

convert to ES6
server.js > updated
on Render Dashboard added a disk.
🔧 Fixing the Upload Directory Permission Error on Render
Check if the Persistent Disk is Set Up Correctly
Go to Render Dashboard → Your Backend Service.
Click on Disks (left-side menu).
Check if a persistent disk is attached.
If missing, add a new disk:
Name: uploads
Mount Path: /var/data/uploads
Size: 1GB (or more)
Click Save Changes.
Redeploy your service.

folder: models
productModel.js > updated for CharishLink
userModel.js > updated

folder: routes
productRoutes.js > updated fro CharishLink
userRoutes.js > updated

FRONTEND
folder: components
Footer > update with phone number
ProductCard.js > updated to display View on Charish

FRONTEND
folder: pages
PlaceOrder.js > Modify h1 to display a Padlock and secure order method, tax modified to 9.5%
PaymentMethod.js > Removed Stripe | added Visa, MasterCard, Amex, Discover icons
ProductEdit.js > updated with all the Form.Groups
ProductMag.js > updated with Chairish
UserEdit.js > updated with phone number, Added Charish Form.Group checkbox
UserList.js > updated with ability to upload manually users phone number and notes, updated to save the notes until admin deletes, updated with all the Form.Groups

index.css > added styling for user notes

# 17 Commit-Dynamic Carousel Jumbotron Admin HomeContentEdit, AboutUs-Image is now Dynamic, CSS for ProductCard from flex Row to small card Col, removed rating, Header, SearchBox, Cart, SoldGallery, MailChimp, Redesign Header with larger Bee logo, HomePage with CategoriesCard, remove parallax

BACKEND
folder: models
userModel.js > userNames not required for manual input
productModel.js > update with sold for Sold Antiques page
productRoutes.js > update for fetching Sold Antiques
aboutContentModel.js > updated for jumbotron image Dynamic
homeContentModel.js > update to remove Typewriter effect and replace with image dynamically
productModel.js > updated salePrice

folder: routes
emailRoutes.js > updated
subscribeRoutes.js > added
aboutRoutes.js > updated for jumbotron image Dynamic
homeContentRoutes.js > updated for dynamic Jumbotron image upload
uploadRoutes.js > updated with delete category image
productRoutes.js > updated salePrice

server.js > updated with subscribeRouts.js

FRONTEND
folder: components
BottomHeader.js > now being used for links About Us, Collections, Contact, Sold Antiques
CategoriesCard.js > added t display Categories with image on Home page, updated for mobile view
Header.js > updated with AboutUs, Collections, Contact, SoldAntiques for mobile view, updated from soldAntiques to soldGallery, made logo bigger
Footer.js > updated with Sold Antiques Gallery, updated new hours
BottomFooter > updated remove categories, add AboutUs Links
Subscribe.js > added
Jumbotron.js > removed
ProductCard.js > updated salePrice
SearchBox.js > updated
Sidebar.js > updated

folder: pages
AboutUs.js > updated for jumbotron image Dynamic
AboutUsEdit.js > updated for jumbotron image Dynamic
Cart.js > css updated for mobile
Collections.js > updated for styling
Gallery.js > renamed to Collections.js
CategoryProducts.js > added to show ProductCard when Category is clicked from Home.js
Home.js > Comment out Parallax scrolling image, remove products and add Categories Images, move BottomHeader under the Jumbotron, Subscribe component
Home.js > updated with dynamic Jumbotron Carousel image upload, removed className='content'
HomeContentEdit.js > updated with dynamic Jumbotron image upload
ForgetPassword.js > update with Bee logo
Signin.js > update with Bee logo
Signup.js > update with Bee logo
SoldAntiques.js > added
UserList.js > updated
soldGallery.js > updated from soldAntiques, updated to look like Collections
Search.js > updated to map categories and the Sidebar included
UserList.js > updated: removed Required to add userName to database manually from MailChimp
ProductEdit.js > updated
ProductMag.js > updated removed rating and review
ProductList.js > updated

index.css > updated colors.updated, removed Jumbotron image, desktop: update card-img-top to 280px
mobile: update Header .navbar-nav .nav-link
Search.js > updated
index.css > updated with categories for mobile view, Subscribe
App.js > update with Sold Antiques, Collections, updated from soldAntiques to soldGallery

# 18th Commit-Dynamic Carousel Jumbotron Admin HomeContentEdit, AboutUs-Image is now Dynamic, CSS for ProductCard from flex Row to small card Col, removed rating, Header, SearchBox, Cart, SoldGallery, MailChimp

BACKEND
folder: models

folder: routes

server.js > updated

FRONTEND
folder: components
Header.js >
Footer.js >

folder: pages

index.css >

App.js >

# 19th Commit-CSS var--font-family, Bug fix in Search, SMS alerts for new orders, Admin form for SMS, SEO index.html updated, replace PayPal and Stripe with Square, Backend to CommonJS for Square, Jumbotron Dynamic for AboutUs, SEO for SocialMedia

BACKEND
nvm install 18
nvm use 18
** entire backend converted to CommonJS for Square **
folder: model
productModel.js > updated for SMS using orderName: {type: String}, updated for phone.carrier

folder: routes
aboutRoutes.js > updated
orderRoutes.js > updated for GMAIL to SMS text message for sales or messages, updated for Square and deleted Stripe
stripeRoutes.js > deleted
squareRoutes.js > created
userRoutes.js > updated for phone.carrier

.env > updated for Square, deleted PayPal and Stripe, setup for both production and testing
.env.example > updated for Square, deleted PayPal and Stripe
config.js > updated for Square, deleted PayPal and Stripe
server.js > update for the frontend/build and use build
utils.js > updated for GMAIL to SMS text messaging

FRONTEND
index.html > updated meta tags for SEO "Search Engine Optimization", Square SDK by adding script tag

folder: components
AdminPagination.js > updated with { pathname: '/admin/products', search: pageSearch } for Products, Users, Orders, Messages errors
CheckoutSteps.js > updated
StripeCheckout.js > deleted, not needed since we are only using Square
SquareCheckout.js > added for Square payments
Footer.js > updated for Sold Gallery
Header.js > updated for Sold Gallery, useEffect for SMS text messages and toast notifications
ProductCard.js > updated for 2 col on mobile

folder: pages
AboutUs.js > updated fixed jumbotron upload for render
Cart.js > updated bottom comments
OrderDetails.js > updated replaced TEXT with div for SMS text messages, removed PaymentMethod since we are only using Square
OrderHistory.js > updated, removed PaymentMethod since we are only using Square
OrderPayment.js > added
PlaceOrder.js > updated replaced TEXT with div for SMS text messages, deleted PayPal and Stripe, added Square
PaymentMethod.js > deleted, not needed since we are only using Square
ShippingAddress.js > updated, navigate to PlaceOrder from PaymentMethod(deleted)
Search.js > updated Sidebar fixed
UserEdit.js > updated for SMS phone.carrier
UserList.js > updated for Carrier

App.js > deleted PaymentMethod.js, added OrderPayment.js

index.js > deleted PayPal

React vs18
npm install --legacy-peer-deps

# 20th Commit-Modify UI Search for mobile view, add comments

FRONTEND
folder: components
Footer.js > Checkout by Square

folder: pages
Home.js > Add comments
ProductMag.js > add comments
Search.js > updated, commented out categories, prices for mobile view, add comments

# 21st Commit-Modify UI Search for mobile view, add comments

FRONTEND
folder: components
Footer.js > Checkout by Square

folder: pages
Home.js > Add comments
ProductMag.js > add comments
Search.js > updated, commented out categories, prices for mobile view, add comments

# 22nd Commit-Add Instructions for uploading products or adding Chairish, fix productModel, price field added.

FRONTEND
folder: components
Header.js > added Instructions.js

folder: pages
Instructions.js > added

App.js > added Instructions.js

# 23rd Commit-fix backend image upload emails, Sold Gallery, add Spectrum to Admin text list

BACKEND
folder: routes
orderRoutes.js > updated with sold
subscribeRoutes.js > updated

utils.js > updated
.env > updated with BASE_URL=https://lloyd-tme8.onrender.com | app password updated

folder: components
ProductCard.js > updated
Subscribe.js > updated, adds email to MailChimp
ProductMag.js > updated for shipping times

FRONTEND
folder: pages
ProductEdit.js > updated with new category option

index.css > updated

# 24th Commit-update for Live SquareUp, SMS test message notification for Messages, css productCards, add global css > styles folder, State Taxes by each state and all respective counties

BACKEND

folder: models
orderModel.js > updated, added countyName for taxes, Shipping Address
userModel.js > updated, added ShippingAddress for Profile page

folder: routes
messageRoutes.js > updated for SMS Messages to admin for messages/Contact page
orderRoutes.js > updated with County for tax by state and county
squareRoutes.js > updated with turnery operator for live purchases
userRoutes.js > updated

stateTaxRates > added all counties for each state in a separate file (root)
taxRateIndex.js > added for all states

config.js > updated with const isLive = true; SquareUp payments
.env > updated with correct live credentials

FRONTEND
folder: components
CategoriesCard.js > updated
Header.js > updated CLEAR_CART
ProductCard.js > updated

folder: pages
Messages.js > updated
OrderDetails.js > updated
OrderHistory.js > updated
OrderList.js > updated
PlaceOrder.js > updated
Profile.js > updated Shipping Address
Search.js > updated
ShippingAddress.js > updated county map

folder: helpers created
stateCountyMap.js > added (state county map for tax dropdown)

index.html > updated with live and commented out the old SANDBOX
index.css > updated the ProductCard to div className="productContainer", also added global styles folder
styles > added
base.css
cart.css
category-card.css
checkout.css
components.css
custom-carousel.css
footer-bottomfooter.css
header-bottomheader.css
home.css
media-queries.css
pagination.css
product-card.css
productmag.css
search.css
sidebar.css

<script
  type="text/javascript"
  src="https:..."
></script>

# 25th Commit-fix illionoisCountyTaxRates naming to lowercase

# 26th Commit-change from static hardcoded taxes to dynamic taxes via: address, npm install uuid

BACKEND
npm install uuid

folder: models
orderModel.js > updated with appliedTaxRate: { type: Number }

folder: routes
orderRoutes.js > updated
taxRoutes.js > updated
userRoutes.ss > updated

config.js > updated
utils.js > updated

FRONTEND
folder: components
SquareCheckout.js > updated
createTax.js > added

folder: pages
PlaceOrder.js > updated
OrderDetails.js > updated
OrderHistory.js > updated with taxes
OrderList.js > updated | Filter by Month Download as Excel

# 27th Commit-ShippingCost toggle added during the sale or after the sale, backend converted to ESM (not ES6) for square

BACKEND
folder: models
orderModel.js > updated

folder: routes
orderRoutes.js > updated with orderRoutes Folder:
adminRoutes.js > added
adminShippingRoutes.js > added
orderCreateRoutes.js > added
orderDetailsRoutes.js > added
orderMineRoutes.js > added
orderPaymentRoutes.js > added
orderSoldRoutes.js > added
orderSummaryRoutes.js > added
testRoutes.js > added
squareRoutes.js > updated

utils.js > updated

package.json > updated to "square": "^38.0.0"
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

FRONTEND
index.html > switched to sandbox testing

folder: components
orderDetails folder > added
AdminShippingActions.js > added
AdminShippingForm.js > added
OrderItemsCard.js > added
PaymentStatusCard.js > added
ShippingAddressCard.js > added
SquareCheckout.js > updated

folder: helpers > added
stateCountyMap.js > added

folder: pages
Cart.js > updated
OrderDetails.js > updated (Divided into multiple components)
OrderDetailsWorks.js > added Flat-Rate and Invoiced shipping
OrderHistory.js > updated with taxes
OrderList.js > updated Flat-Rate and Invoiced shipping
OrderPayment.js > updated
PlaceOrder.js > updated
ProductEdit.js > updated
ProductList.js > updated
Profile.js > updated
Search.js > updated
ShippingAddress.js > updated
