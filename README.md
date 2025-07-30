# EV Trip Planner

![EV Trip Planner Screenshot](https://i.imgur.com/your-screenshot-url.jpg) 
*(Suggestion: Replace this with a URL of one of your best screenshots)*

A full-stack web application designed to help electric vehicle owners plan their long-distance trips across India with confidence. The app calculates optimal routes, identifies necessary charging stops, and provides a seamless user experience.

---

## Features

- **Route Planning:** Enter a start and destination to get an optimized route.
- **Popular Routes:** Pre-defined, verified routes for common journeys.
- **Smart Stop Calculation:** Automatically calculates the necessary charging stops based on your vehicle's current and maximum range.
- **Interactive Map:** Visualizes the route and charging station locations.
- **Fallback APIs:** Uses OpenChargeMap for routes not in our curated database.

---

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **APIs:** OpenChargeMap, Open-Source Routing Machine (OSRM)

---

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/ev-trip-planner.git](https://github.com/your-username/ev-trip-planner.git)
    cd ev-trip-planner
    ```
2.  **Install server dependencies:**
    ```bash
    cd server
    npm install
    ```
3.  **Install client dependencies:**
    ```bash
    cd ../client
    npm install
    ```
4.  **Environment Variables:**
    - In the `/server` directory, create a `.env` file.
    - Add your `MONGODB_URI`.
5.  **Run the application:**
    - Start the backend server: `npm run dev` in the `/server` directory.
    - Start the frontend client: `npm run dev` in the `/client` directory.


Step 3: Upload to GitHub