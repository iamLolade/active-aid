# ActiveAid Extension (MVP)

## Load unpacked (Chrome)
1. Open Chrome and go to `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select the `active-aid/extension` folder.

## Quick dev test
- Open any `https://` webpage and interact (mouse/keyboard) to generate activity.
- In the extension popup:
  - Set **Reminder interval** to `1` minute for quick testing.
  - Ensure **Enable reminders** is on.
- After roughly a minute of continuous activity, you should receive a reminder notification.

## Privacy
This MVP tracks **timing of activity signals only** (e.g., that *some* activity occurred), and does not log typed content, page content, screenshots, or camera data.

