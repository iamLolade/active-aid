import { mkdir, readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

import sharp from "sharp"

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const projectDir = path.resolve(scriptDir, "..")
const sourceDir = path.join(projectDir, "public", "screenshots")
const screenshotOutputDir = path.join(projectDir, "public", "store", "screenshots")
const promoOutputDir = path.join(projectDir, "public", "store", "promos")

const WIDTH = 1280
const HEIGHT = 800
const SCREENSHOT_X = 760
const SCREENSHOT_Y = 40
const SCREENSHOT_WIDTH = 480
const SCREENSHOT_HEIGHT = 720

const slides = [
  {
    source: "today.png",
    output: "01-today.jpg",
    kicker: "TODAY",
    title: ["Gentle reminders.", "Quick relief."],
    body: [
      "Stay aware of active time and choose a short",
      "desk reset when you need one.",
    ],
  },
  {
    source: "check-in.png",
    output: "02-check-in.jpg",
    kicker: "DAILY CHECK-IN",
    title: ["A quick moment", "to check in."],
    body: [
      "Log how your body feels and optionally note",
      "the areas you want to keep track of.",
    ],
  },
  {
    source: "insight.png",
    output: "03-insights.jpg",
    kicker: "SIMPLE INSIGHTS",
    title: ["See your wellness", "habits over time."],
    body: [
      "Review breaks, relief sessions, estimated active",
      "time and check-in patterns from your local data.",
    ],
  },
  {
    source: "settings.png",
    output: "04-settings.jpg",
    kicker: "YOUR PREFERENCES",
    title: ["Reminders that", "work your way."],
    body: [
      "Choose your activity interval, pause reminders",
      "and stay in control of your data.",
    ],
  },
]

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
}

function textLines(lines, { x, y, size, lineHeight, weight, color }) {
  return lines
    .map(
      (line, index) =>
        `<text x="${x}" y="${y + index * lineHeight}" font-family="Arial, Helvetica, sans-serif" font-size="${size}" font-weight="${weight}" fill="${color}">${escapeXml(line)}</text>`,
    )
    .join("")
}

async function dataUri(filePath, mimeType) {
  const contents = await readFile(filePath)
  return `data:${mimeType};base64,${contents.toString("base64")}`
}

async function renderSlide(slide, logoUri) {
  const screenshotPath = path.join(sourceDir, slide.source)
  const screenshotUri = await dataUri(screenshotPath, "image/png")
  const outputPath = path.join(screenshotOutputDir, slide.output)
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
      <defs>
        <filter id="shadow" x="-30%" y="-20%" width="160%" height="160%">
          <feDropShadow dx="0" dy="14" stdDeviation="18" flood-color="#1f2937" flood-opacity="0.16"/>
        </filter>
        <clipPath id="screenClip">
          <rect x="${SCREENSHOT_X}" y="${SCREENSHOT_Y}" width="${SCREENSHOT_WIDTH}" height="${SCREENSHOT_HEIGHT}" rx="30"/>
        </clipPath>
      </defs>

      <rect width="${WIDTH}" height="${HEIGHT}" fill="#f6f3ec"/>
      <circle cx="1160" cy="92" r="240" fill="#e8f1e9"/>
      <circle cx="1030" cy="760" r="260" fill="#eef4ee"/>
      <path d="M0 690C175 628 350 650 535 800H0Z" fill="#edf3ed"/>

      <image href="${logoUri}" x="64" y="54" width="52" height="52"/>
      <text x="132" y="91" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="700" fill="#1f2937">ActiveAid</text>

      <rect x="64" y="174" width="210" height="42" rx="21" fill="#e5efe7"/>
      <text x="169" y="201" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="700" letter-spacing="1.8" fill="#397244">${escapeXml(slide.kicker)}</text>

      ${textLines(slide.title, {
        x: 64,
        y: 296,
        size: 58,
        lineHeight: 68,
        weight: 700,
        color: "#1f2937",
      })}
      ${textLines(slide.body, {
        x: 68,
        y: 468,
        size: 25,
        lineHeight: 38,
        weight: 400,
        color: "#586273",
      })}

      <path d="M68 600h64" stroke="#6a9d6e" stroke-width="6" stroke-linecap="round"/>
      <text x="68" y="654" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="700" fill="#397244">LOCAL-FIRST</text>
      <text x="68" y="688" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="400" fill="#586273">No account required to get started.</text>
      <text x="68" y="748" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="400" fill="#687283">Supports workplace wellness habits.</text>

      <rect x="${SCREENSHOT_X}" y="${SCREENSHOT_Y}" width="${SCREENSHOT_WIDTH}" height="${SCREENSHOT_HEIGHT}" rx="30" fill="#ffffff" filter="url(#shadow)"/>
      <image href="${screenshotUri}" x="${SCREENSHOT_X}" y="${SCREENSHOT_Y}" width="${SCREENSHOT_WIDTH}" height="${SCREENSHOT_HEIGHT}" preserveAspectRatio="xMidYMid slice" clip-path="url(#screenClip)"/>
      <rect x="${SCREENSHOT_X}" y="${SCREENSHOT_Y}" width="${SCREENSHOT_WIDTH}" height="${SCREENSHOT_HEIGHT}" rx="30" fill="none" stroke="#d4d9df" stroke-width="2"/>
    </svg>
  `

  await sharp(Buffer.from(svg))
    .flatten({ background: "#f6f3ec" })
    .jpeg({ quality: 95, chromaSubsampling: "4:4:4" })
    .toFile(outputPath)

  return outputPath
}

async function renderPromo({ width, height, output, svg }) {
  const outputPath = path.join(promoOutputDir, output)

  await sharp(Buffer.from(svg))
    .flatten({ background: "#2f6540" })
    .jpeg({ quality: 95, chromaSubsampling: "4:4:4" })
    .toFile(outputPath)

  console.log(`Wrote ${outputPath} (${width}x${height})`)
}

function smallPromoSvg(logoUri) {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="440" height="280" viewBox="0 0 440 280">
      <rect width="440" height="280" fill="#2f6540"/>
      <circle cx="425" cy="18" r="174" fill="#3d7950"/>
      <path d="M0 232C115 186 242 211 355 280H0Z" fill="#285738"/>
      <circle cx="370" cy="224" r="19" fill="#e5efe7" opacity=".92"/>
      <circle cx="416" cy="224" r="11" fill="#a9c8ac" opacity=".9"/>

      <image href="${logoUri}" x="42" y="42" width="74" height="74"/>
      <text x="136" y="92" font-family="Arial, Helvetica, sans-serif" font-size="42" font-weight="700" fill="#ffffff">ActiveAid</text>
      <text x="44" y="169" font-family="Arial, Helvetica, sans-serif" font-size="25" font-weight="400" fill="#edf4ed">Wellness while you work.</text>
      <path d="M44 207h62" stroke="#a9c8ac" stroke-width="6" stroke-linecap="round"/>
    </svg>
  `
}

