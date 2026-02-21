🏡 Airbnb Clone

A full-stack Airbnb UI clone built using Node.js, Express, EJS, and standard frontend technologies. This project replicates the look & feel of the Airbnb platform with routing, dynamic views, and modular backend structure.

🔗 Table of Contents

🛠️ About

📦 Features

🧠 Tech Stack

🚀 Installation & Usage

📁 Project Structure

✨ How to Contribute

📄 License

🛠️ About

This is a clone of the Airbnb web application, built for learning web app structuring, routing, templating, and frontend-backend integration. It includes dynamic rendering of pages, modular routes/controllers, and utility functions for reusable logic.

The app does not include backend DB authentication or bookings yet, but lays out a solid MVC-style architecture for growth.

📦 Features

✔️ Clean Airbnb-style UI pages using EJS templates
✔️ Modular routing (Express) for different sections of the app
✔️ Reusable view components
✔️ Utility helpers for backend logic
✔️ Static assets served (CSS/JS/images)
✔️ Scalable folder structure for future features

🧠 Tech Stack
Layer	Technology
Backend	Node.js + Express.js
Templating	EJS (Embedded JavaScript Templates)
Frontend	HTML, CSS, Vanilla JS
Package Management	npm
Utilities	Custom utils & route organization

📌 This structure helps you build on top of it — like adding MongoDB/PostgreSQL, authentication, bookings, API endpoints, etc.

🚀 Installation & Usage
Clone the repo
git clone https://github.com/omjha-git/airbnb.git
cd airbnb
Install dependencies
npm install
Run the app
npm start

The app will start on http://localhost:3000
 by default.
You should see the Airbnb-style pages with static content and navigation.

📁 Project Structure
airbnb/
├── MODEL/             # Data models (future DB layer)
├── controller/        # Route handlers
├── init/              # Initialization scripts
├── public/            # Static files (CSS, images, JS)
├── routes/            # Express routing
├── utils/             # Utility helpers
├── views/             # EJS view templates
├── app.js             # Main server entry
├── cloudconfiguration.js # Configuration helpers
├── package.json       # NPM dependencies
└── .gitignore
✨ How to Contribute

If you’d like to help build this further:

✨ Fork the repo

📥 Create a new feature branch

📝 Add your feature or fix issues

📤 Submit a Pull Request

Ideas for improvements:
✅ Add user signup/login with DB
✅ Listings and search
✅ Booking pages
✅ Payment integration
✅ Map / location features

📄 License

This project is open-source — feel free to use it & build your own features.
