# GENIES - AI Tools Hub

**GENIES** is a full-stack web application built with Node.js, Express.js, MongoDB, and client-side technologies (HTML, CSS, JS, GSAP). It provides multiple AI tools including:

- **Text to Speech** using OpenAI API
- **AI Assistant** using OpenAI API
- **Image Generation** using Stability AI API
- **Translation** using DeepL API

## Features

- **User Authentication**: Create an account, log in, and securely manage your AI tool preferences.
- **AI Tools**: Easily access a variety of AI-powered functionalities.
- **User Friendly interface**: Client-side interactions are enhanced with GSAP (GreenSock Animation Platform).

## Installation & Setup

### Prerequisites
Make sure you have **Node.js** and **npm** installed on your machine.

### 1. Clone the repository

```bash
git clone https://github.com/ben4ali/Genies.git
cd genies
```

### 2. Install Dependencies
In the project directory, run the following command to install the necessary npm modules:

```bash
npm install
```
### 3. API Keys Setup
You need to add your API keys for OpenAI, Stability AI, and DeepL. Create a configuration file as follows:

- In config/params.js, add your API keys:

```javascript
//Insert your mongoDB connection string here
const DATABASE_CONNECTION = ""

//Api keys
const openAIKey = ""
const stabilityAiKey = ""
const deepLAPIKey = ""
```

### 4. Start the Application
To run the application using nodemon, simply use:

```bash
nodemon app
```

### 5. Access the App
Once the app is running, open your browser and go to http://localhost:3000.

### 6. Create an Account and Login
Before using the tools, you must:

- Sign Up: Create a new account.
- Login: Log in with your credentials to access the AI tools.

## Usage
Once logged in, you can start using the AI tools provided by GENIES:

- Text to Speech: Convert text into natural-sounding speech using the OpenAI API.
- AI Assistant: Interact with a conversational AI assistant powered by OpenAI.
- Image Generation: Generate images based on text prompts using Stability AI.
- Translation: Translate text between languages using DeepL.

## Technologies Used
- Backend: Node.js, Express.js
- Database: MongoDB
- Frontend: HTML, CSS, JavaScript
- Animations: GSAP (GreenSock Animation Platform)
- APIs:
  - OpenAI (Text to Speech, Assistant)
  - Stability AI (Image Generation)
  - DeepL (Translation)
 
## License
This project is licensed under the GNU General Public License v3.0. You are free to:
  - Use: You can use this software for personal and commercial purposes.
  - Modify: You can modify the source code to fit your needs.
  - Distribute: You can distribute this software, but any derivative work must also be open-sourced under the GPL v3.0 license.

## GPL License Summary
**GENIES** is free software: you can redistribute it and/or modify it under the terms of the **GNU General Public License** as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
