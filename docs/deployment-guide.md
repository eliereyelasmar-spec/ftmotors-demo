# Fast Track Motors - Deployment Guide

## Pre-Deployment Checklist

### Required Before Go-Live
- [ ] Client questionnaire completed
- [ ] Alert phone numbers collected
- [ ] Alert email addresses collected
- [ ] Calendar access confirmed (Google Calendar or other)
- [ ] CRM type identified (or decision to use HubSpot Free)

### Technical Requirements
- [ ] n8n instance running (cloud or local)
- [ ] Twilio account with phone number
- [ ] OpenAI API key
- [ ] Google Calendar OAuth credentials
- [ ] Retell AI account

---

## Step-by-Step Deployment

### Phase 1: Core Infrastructure (Day 1)

#### 1.1 Set Up n8n
```bash
# Option A: n8n Cloud (Recommended for production)
# Sign up at https://n8n.io/cloud

# Option B: Local n8n for demo
npx n8n

# Expose local n8n via tunnel
ngrok http 5678
# OR
cloudflared tunnel --url http://localhost:5678
```

#### 1.2 Import Workflows
1. Open n8n
2. Import these workflows in order:
   - `workflows/universal-lead-handler.json`
   - `workflows/appointment-reminders.json`
   - `voice-ai/n8n-workflow.json`

#### 1.3 Configure Environment Variables
Set these in n8n Settings > Variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `TWILIO_PHONE_NUMBER` | Your Twilio number | +1234567890 |
| `ALERT_PHONE_1` | Primary alert recipient | +1201XXXXXXX |
| `ALERT_PHONE_2` | Secondary (optional) | +1201XXXXXXX |
| `ALERT_EMAIL` | Email for lead alerts | sales@fasttrackmotors.com |
| `CRM_TYPE` | hubspot, dealercenter, or custom | hubspot |
| `GOOGLE_CALENDAR_ID` | Calendar email | calendar@gmail.com |

#### 1.4 Set Up Credentials
1. **Twilio**: Add Account SID + Auth Token
2. **Google Calendar**: OAuth2 connection
3. **OpenAI**: API Key
4. **HubSpot** (if using): API Key or OAuth

---

### Phase 2: Voice AI Setup (Day 1-2)

