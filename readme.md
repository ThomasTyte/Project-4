# Thomas Tyte's Game Rating App

## Overview

Welcome to the **Game Rating App**! This project allows users to rate their favorite games, provide feedback through a contact form, participate in a Q&A section, and manage a to-do list. The app is designed to enhance user experience with easy navigation while maintaining a clean, responsive design.

## Features

- **Game Rating:** Users can rate games from a provided list, helping themselves and others with informed opinions.
- **User Authentication:** Secure sign-up and login for users to create accounts and manage their sessions.
- **Q&A Section:** Users can ask and answer frequently asked questions, contributing to a helpful community resource for game enthusiasts.
- **Contact Form:** Users can submit their queries or feedback directly to the app developers.
- **To-Do List Management:** Users can keep track of tasks or games they want to try, ensuring they never forget what's next.

<a href="images//wireframe..jpeg">
    Click here to view the image
</a>

## Technologies Used

### Frontend

- **HTML, CSS, JavaScript:** For the basic structure and styling of the application.
- **React:** For building reusable components and managing application state.
- **React Router:** For client-side routing and navigation between components.
- **Axios:** For making API requests.

### Backend

- **Node.js with Express:** For server-side logic and handling API requests.
- **MySQL:** For database management, storing user information, game ratings, and comments.
- **JWT (JSON Web Tokens):** For user authentication and securing routes.

## Dependencies

### Frontend

- **@material-ui/core:** `npm install @material-ui/core`
- **react-router-dom:** `npm install react-router-dom`
- **axios:** `npm install axios`
- **react-scripts:** `npm install react-scripts`
- **react:** `npm install react`
- **css-loader:** `npm install css-loader`
- **style-loader:** `npm install style-loader`

### Backend

- **express:** `npm install express`
- **mysql:** `npm install mysql`
- **jsonwebtoken:** `npm install jsonwebtoken`
- **bcrypt:** `npm install bcrypt`
- **nodemailer:** `npm install nodemailer`

## How to Use

1. **User Authentication:**
   - **Sign Up:** Create your account by filling out the registration form.
   - **Login:** Access your account using your credentials.
2. **Navigating the App:** Use the navigation bar to switch between the Q&A section, games, and the contact form.

3. **Rating Games:** Browse the list of games and submit your ratings using the interactive buttons.
4. **Submit a Question or Comment:** Access the Q&A section to ask questions or leave comments on existing points.
5. **Contact Submission:** Fill out the contact form to send feedback or inquiries directly to the developers.

## Running the Application

### Prerequisites

- **Node.js** and **npm** installed on your machine.
- A **MySQL database set up** for user authentication and storing game data.

### Backend Setup

## Running the Application

Prerequisites: Node.js and npm installed on your machine, and a MySQL database set up for user authentication and storing game data.

To run the application, follow these steps:

- Clone the repository: `git clone [your-repo-url]` and navigate to the cloned repository folder.
- Create a .env file in the root of the backend with your database credentials: `DB_USER=your_user`, `DB_PASSWORD=your_password`, `DB_NAME=gamerating`, and `JWT_SECRET=your_jwt_secret`.
- Install dependencies: `npm install`.
- Run the server: `npm start`.

Navigate to the frontend folder (assuming you're using create-react-app), install dependencies: `npm install`, and start the frontend application: `npm start`.

## Future Improvements

- Enhanced API Integration: Implement a better API from game platforms for comprehensive real-time game data.
- Improved User Interface: Enhance the visual design to make the rating process and overall user experience even more intuitive.
- Bot Prevention Security System: Integrate measures to prevent bots from submitting ratings or comments, ensuring all feedback comes from genuine users.
- Game Updates Feature: Implement a section for game updates, like new releases or patches, to keep users informed.

## User Stories

- User Story 1: As a user, I want to quickly navigate between the Q&A section and other features for seamless access.
- User Story 2: As a user, I want to be able to rate games to keep track of my favorites and help others.
- User Story 3: As a user, I want to submit my contact information and feedback to the application developers.

Thank you for checking out my project! Your feedback and suggestions are always welcome
#   P r o j e c t - 4 
 
 
