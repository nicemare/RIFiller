# Random Identity Filler - Chrome Extension

Chrome extension to fill forms with random identity data from API-Ninjas.

## Setup

### Optional: Add Icons
Create `icons/` folder with three PNG files (or skip this step):
- `icon16.png` - 16x16 pixels
- `icon48.png` - 48x48 pixels  
- `icon128.png` - 128x128 pixels

1. **Get API Key**
   - Go to https://api-ninjas.com/
   - Sign up for a free account
   - Get your API key from the dashboard

2. **Install Extension**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `extension` folder

3. **Configure**
   - Click the extension icon in Chrome toolbar
   - Enter your API-Ninjas API key
   - Click "Save API Key"

## Usage

1. Navigate to any form page
2. Click the extension icon
3. Click "Fill Form with Random Identity"
4. The form will be populated with random user data

## Fields Supported

- Name (first, last, full)
- Email
- Phone number
- Address, City, State, ZIP
- Country
- Username
- Password
- Gender (select fields)

## Files

- `manifest.json` - Extension configuration
- `popup.html/js` - Extension popup UI
- `content.js` - Form filling logic

## API

Uses https://api-ninjas.com/api/randomuser endpoint.
# RIFiller
