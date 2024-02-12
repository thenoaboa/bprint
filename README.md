# Blueprint Interactive Viewer

## Overview
Blueprint Interactive Viewer is a dynamic tool designed to revolutionize the way blueprints and detailed schematics are interacted with and understood. Developed by Merced and Noah, this application allows users to upload images of blueprints or items, providing a user-friendly interface to place interactive buttons on various parts of the uploaded image. Clicking these buttons reveals detailed information about the specific components, ranging from major parts used in large machinery to minor elements like small screws.

Beyond merely offering insights into projects and their components, Blueprint Interactive Viewer facilitates a deeper understanding of assembly processes, component functions, and overall project layout. It serves as an invaluable resource for engineers, architects, hobbyists, and anyone in need of detailed project schematics.

## Features
- **Image Upload:** Users can upload images of blueprints or schematics for interactive viewing.
- **Interactive Buttons:** Place custom buttons on specific parts of the blueprint to denote different components.
- **Detailed Descriptions:** Clicking a button provides detailed information about that component, including its use, specifications, and assembly instructions.
- **Blueprint Download:** Offers the ability to download blueprints for offline viewing, making it perfect for on-site visits and fieldwork.
- **User-Friendly Interface:** Designed with simplicity in mind, ensuring ease of use for all skill levels.

## Getting Started

### Prerequisites
A modern web browser or a compatible device for running the application.

### Installation
This section will be updated with installation instructions once the application is ready for deployment.

### `npm start`
Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

## Usage
1. **Upload a Blueprint:** Start by uploading an image of your blueprint to the application.
2. **Add Interactive Buttons:** Place buttons on significant components or sections of the blueprint.
3. **Input Descriptions:** For each button, add a detailed description of the component it represents.
4. **Explore:** Click on the buttons to view component details or download the blueprint for external use.

## Current File Structure
Bprint
├── blueprint\
│   ├── node_modules\
│   │   └── Alot of folders...
│   ├── public\
│   │   ├── Edit.png
│   │   ├── favicon.ico
│   │   ├── IB_Icon.png
│   │   ├── index.html
│   │   ├── interactive_blueprint_logo.png
│   │   ├── manifest.json
│   │   └── robot.txt
│   ├── src\
│   │   ├── components\
│   │   │   ├── CreateProject\
│   │   │   │   ├── CreateProject.css
│   │   │   │   └── CreateProject.js
│   │   │   ├── HomePage\
│   │   │   │   ├── HomePage.css
│   │   │   │   └── HomePage.js
│   │   │   ├── Login\
│   │   │   │   ├── IB_Icon.png
│   │   │   │   ├── Login.css
│   │   │   │   └── Login.js
│   │   │   ├── ProjectsPage\
│   │   │   │   ├── ProjectsPage.css
│   │   │   │   └── ProjectsPage.js
│   │   │   ├── SignUp\
│   │   │   │   ├── IB_Icon.png
│   │   │   │   ├── SignUp.css
│   │   │   │   └── SignUp.js
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── App.test.js
│   │   ├── index.css
│   │   ├── index.js
│   │   ├── logo.svg
│   │   ├── reportWebVitals.js
│   │   └── setupTest.js
│   ├── .gitignore
│   ├── package-lock.json
│   └── package.json
└── README.md