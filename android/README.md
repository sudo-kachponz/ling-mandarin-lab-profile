# Ling Reader — Android WebView app (FLAG_SECURE)

A thin native Android shell that loads the Ling Chinese Lab website inside a
`WebView` and adds the one thing a browser cannot: **`FLAG_SECURE`**, so
screenshots and screen-recording of the e-book come out **black** (like banking
apps). It is toggled **ON only in the reader (`/read...`)** — on the store the
buyer can still screenshot the QR / bank account to pay.

> Why a WebView app and not a TWA: a Trusted Web Activity renders content in
> Chrome, where `FLAG_SECURE` does not reliably block capture. A WebView renders
> in *our* window, so `FLAG_SECURE` works.

## What it does
- Loads `https://www.lingchineselab.com/` (change in `MainActivity.kt` →
  `START_URL` / `SITE_HOST`).
- `FLAG_SECURE` on reader pages → screenshot/record = black screen.
- Proof-of-payment upload works (`<input type=file>` → system picker).
- WhatsApp / `tel:` / external links open in their real apps.
- Hardware back navigates WebView history.

## Build (Android Studio — easiest)
1. Open the `android/` folder in **Android Studio** (Giraffe+). Let it sync
   Gradle (it downloads AGP 8.5 / Kotlin 1.9 and generates the Gradle wrapper).
2. Plug in a phone (USB debugging) or start an emulator.
3. **Run ▶** to install & launch, or **Build → Build APK(s)** for a shareable
   APK (`app/build/outputs/apk/release/app-release.apk`).

## Build (command line)
Requires JDK 17 + Android SDK, and a Gradle wrapper. If there's no
`gradlew` yet, generate it once (needs a local Gradle install):
```bash
cd android
gradle wrapper --gradle-version 8.7
./gradlew assembleRelease
```
APK: `app/build/outputs/apk/release/app-release.apk` (debug-signed → sideload OK;
add a real keystore before publishing to Play).

## Verify the screenshot block
Open the app → go to an e-book link (`/read/...`) → try to screenshot: the
capture is black. Go back to the store → screenshot works (QR is capturable).

## Not built/tested here
These files were scaffolded on a machine without the Android SDK, so they have
**not been compiled**. First Android Studio sync may prompt minor version bumps
— accept them.
