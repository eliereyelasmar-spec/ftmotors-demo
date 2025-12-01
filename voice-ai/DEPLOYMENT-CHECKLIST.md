# Fast Track Motors - Production Workflow Deployment Checklist

**Workflow:** Voice AI Booking Agent (Production Version)
**File:** `n8n-workflow-production.json`
**Estimated Time:** 2-3 hours

---

## PRE-DEPLOYMENT SETUP

### 1. Create Google Sheets Call Log (15 min)

- [ ] Create new Google Sheet: "FTM Voice AI - Call Logs"
- [ ] Create tab named exactly: **"Call Logs"**
- [ ] Add these column headers (exact spelling):
  ```
  timestamp | call_id | from_number | call_status | transcript_length | ai_response | booking_made | hubspot_contact_id | errors
  ```
- [ ] Share sheet with n8n service account email
- [ ] Copy Sheet ID from URL (between `/d/` and `/edit`)
- [ ] **Save Sheet ID:** _____________________________

### 2. Set Up Slack Webhooks (10 min)

- [ ] Go to Slack: [Your Workspace] → Apps → Incoming Webhooks
- [ ] Create webhook for **#sales-alerts** (booking notifications)
  - [ ] **Save Webhook URL 1:** _____________________________
- [ ] Create webhook for **#automation-errors** (error alerts)
  - [ ] **Save Webhook URL 2:** _____________________________
- [ ] Test both webhooks with curl:
  ```bash
  curl -X POST -H 'Content-type: application/json' \
  --data '{"text":"Test notification from FTM Voice AI"}' \
  YOUR_WEBHOOK_URL
  ```

### 3. Configure HubSpot Custom Properties (15 min)

