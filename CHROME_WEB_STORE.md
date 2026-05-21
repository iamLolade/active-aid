# Chrome Web Store publishing guide (ActiveAid)

This is the standard path for letting normal users install the extension without Developer mode.

## Overview
- **You publish once** (public or unlisted).
- **Users install from the listing** (“Add to Chrome”).
- **Updates are automatic** after you push new versions.

Deploying the website does **not** publish the extension.

## 1. Prerequisites
- A Google account for the publisher
- Chrome Web Store Developer account (one-time registration fee)
- A production-ready extension package (MV3)

## 2. Package the extension
From the repo root:

```bash
npm run package:extension
```

This creates:
- `dist/activeaid-extension.zip`

## 3. Prepare store assets
Typical requirements:
- **Icons** (you already have): 16 / 32 / 48 / 128
- **Screenshots**: capture a few key screens (Today, Quick relief, Check-in, Insights)
- **Promotional images**: depending on listing type/placement

Tip: keep screenshots clean and readable; avoid tiny text.

## 4. Create a new item in the Web Store Developer Dashboard
In the Chrome Web Store Developer Dashboard:
- Create a **new item**
- Upload `dist/activeaid-extension.zip`

Then fill out the listing:
- Name, short description, detailed description
- Category
- Support URL / privacy policy URL (if needed)
- Screenshots and icons

## 5. Privacy disclosures
Be consistent with our product behavior:
- We do **not** collect typed content
- We do **not** capture screenshots or camera data
- We track **activity timing** and store wellness logs locally by default

If you later add backend sync, update disclosures accordingly.

## 6. Distribution options
- **Public**: searchable and discoverable
- **Unlisted**: not searchable; anyone with the link can install

For early adoption, **Unlisted** is often ideal.

## 7. Review and publish
Submit for review. Review times vary.

After approval:
- Share the listing URL
- Users can install normally with one click

## 8. Updates
When you ship a change:
1. Increment `version` in `extension/manifest.json`
2. Re-package (`npm run package:extension`)
3. Upload the new zip version in the dashboard

