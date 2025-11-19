# 🔧 UPDATE Google Apps Script - IMPORTANT!

**The web app is now sending customer name and mobile number, but your Google Apps Script needs to be updated to receive and store this data.**

---

## ⚠️ REQUIRED STEPS (Takes 5 minutes)

### Step 1: Open Your Google Apps Script
1. Go to your Google Sheet (the one logging spins)
2. Click **Extensions → Apps Script**
3. You'll see the current code

### Step 2: Replace the Code
1. **Select ALL existing code** (Ctrl+A)
2. **Delete it**
3. Copy the ENTIRE code from: `GoogleAppsScript.js` file in this project
4. **Paste it** into the Apps Script editor
5. Click **💾 Save**

### Step 3: Deploy Updated Version
1. Click **🔴 Deploy** button (top right)
2. Click the ⚙️ **gear icon** next to the deployment
3. Select your **existing deployment** (the one you already created)
4. Click **🔄 Redeploy**
5. Click **Authorize** when prompted
6. ✅ Done!

---

## ✅ What This Updates

### New Columns Added (Columns D & E):
- **Column D: Customer Name** - From the form input
- **Column E: Mobile Number** - From the +91 format input

### Existing Columns (Preserved):
- Timestamp, Date, Time
- Offer Text, Offer Description, Offer Code
- Device Type, Browser, Screen Size, User Agent

---

## 🧪 Test After Update

1. Go to: https://salon-offer-spin.netlify.app
2. Fill in name and mobile number in the form
3. Spin the wheel
4. **Check your Google Sheet** - you should now see:
   - Customer name in Column D
   - Mobile number in Column E
   - All other offer data as before

---

## ❓ Troubleshooting

**Still not seeing name & number?**

1. Check the deployment URL in **admin panel** still works
2. Open **browser console** (F12) and check for errors
3. Look for red error messages in Google Apps Script logs
4. Make sure you clicked "Authorize" when redeploying

**"Authorization required" error?**
- Go back to Apps Script
- Click Deploy > Select your deployment
- Check if it needs re-authorization

---

## 📍 Where to Find GoogleAppsScript.js

The updated code is in your project folder:
`/Game/GoogleAppsScript.js`

Copy the entire contents and paste into Apps Script editor.

---

**Let me know once you've updated it!** 🚀
