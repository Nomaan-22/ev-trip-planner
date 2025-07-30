# 🚗 EV Trip Planner

A smart, full-stack web application designed to help electric vehicle owners in India plan long-distance journeys with confidence by calculating optimal routes and identifying necessary charging stops.

![EV Trip Planner Screenshot](<img width="1920" height="1080" alt="Screenshot (90)" src="https://github.com/user-attachments/assets/cd8ac376-5452-4ac9-b51d-b923e2950fbb" />
) 
*(Suggestion: Replace this placeholder with a screenshot of a successfully planned trip, like the final Delhi-Jammu route)*

---

## ✨ Core Features

* **📍 Dynamic Route Planning:** Get optimized driving routes between any two locations in India using the OSRM API.
* **⚡️ Intelligent Charging Stops:** Automatically calculates the required charging stops based on the vehicle's maximum and current battery range.
* **🗺️ Interactive Map View:** Visualizes the entire route, including the locations of all necessary charging stations.
* **📚 Curated Popular Routes:** For high-traffic routes (e.g., Delhi-Jammu, Hyderabad-Bangalore), the app uses a curated and verified list of high-quality charging stations from its own database for maximum reliability.
* **🌐 Fallback API Integration:** For less common routes, the app seamlessly falls back to the extensive [OpenChargeMap API](https://openchargemap.org/) to find charging stations, ensuring comprehensive coverage.
* **⚙️ User-Customizable Range:** Users can input their specific vehicle's maximum range and their current battery level for personalized and accurate planning.
* **🛡️ Safety Buffer Logic:** The planning algorithm includes a configurable safety buffer to prevent users from arriving at a charger with critically low battery, accounting for real-world range variations.

---

## 🛠️ How It Works

This project uses a hybrid strategy for maximum accuracy and coverage:

1.  When a user inputs a start and destination, the backend first checks if it matches one of the **pre-defined popular routes**.
2.  **If a match is found,** it uses the high-quality, manually verified list of charging stations from the internal MongoDB database. This provides the most reliable plan for common journeys.
3.  **If no popular route is found,** the application fetches the route geometry from OSRM. It then intelligently queries for charging stations along that specific route, first from its own database and then falling back to the comprehensive OpenChargeMap API.
4.  The frontend algorithm then processes this data, taking into account the user's current and max range, to calculate the mandatory stops needed to complete the trip safely.

---

## 💻 Technology Stack

* **Frontend:**
    * [React](https://reactjs.org/) (with Vite)
    * [React Router](https://reactrouter.com/)
    * [Tailwind CSS](https://tailwindcss.com/)
* **Backend:**
    * [Node.js](https://nodejs.org/)
    * [Express.js](https://expressjs.com/)
* **Database:**
    * [MongoDB](https://www.mongodb.com/)
    * [Mongoose](https://mongoosejs.com/)
* **APIs & Services:**
    * [Open-Source Routing Machine (OSRM)](http://project-osrm.org/) for route calculation.
    * [OpenChargeMap API](https://openchargemap.org/site/develop/api) for extensive charging station data.
    * [Leaflet](https://leafletjs.com/) for rendering the interactive map.

---

## 🚀 Setup and Local Installation

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Nomaan-22/ev-trip-planner.git](https://github.com/Nomaan-22/ev-trip-planner.git)
    cd ev-trip-planner
    ```

2.  **Install Backend Dependencies:**
    ```bash
    cd server
    npm install
    ```

3.  **Install Frontend Dependencies:**
    ```bash
    cd ../client
    npm install
    ```

4.  **Set Up Environment Variables:**
    * In the `/server` directory, create a `.env` file.
    * Inside the `.env` file, add your MongoDB connection string:
        ```
        MONGODB_URI=your_mongodb_connection_string
        ```

5.  **Run the Application:**
    * **Start the backend server:** From the `/server` directory, run:
        ```bash
        npm run dev
        ```
    * **Start the frontend client:** In a new terminal, from the `/client` directory, run:
        ```bash
        npm run dev
        ```

The application should now be running on `http://localhost:5173`.

---

## 🔮 Future Improvements

-   [ ] **User Accounts:** Allow users to create accounts to save their vehicle profiles and trip history.
-   [ ] **Vehicle Profiles:** Add different EV models with their default range and charging specs.
-   [ ] **Real-Time Station Status:** Integrate with APIs that provide live availability of charging slots.
-   [ ] **Elevation Data:** Factor in route elevation changes for even more accurate range predictions.

