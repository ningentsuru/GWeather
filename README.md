# GWeather App

## Setup & Running the Project

1. Environment Configuration: Duplicate the `.env.example` file, rename the copy to `.env`, and open it. Locate the `OPENWEATHER_API_KEY` variable and assign your API key:

```bash
OPENWEATHER_API_KEY=
```

2. Start Development Server: Execute the following command in your IDE terminal to install dependencies (if needed) and launch the server:

```bash
pnpm dev
```

4. Access Application: Once the server is running, open your preferred browser and navigate to:

```bash
http://localhost:3000/
```

5. Home Page Overview
   - The landing page features three distinct cards designed to provide immediate weather insights while managing user access levels:
   - Search by city
     - This card serves as the primary entry point for guest users. It contains a simple input field and a search button. Upon searching, the results populate the third card ("Weather Information"). To encourage registration, subsequent searches are disabled for guest users; they must create an account to continue searching for different cities.
   - Weather at Your Location
     - This card offers personalized local weather data but requires authentication
     - Guest State: Clicking "Unlock this feature" redirects the user to the login page.
     - Authenticated State: Once logged in, users can grant geolocation permissions. If allowed, the app fetches coordinates to display local weather; if denied, the action is skipped.
     - Map Integration: When location access is granted, a dedicated button appears, allowing users to view their precise coordinates on Google Maps.
   - Weather Information
     - This dynamic card displays the detailed forecast based on the selected city or current location.
     - Dynamic Icons: The weather icon adapts to the time of day and conditions:
       - Sun Icon: Displayed between 6:00 AM and 6:00 PM.
       - Moon Icon: Displayed between 6:00 PM and 6:00 AM.
       - Rain Icon: Triggered specifically when the API description or weather main type contains "rain".
     - Temperature: Shows the primary value in Celsius, with a calculated Fahrenheit equivalent displayed alongside.
     - Description: Provides a textual summary of current conditions (e.g., "scattered clouds").
     - Location Details: Clearly displays the City Name and Country Code.
     - Sun Cycle: Displays Sunrise and Sunset times, converted from the API's Unix timestamp to the local timezone of the searched city.
6. Login and Sign up page
   - Registration Flow: New users can create an account instantly by providing an email, name, and password. The system automatically provisions the account upon submission, requiring no manual approval or email verification for initial access.
   - Session Management: Authentication and session persistence are handled securely by nuxt-auth-utils. This module manages encrypted, HTTP-only cookies to maintain user sessions, ensuring that login states persist across page reloads while keeping sensitive data off the client side.
   - Data Isolation: User data is strictly segregated by account. When a new account is created, it starts with a clean slate; previous search histories from other accounts remain completely inaccessible. This ensures privacy and prevents data leakage between users.
   - Local Storage Architecture: User profile information is persisted locally using Nitro’s storage driver, saved specifically to .data/users/{email}. This file-based approach acts as a lightweight database where the user's email address serves as the unique key for retrieving their specific profile and settings.

7. Weather List
   - Search History & Current Location: This feature allows users to review their previous weather searches or quickly access data for their current location.
   - Local Data Persistence: All search history is persisted locally within the Nitro server’s storage system, specifically organized by user in the .data/weather/{user.id} directory. This ensures each user’s search list is isolated, secure, and instantly retrievable without requiring an external database.

8. API Calls & Data Management
   - Server-Side Proxy: I utilize Nitro server routes to act as a secure intermediary. This architecture proxies requests to external backends, allowing me to filter response data (removing unnecessary columns) before it reaches the client. Crucially, this keeps sensitive API keys and backend URLs hidden on the server, ensuring they are never exposed in the browser's Network tab. Instead, the client only sees internal requests like `http://localhost:3000/api/weather/queryparams?city=Tokyo`.
   - Persistent Storage: Data persistence is handled via Nitro’s built-in storage layer, configured to save files in the .data/ directory. This functions as a lightweight, file-based NoSQL key-value store, providing simple and effective data retention without the need for a complex database setup.
9. Website Style and Themes
   - Styling Engine: I utilize Tailwind CSS, applying all CSS properties directly via utility classes in the class attribute for rapid, consistent styling.
   - Theme Management: Dark and light mode switching is handled by the @nuxtjs/color-mode plugin, which automatically toggles themes based on user preference or system settings.
   - Component Library & Configuration: I leverage shadcn-vue for reusable common components. Color variables for both light and dark modes are centrally defined and customized within `app/assets/css/tailwind.css`, ensuring seamless integration with the Tailwind utility framework.
10. Unit Testing
    - Framework & File Placement: I use Vitest for unit testing, placing test files (e.g., Component.spec.ts) directly alongside their corresponding Vue components. This colocation strategy ensures the component and its spec are in the same directory, making them significantly easier to locate and maintain together.
11. Atomic Design
    - This structure promotes scalability, reusability, and clear organization in component library.
    - Atoms: These are the most basic, indivisible components—like a single `<Button>` or `<Input>`. They serve as the foundational building blocks of your UI.
    - Molecules: These are simple combinations of two or more atoms working together—such as a search form made from an `<Input>` and a `<Button>`.
    - Organisms: These are more complex components composed of multiple molecules and/or atoms. They represent distinct sections of an interface, like a header, footer, or product card.
    - Templates: These define the overall page layout by arranging organisms into a structured format. Templates focus on the content hierarchy without specific data.
12. Mobile Support
    - Responsive Design: The application is fully mobile-friendly, utilizing Tailwind CSS’s responsive utility classes to ensure a seamless and adaptive user experience across all device sizes, from smartphones to desktops. Layouts, typography, and interactive elements automatically adjust to fit smaller screens without compromising functionality or aesthetics.