- [ ] Go to HubSpot: Settings → Properties → Contact Properties
- [ ] Create properties (if don't exist):
  - [ ] **lead_source** (Single-line text)
  - [ ] **last_call_timestamp** (Date picker)
  - [ ] **call_id** (Single-line text)
- [ ] Go to HubSpot: Settings → Properties → Deal Properties
- [ ] Create property:
  - [ ] **appointment_booked** (Single checkbox)
- [ ] Note your HubSpot Portal ID: Settings → Account Defaults
  - [ ] **Save Portal ID:** _____________________________

### 4. Get Google Calendar ID (5 min)

- [ ] Go to Google Calendar (as Fast Track Motors account)
- [ ] Find the calendar for appointments (e.g., "FTM Appointments")
- [ ] Click ⋮ next to calendar → Settings and sharing
- [ ] Scroll to "Integrate calendar"
- [ ] **Save Calendar ID:** _____________________________

---

## N8N WORKFLOW IMPORT

### 5. Import Production Workflow (10 min)

- [ ] Open n8n instance
- [ ] Go to Workflows → ⋮ (three dots menu) → Import from File
- [ ] Select: `/home/asmar/Revion/Ftmotors/voice-ai/n8n-workflow-production.json`
- [ ] Workflow imported successfully (should see "FTM - Voice AI Booking Agent (PRODUCTION)")

### 6. Configure n8n Credentials (30 min)

**OpenAI API:**
- [ ] Go to n8n: Credentials → Add Credential → OpenAI API
- [ ] Name: "OpenAI API"
- [ ] Paste API key from https://platform.openai.com/api-keys
- [ ] Test connection
- [ ] **Save Credential ID:** _____________________________

**Google Calendar OAuth2:**
- [ ] Go to n8n: Credentials → Add Credential → Google Calendar OAuth2 API
- [ ] Name: "Google Calendar - Fast Track Motors"
- [ ] Click "Sign in with Google"
- [ ] Authenticate with FTM Google account
- [ ] Grant calendar permissions
- [ ] **Save Credential ID:** _____________________________

**HubSpot API:**
- [ ] Go to HubSpot: Settings → Integrations → Private Apps → Create
- [ ] Name: "n8n Voice AI Integration"
- [ ] Required Scopes:
  - [ ] `crm.objects.contacts.read`
  - [ ] `crm.objects.contacts.write`
  - [ ] `crm.objects.deals.read`
  - [ ] `crm.objects.deals.write`
  - [ ] `crm.schemas.contacts.read`
- [ ] Generate token → Copy token
- [ ] Go to n8n: Credentials → Add Credential → HubSpot API
- [ ] Name: "HubSpot - Fast Track Motors"
- [ ] Paste token
- [ ] **Save Credential ID:** _____________________________

**Google Sheets OAuth2:**
- [ ] Go to n8n: Credentials → Add Credential → Google Sheets OAuth2 API
- [ ] Name: "Google Sheets - FTM Call Logs"
- [ ] Click "Sign in with Google"
- [ ] Authenticate with account that has access to call log sheet
- [ ] Grant sheets permissions
- [ ] **Save Credential ID:** _____________________________

### 7. Update Workflow Configuration (20 min)

Open the imported workflow and update each node:

**Node: OpenAI Chat Model (GPT-4.1-mini)**
- [ ] Click node → Credentials → Select your "OpenAI API" credential

**Node: Get many events in Google Calendar**
- [ ] Click node → Credentials → Select "Google Calendar - Fast Track Motors"
- [ ] Calendar field → Select/enter your Calendar ID from step 4

**Node: Create an event in Google Calendar**
- [ ] Click node → Credentials → Select "Google Calendar - Fast Track Motors"
- [ ] Calendar field → Select/enter your Calendar ID from step 4

**Node: Delete an event in Google Calendar**
- [ ] Click node → Credentials → Select "Google Calendar - Fast Track Motors"
- [ ] Calendar field → Select/enter your Calendar ID from step 4

**Node: Create/Update HubSpot Contact**
- [ ] Click node → Credentials → Select "HubSpot - Fast Track Motors"

**Node: Log Transcript to HubSpot**
- [ ] Click node → Credentials → Select "HubSpot - Fast Track Motors"

**Node: Create HubSpot Deal**
- [ ] Click node → Credentials → Select "HubSpot - Fast Track Motors"

**Node: Slack Notification (Booking Alert)**
- [ ] Click node → URL field
- [ ] Paste Webhook URL 1 (sales alerts) from step 2
- [ ] Update portal ID in body parameter (YOUR_PORTAL_ID)

**Node: Slack Error Alert**
- [ ] Click node → URL field
- [ ] Paste Webhook URL 2 (error alerts) from step 2

**Node: Log to Google Sheets (Call History)**
- [ ] Click node → Credentials → Select "Google Sheets - FTM Call Logs"
- [ ] Spreadsheet ID → Paste Sheet ID from step 1
- [ ] Sheet Name → Verify it says "Call Logs"

---

## TESTING

### 8. Manual Test Execution (20 min)

**Test 1: Webhook Structure Test**
- [ ] Click "Retell Webhook" node
- [ ] Click "Listen for Test Event"
- [ ] Use Postman/curl to POST test data:
  ```json
  {
    "body": {
      "call": {
        "call_id": "test-123",
        "transcript": "I'd like to book a test drive for tomorrow at 2 PM",
        "from_number": "+12015551234",
        "call_status": "in_progress"
      }
    }
  }
  ```
- [ ] Verify workflow executes without errors
- [ ] Check Google Sheets → new row appeared
- [ ] Check HubSpot → contact created
- [ ] Check Slack → received test notification (if booking confirmed)

**Test 2: Calendar Integration Test**
- [ ] Manually trigger workflow with test payload that asks for available times
- [ ] Verify AI returns available slots
- [ ] Verify no errors in execution log

**Test 3: Security Test**
- [ ] POST to webhook without "Retell" in User-Agent header
- [ ] Verify workflow returns 403 Forbidden
- [ ] Verify no execution in history

### 9. Live Call Test (15 min)

- [ ] Activate workflow (toggle "Active" switch)
- [ ] Copy production webhook URL (should be like `https://your-n8n.com/webhook/ftm-voice-agent`)
- [ ] Save webhook URL: _____________________________
- [ ] Configure Retell AI agent (next step)

---

## RETELL AI CONFIGURATION

### 10. Connect Retell to n8n (10 min)

- [ ] Log in to Retell AI dashboard
- [ ] Navigate to your Fast Track Motors agent
- [ ] Backend Configuration:
  - [ ] Set "Backend URL" to webhook URL from step 9
  - [ ] Set "Request Method" to POST
  - [ ] Add custom header: `User-Agent: Retell-AI-Webhook`
- [ ] Save agent configuration
- [ ] Test call to Retell phone number
- [ ] Verify in n8n: Executions → see new execution
- [ ] Verify in Google Sheets: new row with call data
- [ ] Verify in HubSpot: new contact created

---

## VALIDATION TESTS

### 11. End-to-End Validation (30 min)

Run these scenarios by calling the Retell phone number:

**Test Case 1: Happy Path - Book Appointment**
- [ ] Call: "I want to book a test drive for tomorrow at 2 PM"
- [ ] Verify: AI checks availability
- [ ] Verify: AI confirms booking
- [ ] Verify: Event appears in Google Calendar
- [ ] Verify: HubSpot contact created
- [ ] Verify: HubSpot deal created (stage: appointmentscheduled)
- [ ] Verify: Transcript logged in HubSpot as Note
- [ ] Verify: Slack notification received in #sales-alerts
- [ ] Verify: Google Sheets log entry

**Test Case 2: Time Conflict**
- [ ] Book a time slot manually in Google Calendar
- [ ] Call: Request that same time slot
- [ ] Verify: AI says time unavailable
- [ ] Verify: AI offers alternative times
- [ ] Verify: No duplicate booking created

**Test Case 3: Cancellation**
- [ ] Call: "I need to cancel my appointment tomorrow at 2 PM"
- [ ] Verify: AI confirms cancellation
- [ ] Verify: Event deleted from Google Calendar
- [ ] Verify: Call logged in Google Sheets

**Test Case 4: Outside Business Hours**
- [ ] Call: "I want to book for Sunday at 10 AM"
- [ ] Verify: AI explains dealership closed on Sunday
- [ ] Verify: AI offers Monday alternative

**Test Case 5: Rescheduling**
- [ ] Call: "I need to reschedule my appointment from 2 PM to 4 PM tomorrow"
- [ ] Verify: AI checks new time availability
- [ ] Verify: AI confirms reschedule
- [ ] Verify: Old event deleted, new event created
- [ ] Verify: Both actions logged

---

## POST-DEPLOYMENT MONITORING

### 12. Set Up Ongoing Monitoring (10 min)

**Daily:**
- [ ] Check Slack #automation-errors channel each morning
- [ ] Review Google Sheets call log for anomalies

**Weekly:**
- [ ] Review booking conversion rate (bookings / total calls)
- [ ] Check for any double-booking incidents
- [ ] Audit HubSpot deals created via Voice AI

**Monthly:**
- [ ] Review OpenAI API costs: https://platform.openai.com/usage
- [ ] Analyze call transcript themes
- [ ] Update AI prompt if needed based on patterns

### 13. Documentation (5 min)

- [ ] Add webhook URL to team password manager
- [ ] Add n8n workflow link to internal wiki
- [ ] Train sales team on how to review Voice AI leads in HubSpot
- [ ] Schedule first review meeting (1 week after deployment)

---

## ROLLBACK PLAN (IF NEEDED)

If production workflow has critical issues:

1. [ ] Deactivate workflow in n8n (toggle "Active" off)
2. [ ] Revert Retell AI agent to previous backend URL
3. [ ] Check n8n execution logs to identify error
4. [ ] Post in Slack #automation-errors with details
5. [ ] Contact Revion support: [support contact]

---

## COMPLETION SIGN-OFF

**Deployed By:** _____________________________
**Date:** _____________________________
**Time:** _____________________________

**Test Results:**
- [ ] All 5 validation test cases passed
- [ ] No errors in n8n execution log
- [ ] HubSpot integration verified
- [ ] Google Calendar sync confirmed
- [ ] Slack notifications working
- [ ] Google Sheets logging operational

**Production Status:** ☐ APPROVED  ☐ ISSUES (describe below)

**Notes:**
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________

---

## SUPPORT CONTACTS

**Technical Issues:**
- n8n Executions Log: [Your n8n URL]/workflows → FTM Voice AI → Executions
- Revion Support: [support email/phone]

**Emergency Escalation:**
- Critical errors (workflow down): [on-call engineer contact]
- After-hours support: [emergency contact]

---

**Prepared by:** Revion Consulting - Automation Architecture
**Version:** 1.0
**Last Updated:** 2025-12-01
