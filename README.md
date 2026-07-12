# Weather Forecast App

A polished, responsive weather dashboard built with React and TypeScript. This app lets users search for locations worldwide, view live weather conditions, explore daily and hourly forecasts, switch unit systems, and save favourite places with Firebase.

## Overview

Weather Forecast App is a modern front-end project designed to make weather data simple, fast, and visually clear. It combines geolocation, location search, weather forecasting, and cloud-backed favourites into a single user-friendly experience.

## Features

- Search for any place in the world using an interactive location search bar
- Detect the user's current location with browser geolocation
- View current weather conditions, including temperature, humidity, precipitation, and wind
- Browse a 7-day forecast and inspect hourly details for any selected day
- Switch between metric and imperial units for temperature, wind speed, and precipitation
- Save favourite locations using Firebase Authentication and Firestore
- Enjoy a responsive layout that works well on desktop, tablet, and mobile screens
- Handle loading and error states gracefully for a smoother experience

## Tech Stack

- React.js
- TypeScript
- CSS3
- Firebase Authentication
- Cloud Firestore
- Open-Meteo API for weather and geocoding data
- React Select for searchable location dropdowns
- Zod for API response validation

## Project Structure

- src/components: UI components such as current conditions, daily forecast, hourly forecast, search form, sidebar, and footer
- src/context: global state for weather, units, and user information
- src/hooks: reusable hooks for fetching weather data, location data, Firestore collections, and custom context access
- src/firestore: Firebase configuration and initialization
- src/utilities: weather schemas and TypeScript types

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js (recommended: 18 or newer)
- npm or yarn

### Installation

Run these commands in your terminal

1. Clone the repository

   git clone https://github.com/ymk-coder-star/weather-app.git

   cd weather-app

2. Install dependencies

   npm install

   or

   yarn install

3. Start the development server

   npm start

   or

   yarn start

4. Open the app in your browser at

   http://localhost:3000

## How It Works

1. The app signs in the user anonymously through Firebase on load.
2. Users can either search for a location or use their current location.
3. Weather data is fetched from the Open-Meteo API and displayed in the main forecast view.
4. The user can toggle units and explore daily or hourly details.
5. Favourite locations are stored in Firestore and shown in the sidebar.

## Firebase Setup

This project uses Firebase for anonymous sign-in and saved favourites. Because the Firestore configuration file is private and not included in the GitHub repository, you will need to add your own Firebase setup locally.

To do that:

1. Create your own Firebase project in the Firebase console
2. Enable Anonymous Authentication
3. Enable Firestore Database
4. Add your own Firebase configuration in the app source file for your local environment

The app expects Firebase to be available for sign-in and storing favourite locations.

## Available Scripts

- npm start: starts the development server
- npm build: creates a production build
- npm test: runs the test suite

## Learning Notes

This project was built to strengthen skills in:

- React and TypeScript component architecture
- API integration and data validation
- State management with context
- Asynchronous data fetching and error handling
- Firebase authentication and cloud storage
- Building responsive user interfaces

## License

This project is open for learning and personal use.
