# OTP Phone Verification App

A React Native (Expo) mobile app that verifies a user's phone number using a one-time password (OTP) sent by SMS, powered by **Firebase Phone Authentication**.

## Features

- Enter a phone number in international format (e.g. `+923001234567`)
- Request an OTP via SMS
- Enter the 6-digit OTP
- Verify the OTP and see a clear success or failure message
- Input validation, loading indicators and error handling
- Option to change the number and request a new OTP

## Tech Stack

- [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/) (development build)
- [React Native Firebase](https://rnfirebase.io/) (`@react-native-firebase/app`, `@react-native-firebase/auth`)
- Firebase Authentication (Phone provider)
- EAS Build for creating the Android development build

## How It Works

1. The user enters their phone number.
2. The app calls `auth().signInWithPhoneNumber(phone)`, and Firebase sends an SMS with a 6-digit code.
3. The user enters the code.
4. The app calls `confirmation.confirm(code)`. If the code is correct, the user is verified and a success message is shown. Otherwise an error message is displayed.

## Screenshots

| Enter phone number | Enter OTP | Success |
|---|---|---|
| ![Phone screen](screenshots/phone.png) | ![OTP screen](screenshots/otp.png) | ![Success screen](screenshots/success.png) |

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- A [Firebase](https://console.firebase.google.com) account
- A free [Expo](https://expo.dev) account
- An Android phone (or emulator)
- EAS CLI: `npm install -g eas-cli`

> **Note:** Firebase phone authentication needs native code, so it does **not** work in Expo Go. A development build is required.

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/otp-firebase.git
cd otp-firebase
npm install
```

### 2. Create a Firebase project

1. Go to the [Firebase Console](https://console.firebase.google.com) and create a project.
2. Open **Build → Authentication → Sign-in method** and enable **Phone**.
3. (Recommended for testing) Under **Phone → Phone numbers for testing**, add a test number and code, for example:
   - Number: `+92 300 1234567`
   - Code: `123456`

   Test numbers never send a real SMS and always accept the configured code.

### 3. Register the Android app

1. In **Project settings → Your apps**, add an Android app with the package name `com.yourname.otpapp` (it must match `android.package` in `app.json`).
2. Download `google-services.json` and place it in the **root** of the project.

> `google-services.json` is intentionally excluded from this repository via `.gitignore`. You must add your own.

### 4. Add SHA fingerprints

Android phone auth requires your app's signing fingerprints.

```bash
eas login
eas build:configure
eas credentials
```

Copy the **SHA-1** and **SHA-256** values into **Firebase → Project settings → Your apps → Add fingerprint**. Then re-download `google-services.json` and replace the old file.

### 5. Build the development app

```bash
eas build --profile development --platform android
```

When the build finishes, open the link or QR code on your Android phone, then download and install the APK.

### 6. Run the project

```bash
npx expo start --dev-client
```

Open the installed app on your phone. It connects to your dev server (phone and computer must be on the same Wi-Fi network).

## Testing the App

**Using a Firebase test number (no SMS needed):**

1. Enter the test number you added in Firebase.
2. Tap **Send OTP**.
3. Enter the configured code (e.g. `123456`) and tap **Verify OTP**.
4. A success message is displayed.

**Using a real number:**

1. Enter your phone number in international format (e.g. `+923001234567`, with no `0` after the country code).
2. Tap **Send OTP** and wait for the SMS.
3. Enter the code and tap **Verify OTP**.

## Project Structure

```
otp-firebase/
├── App.js                 # Main UI and OTP logic
├── app.json               # Expo configuration
├── eas.json               # EAS build profiles
├── google-services.json   # Firebase config (not committed, add your own)
├── package.json
└── README.md
```

## Troubleshooting

| Error | Cause and fix |
|---|---|
| `auth/missing-client-identifier` / `app-not-authorized` | SHA-1 and SHA-256 are missing in Firebase, or the app wasn't rebuilt after updating `google-services.json`. |
| `auth/invalid-phone-number` | Wrong number format. Use `+923001234567` and remove the leading `0`. |
| `auth/too-many-requests` | Rate limit reached. Wait a while, or use a Firebase test number. |
| SMS not received | Check **Authentication → Usage** in Firebase for daily limits, or use a test number. |

## Security Notes

- No secret keys are stored in the app code.
- `google-services.json` is excluded from version control.
- OTP generation, delivery and verification are handled by Firebase.