function marqueePromoSvg(logoUri) {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="1400" height="560" viewBox="0 0 1400 560">
      <rect width="1400" height="560" fill="#2f6540"/>
      <circle cx="1320" cy="30" r="330" fill="#3d7950"/>
      <path d="M0 454C280 344 560 401 820 560H0Z" fill="#285738"/>
      <path d="M1040 560C1140 420 1265 385 1400 420V560Z" fill="#356f49"/>

      <image href="${logoUri}" x="112" y="154" width="126" height="126"/>
      <text x="274" y="238" font-family="Arial, Helvetica, sans-serif" font-size="80" font-weight="700" fill="#ffffff">ActiveAid</text>
      <text x="278" y="306" font-family="Arial, Helvetica, sans-serif" font-size="36" font-weight="400" fill="#edf4ed">Wellness while you work.</text>
      <path d="M280 361h86" stroke="#a9c8ac" stroke-width="8" stroke-linecap="round"/>

      <circle cx="930" cy="278" r="72" fill="#edf4ed"/>
      <g transform="translate(901 249) scale(2.4)" fill="none" stroke="#397244" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
      </g>

      <circle cx="1100" cy="278" r="72" fill="#edf4ed"/>
      <g transform="translate(1071 249) scale(2.4)" fill="none" stroke="#397244" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/>
      </g>

      <circle cx="1270" cy="278" r="72" fill="#edf4ed"/>
      <g transform="translate(1241 249) scale(2.4)" fill="none" stroke="#397244" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 20V10"/>
        <path d="M10 20V5"/>
        <path d="M16 20v-7"/>
        <path d="M22 20V3"/>
      </g>
    </svg>
  `
}

await mkdir(screenshotOutputDir, { recursive: true })
await mkdir(promoOutputDir, { recursive: true })
const logoUri = await dataUri(
  path.join(projectDir, "public", "activeaid-mark.svg"),
  "image/svg+xml",
)

for (const slide of slides) {
  const outputPath = await renderSlide(slide, logoUri)
  console.log(`Wrote ${outputPath}`)
}

await renderPromo({
  width: 440,
  height: 280,
  output: "small-promo.jpg",
  svg: smallPromoSvg(logoUri),
})
await renderPromo({
  width: 1400,
  height: 560,
  output: "marquee-promo.jpg",
  svg: marqueePromoSvg(logoUri),
})
