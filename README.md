# Aeris Weather

A modern, responsive weather dashboard for searching worldwide locations, viewing current conditions and detailed forecasts, and saving favourite places.

Aeris combines live weather data from Open-Meteo with anonymous Firebase Authentication and Cloud Firestore. It is designed for desktop and mobile use, with compact responsive layouts, animated weather icons, location-aware day/night visuals, and a slide-in saved-places panel on smaller screens.

## Features

- Search worldwide locations with an asynchronous, keyboard-accessible search field
- Use browser geolocation to retrieve weather for the current position
- View current temperature, weather condition, precipitation, humidity, and wind
- Display day- or night-specific weather icons using the API's `is_day` value
- Explore an hourly forecast starting at the current hour
- Select any day from a seven-day forecast to inspect its hourly conditions
- Change temperature, wind-speed, and precipitation units
- Save and remove favourite locations with anonymous Firebase accounts
- View live conditions and temperatures for saved places
- Access saved places in a desktop sidebar or mobile slide-in panel
- Validate external API responses at runtime with Zod
- Preserve the current forecast when geolocation or network requests fail
- Show responsive loading, empty, and error states

## Technology

- [React 19](https://react.dev/) and TypeScript
- [Create React App](https://create-react-app.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Open-Meteo Forecast API](https://open-meteo.com/)
- [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api)
- [Nominatim](https://nominatim.org/) for reverse geocoding
- [Firebase Authentication](https://firebase.google.com/docs/auth) with anonymous sign-in
- [Cloud Firestore](https://firebase.google.com/docs/firestore) for saved places
- [React Select](https://react-select.com/) for accessible custom selects
- [Zod](https://zod.dev/) for API response validation
- [Meteocons](https://meteocons.com/) and Font Awesome for interface icons

## How the Application Works

1. On startup, the application signs the visitor into Firebase anonymously.
2. The visitor searches for a place or grants browser geolocation access.
3. Open-Meteo returns current, hourly, and seven-day weather data in the location's timezone.
4. Zod validates the response before it enters application state.
5. React Context shares weather data, units, and the Firebase user across the interface.
6. Favourite coordinates and display names are stored in Firestore under the anonymous user's UID.
7. Saved locations are refreshed from the weather API before being displayed.

No API key is required for Open-Meteo. Firebase configuration is required for authentication and saved places.

## Project Structure

```text
src/
├── assets/weather/       Customised Meteocons SVG assets
├── components/           Forecast, search, sidebar, footer, and shared UI
├── context/              Weather, unit, and authenticated-user state
├── firestore/            Firebase application initialisation
├── hooks/                Weather, geolocation, geocoding, and Firestore hooks
├── utilities/            Weather codes, icon mapping, schemas, and types
├── App.tsx               Responsive application shell
└── index.tsx             React entry point and context providers
```

## Local Development

### Requirements

- Node.js 18 or newer
- npm
- A Firebase project with a registered Web app

### 1. Clone the repository

```bash
git clone https://github.com/ymk-coder-star/weather-app.git
cd weather-app
```

### 2. Install dependencies

```bash
npm install
```

If npm reports peer-dependency conflicts from the Create React App toolchain, use:

```bash
npm install --legacy-peer-deps
```

### 3. Configure local environment variables

Copy the provided template:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Fill `.env` with the Firebase Web app configuration shown under **Firebase Console → Project settings → General → Your apps → SDK setup and configuration**:

```dotenv
REACT_APP_API_KEY=your_firebase_api_key
REACT_APP_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_PROJECT_ID=your-project-id
REACT_APP_STORAGE_BUCKET=your-project.firebasestorage.app
REACT_APP_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_APP_ID=1:1234567890:web:abcdef123456
```

Create React App injects these values at build time. Restart the development server after changing them.

> `.env` and environment-specific local files are ignored by Git. Do not commit your local configuration. Firebase Web configuration identifies your project but does not replace Authentication and Firestore security rules.

### 4. Complete Firebase setup

#### Register a Web app

1. Open the [Firebase Console](https://console.firebase.google.com/).
2. Create or select a project.
3. Open **Project settings**.
4. Under **Your apps**, register a Web app.
5. Copy its configuration values into the local `.env` file.

#### Enable anonymous authentication

1. Open **Build → Authentication**.
2. Select **Get started** if Authentication is not configured.
3. Open **Sign-in method**.
4. Enable the **Anonymous** provider.

The application uses anonymous accounts so visitors can maintain their own saved-place collection without a registration form.

#### Create Cloud Firestore

1. Open **Build → Firestore Database**.
2. Select **Create database**.
3. Choose a region appropriate for the application.
4. Create the database, then publish the rules below.

#### Firestore security rules

The repository includes the same policy in `firestore.rules`. These rules require authentication and ensure users can access only favourites carrying their own UID:

```text
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /favourites/{docId} {
      allow create: if request.auth != null
                    && request.auth.uid == request.resource.data.uid;

      allow read, delete: if request.auth != null
                          && request.auth.uid == resource.data.uid;

      allow update: if request.auth != null
                    && request.auth.uid == resource.data.uid
                    && request.auth.uid == request.resource.data.uid;
    }
  }
}
```

Publish them either from **Firestore Database → Rules** in the Firebase Console or with the Firebase CLI:

```bash
npm install --global firebase-tools
firebase login
firebase init firestore
firebase deploy --only firestore:rules
```

When prompted during `firebase init firestore`, select the existing Firebase project and use `firestore.rules` as the rules file. Review the generated Firebase configuration before committing it.

### 5. Start the app

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000).

Browser geolocation normally requires a secure context. It works on `localhost`; deployed environments should use HTTPS.

## Available Commands

```bash
npm start        # Start the development server
npm run build    # Create an optimized production build
npm test         # Run tests in watch mode
```

## Production Build and Deployment

Create a production bundle:

```bash
npm run build
```

The optimized static output is written to `build/` and can be deployed to Firebase Hosting, Netlify, Vercel, Cloudflare Pages, or another static host.

Set every `REACT_APP_*` Firebase variable in the deployment provider before building. Because Create React App embeds environment variables during compilation, changing deployment variables requires a new build.

For Firebase Hosting:

```bash
firebase init hosting
firebase deploy --only hosting
```

Configure Hosting to serve `build` as the public directory and treat the project as a single-page application.

## Data and Privacy Notes

- Location search text and coordinates are sent to Open-Meteo.
- Browser geolocation is requested only through the browser permission flow.
- Current coordinates are sent to Open-Meteo and Nominatim when current-location weather is requested.
- Firebase creates an anonymous account and stores saved locations with that account's UID.
- Clearing browser storage or losing the anonymous Firebase identity may remove access to previously saved locations.

## Acknowledgements

- Weather and geocoding data: [Open-Meteo](https://open-meteo.com/)
- Reverse geocoding: [OpenStreetMap Nominatim](https://nominatim.org/)
- Animated weather artwork: [Meteocons by Bas Milius](https://meteocons.com/)

## License

No software license is currently included in this repository. Add a `LICENSE` file before distributing or accepting contributions under a specific license.
