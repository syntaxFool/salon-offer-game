# 📊 Google Sheets Spin Logging - Quick Start

## ⚡ 5-Minute Setup

### Step 1: Create Google Sheet
1. Go to [sheets.google.com](https://sheets.google.com)
2. Create a new blank spreadsheet
3. Name it: **Salon Wheel Spin Logs**

### Step 2: Add Apps Script
1. In your sheet: **Extensions → Apps Script**
2. Delete existing code
3. Copy ALL code from `GoogleAppsScript.js` file
4. Paste into Apps Script editor
5. Click **💾 Save**

### Step 3: Deploy Web App
1. Click **Deploy → New deployment**
2. Click ⚙️ gear icon → Select **Web app**
3. Settings:
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy**
5. **Authorize** (click Allow)
6. **Copy the Web App URL** (ends with `/exec`)

### Step 4: Configure Admin Panel
1. Go to: https://salon-offer-spin.netlify.app/admin.html
2. Login: `salon2025`
3. Scroll to **Google Sheets Logging** section
4. Paste your Web App URL
5. Make sure **Enable Automatic Logging** is checked ✅
6. Click **💾 Save Configuration**

### Step 5: Test
1. Go to: https://salon-offer-spin.netlify.app
2. Spin the wheel
3. Check your Google Sheet - new row appears! 🎉

---

## 📋 What Gets Logged

Every spin automatically logs:
- ⏰ Timestamp (date & time)
- 🎁 Offer won (text & description)
- 🔑 Offer code generated
- 📱 Device type (Mobile/Desktop/Tablet)
- 🌐 Browser used
- 📐 Screen size
- 🔍 Full user agent

---

## 🔧 Troubleshooting

**Not logging?**
- ✓ Check Web App URL ends with `/exec`
- ✓ Verify URL saved in admin panel
- ✓ Ensure "Enable Automatic Logging" is checked
- ✓ Deployment set to "Anyone" can access

**Authorization error?**
- Redeploy the web app
- Make sure you clicked "Allow"

**Headers duplicated?**
- Normal - just delete extra rows manually

---

## 📊 Analytics Tips

Use your Google Sheet data to:
- Track most popular offers
- See peak usage times
- Analyze mobile vs desktop users
- Compare expected vs actual win rates
- Export to Excel/CSV for deeper analysis

---

**Need help?** Check `SETUP_INSTRUCTIONS.txt` for detailed guide.
