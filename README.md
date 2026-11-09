# F1 Setup Coach

A native iPhone and Android app for **F1 24**. Pick a team, a circuit and the weather. Claude returns all 21 setup values, each with the reason behind it, and the app saves every result on your phone.

Built with Expo (React Native) and TypeScript. It calls Claude Opus 5.5 directly from the phone with your own Anthropic API key.

## How it works

1. **Setup tab**: choose team, track and weather.
2. The app looks for a saved copy of that combination on the phone. If there is one it opens instantly and costs nothing.
3. If not, it asks Claude once, checks every value against the game's real slider ranges, and saves the result.
4. **Saved tab** lists everything you have generated. **Settings** holds your API key.

Every value is shown on a gauge that mirrors the in-game slider, with a one to two sentence reason underneath so you can learn to adjust it by feel.

## Run it

```bash
npm install
npm test            # domain logic tests
npm run typecheck
npm run ios         # build and launch in the iOS Simulator
npm run android     # build and launch on an Android emulator or connected phone
```

Then open **Settings** in the app and paste your key from https://console.anthropic.com/settings/keys.

## Install it on your phone

The app uses native modules, so it cannot run in Expo Go. Build it once and it installs like any app.

### iPhone

1. Plug in the iPhone, unlock it, and turn on **Settings > Privacy & Security > Developer Mode**.
2. Run:
   ```bash
   npx expo run:ios --device --configuration Release
   ```
   Pick your iPhone when asked. The first run opens Xcode signing: choose your Apple ID as the team. A free Apple ID works, but the install expires after 7 days and you re-run the command. A paid Apple Developer account removes that limit.
3. On the phone, trust the developer under **Settings > General > VPN & Device Management**.

`--configuration Release` bundles the JavaScript into the app, so it runs without your computer nearby.

### Android

A ready-built 64-bit ARM release APK is at `dist/F1-Setup-Coach.apk`. It works on practically every current Android phone. It is signed with the standard debug key, which is fine for installing on your own phone but not for the Play Store.

**Option A: copy the file to the phone**

1. Move `F1-Setup-Coach.apk` to the phone (USB cable, Google Drive, email to yourself).
2. Open it on the phone. Android asks to allow installs from that app (Files, Drive or Chrome). Allow it, then tap **Install**.

**Option B: install over USB**

1. On the phone turn on **Developer options** and **USB debugging**, then plug it in and accept the prompt.
2. Run:
   ```bash
   adb install -r dist/F1-Setup-Coach.apk
   ```

**Rebuild the APK after changing code**

```bash
cd android && ./gradlew assembleRelease -PreactNativeArchitectures=arm64-v8a
cp app/build/outputs/apk/release/app-release.apk ../dist/F1-Setup-Coach.apk
```

The `android/` folder is generated from `app.json`. If it is missing, run `npx expo prebuild --platform android` first. The build needs Java 17 and the Android SDK.

**Add your key**

Open the app, go to the **Settings** tab, paste your Anthropic API key into **Anthropic API key**, and tap **Save key**.

## Where things live

| Path | What it holds |
| --- | --- |
| `src/domain/settings.ts` | The 21 settings and their slider ranges. Edit a range here if your game differs. Everything else reads from it. |
| `src/domain/prompt.ts` | The instructions sent to Claude, built from the table above. |
| `src/domain/normalize.ts` | Clamps and snaps Claude's numbers onto real slider steps. |
| `src/domain/records.ts` | The on-phone cache of generated setups. |
| `src/services/claude.ts` | The Claude API call (model, effort, error handling). |
| `src/data/` | The 10 teams, 24 circuits and 3 weather states. |
| `src/app/` | Screens (Expo Router). |

## Good to know

- **Cost.** Each new team, track and weather combination is one Claude Opus 5.5 request with high effort. Repeats are free because they come from the phone's cache. Regenerating asks Claude again.
- **Accuracy.** Claude knows how each setting behaves and the real circuits, but has no access to the game's lap times. Treat results as strong, explained starting points.
- **Your key.** It is stored in the iOS Keychain or Android Keystore and is sent only to Anthropic. Because the app has no server, anyone with your phone unlocked and the app open could use your credits. Set a spend limit on the key in the Anthropic Console.
- **Slider ranges** come from published F1 24 setup data. If the game shows a different range for a slider, change it in `src/domain/settings.ts`.