#### 2.1 Retell AI Configuration
1. Create account at [retell.ai](https://retell.ai)
2. Create new agent
3. Set webhook URL to: `https://your-n8n-url/webhook/ftm-voice-agent`
4. Copy the Voice AI prompt from `voice-ai/fast-track-motors-prompt.txt`
5. Configure voice settings (recommend: natural, friendly voice)

#### 2.2 Phone Number Setup
1. In Retell, purchase or port a phone number
2. Connect to your agent
3. Test with a call

#### 2.3 Calendar Integration
1. Create dedicated Google Calendar for appointments
2. Share with service account or OAuth
3. Update calendar ID in n8n workflow

---

### Phase 3: Forms Deployment (Day 2)

#### 3.1 Get Webhook URL
1. In n8n, open "Universal Lead Handler" workflow
2. Click the webhook node
3. Copy the Production URL
4. It will look like: `https://your-n8n.app/webhook/ftm-lead`

#### 3.2 Update Forms
Edit each form in `/forms/` and replace webhook URL:

```javascript
// Find this line in each form:
const webhookUrl = 'YOUR_N8N_WEBHOOK_URL';

// Replace with your actual URL:
const webhookUrl = 'https://your-n8n.app/webhook/ftm-lead';
```

Forms to update:
- [ ] `forms/vehicle-inquiry.html`
- [ ] `forms/test-drive.html`
- [ ] `forms/service-appointment.html`
- [ ] `forms/trade-in.html`
- [ ] `forms/financing-prequalification.html`

#### 3.3 Deploy Forms
Option A: **Embed on existing website**
```html
<iframe src="https://your-hosting.com/forms/vehicle-inquiry.html"
        width="100%" height="800" frameborder="0"></iframe>
```

Option B: **Host on Vercel/Netlify**
```bash
# Deploy entire /demo and /forms folders
vercel deploy
# or
netlify deploy
```

Option C: **Run locally for demo**
```bash
cd /home/asmar/Revion/Ftmotors
python -m http.server 8000
# Visit http://localhost:8000/forms/vehicle-inquiry.html
```

---

### Phase 4: CRM Configuration (Day 2-3)

#### If Using HubSpot:

1. **Create Account** (Free tier works)
   - https://www.hubspot.com/products/get-started

2. **Create Pipelines**
   - Go to Settings > Objects > Deals > Pipelines
   - Create "Vehicle Sales" pipeline with stages from `hubspot/sales-pipeline.json`
   - Create "Service Department" pipeline with stages from `hubspot/service-pipeline.json`

3. **Create Custom Properties**
   - Go to Settings > Properties
   - Create properties from `hubspot/custom-properties.json`

4. **Connect to n8n**
   - Create Private App in HubSpot
   - Copy API key
   - Add to n8n credentials

#### If Using DealerCenter/Frazer/Other:

1. Check if CRM has API or webhook support
2. Get API credentials
3. Update `CUSTOM_CRM_WEBHOOK` in n8n
4. Modify `custom-crm` node in Universal Lead Handler to match their API

#### If Using Spreadsheets:

1. Create Google Sheet with columns:
   - Timestamp, First Name, Last Name, Phone, Email, Lead Type, Vehicle, Budget, Priority, Source
2. Use Google Sheets integration or Apps Script webhook
3. Set `GOOGLE_SHEETS_WEBHOOK` environment variable

---

### Phase 5: Testing (Day 3)

#### 5.1 Form Tests
- [ ] Submit vehicle inquiry → Check SMS + Email received
- [ ] Submit test drive request → Check SMS + Email + Calendar
- [ ] Submit service appointment → Check notifications
- [ ] Submit trade-in request → Check notifications
- [ ] Submit financing form → Check notifications + priority flag

#### 5.2 Voice AI Tests
- [ ] Call during business hours → Should offer to book appointment
- [ ] Call after hours → Should capture lead + text team
- [ ] Request test drive → Should check calendar + book
- [ ] Ask about financing → Should respond correctly
- [ ] Ask for transfer → Should handle gracefully

#### 5.3 End-to-End Tests
- [ ] Lead captured → Shows in CRM within 1 minute
- [ ] Appointment booked → Shows in calendar
- [ ] 24-hour reminder → Sent correctly
- [ ] 1-hour reminder → Sent correctly

---

### Phase 6: Go-Live

#### 6.1 Final Checks
- [ ] All workflows activated in n8n
- [ ] Voice AI agent active in Retell
- [ ] Phone number live and routing to agent
- [ ] Forms deployed and accessible
- [ ] CRM connected and receiving leads

#### 6.2 Soft Launch
1. Team tests internally for 24-48 hours
2. Monitor for any errors in n8n executions
3. Check all notifications arriving correctly

#### 6.3 Full Launch
1. Update website with new forms (if not already)
2. Start routing calls to AI number
3. Monitor first 10 calls closely
4. Daily check-in for first week

---

## Post-Launch Optimization

### Week 1
- Review all AI call transcripts
- Adjust scripts based on common questions
- Fine-tune lead scoring

### Week 2-4
- Analyze conversion metrics
- Optimize follow-up sequences
- Add any missing FAQ responses

### Monthly
- Review ROI metrics
- Optimize based on data
- Add new automation as needed

---

## Troubleshooting

### Forms Not Submitting
1. Check webhook URL is correct
2. Check n8n workflow is active
3. Check browser console for errors

### SMS Not Sending
1. Verify Twilio credentials
2. Check phone number format (+1XXXXXXXXXX)
3. Check Twilio account balance

### Voice AI Issues
1. Check Retell webhook URL matches n8n
2. Verify n8n workflow is active
3. Check OpenAI API key is valid
4. Review Retell dashboard for errors

### Calendar Not Updating
1. Verify Google Calendar OAuth is connected
2. Check calendar ID is correct
3. Ensure calendar is shared with service account

---

## Support Contacts

- **Technical Issues**: [Your support contact]
- **Retell AI**: support@retell.ai
- **n8n**: community.n8n.io
- **Twilio**: twilio.com/help

---

## Environment Variables Reference

```env
# Required
TWILIO_PHONE_NUMBER=+1234567890
TWILIO_ACCOUNT_SID=ACxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxx
ALERT_PHONE_1=+1201XXXXXXX
ALERT_EMAIL=sales@fasttrackmotors.com
OPENAI_API_KEY=sk-xxxxxxxxxx
GOOGLE_CALENDAR_ID=calendar@gmail.com

# Optional
ALERT_PHONE_2=+1201XXXXXXX
ALERT_PHONE_3=+1201XXXXXXX
CRM_TYPE=hubspot
HUBSPOT_API_KEY=xxxxxxxxxx
CUSTOM_CRM_WEBHOOK=https://api.dealercenter.com/webhook
GOOGLE_SHEETS_WEBHOOK=https://script.google.com/xxxxx
```
