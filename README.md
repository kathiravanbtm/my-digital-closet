# Digital Closet

## Description

**Digital Closet** is a React Native mobile application that allows users to manage their wardrobe digitally. The app enables users to upload images of their clothing, categorize them, and organize their closet. Users can track their worn items, create outfits, and easily browse through their wardrobe—all stored locally on the device.

This project was developed for the **FOSS Hackathon**, focusing on a seamless user experience without the need for an internet connection or authentication.

---

## Table of Contents
1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Installation](#installation)
4. [Usage](#usage)
5. [Project Structure](#project-structure)
6. [Contributing](#contributing)
7. [License](#license)

---

## Features

- **Add and Categorize Clothes**: Users can upload images of their clothes and categorize them (e.g., shirts, pants, dresses, etc.).
- **Create and Manage Outfits**: Mix and match items from the closet to create and save outfits.
- **Track Worn Items**: Keep a record of what has been worn to avoid repetition.
- **Offline Functionality**: All data is stored locally on the device using **AsyncStorage**, ensuring the app works offline.
- **Simple User Interface**: Clean and minimal design for easy interaction and management of the virtual closet.

---

## Tech Stack

- **Framework**: React Native
- **Storage**: AsyncStorage (for local data storage)
- **Libraries/Tools**:
  - React Navigation (for app navigation)
  - React Native Image Picker (for uploading clothing images)
  - Expo (for development and building the app)

---

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/[your-github-username]/digital-closet.git
   cd digital-closet
   ```

2. **Install Expo CLI (if not already installed)**:
   ```bash
   npm install -g expo-cli
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Run the app**:
   ```bash
   expo start
   ```
   
   If you have Expo Go installed on your device, you can scan the QR code to open the app.
   Alternatively, run the app on an Android/iOS emulator.

5. **Launch in Expo Go**:
   - Open the Expo Go app on your device and scan the QR code shown in the terminal after running `expo start`.

---

## Usage

1. Open the app on your device using Expo Go or an emulator.
2. Add clothing items by uploading images and categorizing them.
3. Create outfits by selecting items from your closet and saving them as combinations.
4. Track your wardrobe by viewing items you've worn and planning future outfits.
5. The app works offline by storing all data locally on your device.

---

## Project Structure

```
/digital-closet
├── /src
│   ├── /assets
│   │   └── images
│   ├── /components
│   │   ├── ClothingItem.js
│   │   ├── OutfitCard.js
│   │   └── ClosetItem.js
│   ├── /screens
│   │   ├── ClosetScreen.js
│   │   ├── OutfitScreen.js
│   ├── /utils
│   │   └── storage.js
├── App.js
├── app.json
├── package.json
├── /assets
│   └── logo.png
```

---

## Contributing

We welcome contributions! To contribute:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-branch
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m "Add new feature"
   ```
4. Push to your fork:
   ```bash
   git push origin feature-branch
   ```
5. Open a pull request.

Please ensure your code follows the style guide and is well-documented.

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.
