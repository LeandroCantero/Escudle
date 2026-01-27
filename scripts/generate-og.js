import path from 'path';
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_PATH = path.join(__dirname, '../public/og-image.png');
const LOGO_PATH = 'https://escudle.netlify.app/escudle-logo-v2.webp';

const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@700;900&family=Permanent+Marker&display=swap" rel="stylesheet">
    <style>
        body {
            margin: 0;
            padding: 0;
            width: 1200px;
            height: 630px;
            background-color: #15803d; /* Website Green */
            background-image: radial-gradient(#000000 1px, transparent 1px);
            background-size: 20px 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Outfit', sans-serif;
            overflow: hidden;
            border: 20px solid #000000;
            box-sizing: border-box;
        }

        .container {
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 40px;
            box-sizing: border-box;
        }

        .logo-container {
            display: flex;
            align-items: center;
            gap: 24px;
            margin-bottom: 20px;
            transform: rotate(-1deg);
        }

        .logo {
            height: 180px;
            width: auto;
            filter: drop-shadow(4px 4px 0px #000);
        }

        .title {
            font-family: 'Permanent Marker', cursive;
            font-size: 140px;
            color: #FFFFFF;
            margin: 0;
            text-transform: uppercase;
            letter-spacing: 4px;
            filter: drop-shadow(6px 6px 0px #000);
        }

        .subtitle {
            font-size: 48px;
            font-weight: 900;
            color: #000000;
            background: #FFFFFF;
            padding: 16px 32px;
            border: 5px solid #000000;
            box-shadow: 10px 10px 0px 0px #000000;
            transform: rotate(1deg);
            margin-top: 20px;
            max-width: 950px;
            text-transform: uppercase;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo-container">
            <img class="logo" src="${LOGO_PATH}" alt="Escudle Logo">
            <h1 class="title">Escudle</h1>
        </div>

        <div class="subtitle">
            Adiviná el escudo de fútbol
        </div>
    </div>
</body>
</html>
`;

async function generateOG() {
    console.log('Generating OG Image...');
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    // Set viewport to OG dimensions
    await page.setViewport({
        width: 1200,
        height: 630,
        deviceScaleFactor: 2 // High quality
    });

    // Set content
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    // Ensure fonts are loaded
    await page.evaluateHandle('document.fonts.ready');

    // Wait a bit more for font rendering
    await new Promise(r => setTimeout(r, 1000));

    // Capture screenshot
    await page.screenshot({
        path: OUTPUT_PATH,
        type: 'png'
    });

    await browser.close();
    console.log(`OG Image generated at: ${OUTPUT_PATH}`);
}

generateOG().catch(err => {
    console.error('Error generating OG image:', err);
    process.exit(1);
});
