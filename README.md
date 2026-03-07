# Modern Blogs - Frontend Application

A responsive, feature-rich, and visually appealing blog platform frontend built with React 19 and Vite. The application provides a seamless user experience with fast page loads, modern animations, and a high-contrast dark aesthetic by default.

## 🚀 Features

*   **Modern User Interface:** A sleek dark theme with smooth page transitions and micro-animations for an elevated user experience.
*   **Authentication & Authorization:** Secure user login, registration, and context-based state management (`AuthContext`).
*   **Role-Based Access Control:**
    *   **Admin Panel:** Exclusive space for administrators to manage all posts and comments.
    *   **User Dashboard:** Personal dashboard for authors to create, manage, and track their own posts/comments.
*   **Rich Content Interaction:**
    *   Read detailed blog posts (`PostReader`).
    *   Search for specific content (`Search`).
    *   Browse posts by specific tags (`TagBrowser`).
*   **Interactive Components:** Smooth notifications system (`react-hot-toast`) and clean iconography (`lucide-react`).
*   **Performant Animations:** Beautiful page transitions and component animations powered by `framer-motion`.

## 🛠️ Technology Stack

*   **Core:** React 19, Vite
*   **Routing:** React Router DOM (v7)
*   **Styling & UI:** Custom CSS Variables with a standardized dark theme aesthetic
*   **Animations:** Framer Motion
*   **Icons:** Lucide React
*   **Notifications:** React Hot Toast
*   **HTTP Client:** Axios
*   **Date Formatting:** Date-fns

## 📂 Project Structure

```
src/
├── api/             # API integration and Axios configurations
├── assets/          # Static assets (images, fonts, etc.)
├── components/      # Reusable UI components
│   ├── layout/      # Navbar, Footer, wrappers
│   └── ui/          # Buttons, Inputs, Cards, etc.
├── context/         # React Context API (e.g., AuthContext)
├── pages/           # Application views (Home, Login, Dashboard, etc.)
├── App.jsx          # Main application component & Routing setup
├── index.css        # Global styles and CSS variables
└── main.jsx         # Application entry point
```

## 💻 Getting Started

### Prerequisites

*   Node.js (v18.0 or completely latest recommended)
*   npm or yarn

### Installation

1.  Clone the repository and navigate into the project directory:
    ```bash
    cd Modern-Blogs
    ```

2.  Install all required dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

3.  Set up environment variables. Create a `.env` file in the root based on a `.env.example` if available (e.g., for `VITE_API_BASE_URL`).

### Running the Project

Start the Vite development server:
```bash
npm run dev
# or
yarn dev
```
The application should now be accessible at `http://localhost:5173`.

## 📝 Available Scripts

*   `npm run dev`: Starts the development server with Hot Module Replacement (HMR).
*   `npm run build`: Bundles the app for production.
*   `npm run preview`: Previews the production build locally.
*   `npm run lint`: Runs ESLint to find and optionally fix code quality issues.
