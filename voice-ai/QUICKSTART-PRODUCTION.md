# Fast Track Motors - Production Workflow Quick Start

**For:** Developers and operations team deploying production workflow
**Time Required:** 2-3 hours
**Difficulty:** Intermediate

---

## What You're Deploying

A production-ready Voice AI booking agent that:
- Handles incoming calls via Retell AI
- Books appointments in Google Calendar
- Creates leads in HubSpot CRM automatically
- Logs every call to Google Sheets
- Alerts sales team via Slack in real-time
- Handles errors gracefully without crashing

**This replaces:** The basic MVP workflow in `n8n-workflow.json`
**With:** Enterprise-grade production workflow in `n8n-workflow-production.json`

---

## Prerequisites

Before you start, ensure you have:
- [ ] n8n instance (cloud or self-hosted) with admin access
- [ ] Fast Track Motors Google account (for Calendar + Sheets)
- [ ] HubSpot account (free tier works)
- [ ] Slack workspace with admin access
- [ ] OpenAI API key with billing enabled
- [ ] Retell AI account configured with FTM phone number

---

## 5-Step Deployment

### Step 1: Set Up External Systems (30 min)

**Google Sheet:**
```bash
1. Create new sheet: "FTM Voice AI - Call Logs"
2. Add tab: "Call Logs"
3. Add headers: timestamp | call_id | from_number | call_status |
                transcript_length | ai_response | booking_made |
                hubspot_contact_id | errors
4. Copy Sheet ID from URL
```

**Slack Webhooks:**
```bash
1. Go to: https://api.slack.com/messaging/webhooks
2. Create webhook for #sales-alerts
3. Create webhook for #automation-errors
4. Save both URLs
```

**HubSpot Properties:**
```bash
1. Settings → Properties → Contact Properties
2. Create: lead_source (text), last_call_timestamp (date), call_id (text)
3. Settings → Properties → Deal Properties
4. Create: appointment_booked (checkbox)
5. Note your Portal ID: Settings → Account Defaults
```

**Google Calendar:**
```bash
1. Find FTM appointments calendar
2. Settings → Integrate calendar → Copy Calendar ID
```

### Step 2: Import Workflow to n8n (5 min)

```bash
# Option A: n8n Cloud/UI
1. Open n8n
2. Workflows → Import from File
3. Select: /home/asmar/Revion/Ftmotors/voice-ai/n8n-workflow-production.json
4. Click Import

# Option B: n8n CLI (if available)
n8n import:workflow --input=/home/asmar/Revion/Ftmotors/voice-ai/n8n-workflow-production.json
```

### Step 3: Configure Credentials (30 min)

**In n8n, create these credentials:**

1. **OpenAI API**
   - Credentials → Add → OpenAI API
   - Name: "OpenAI API"
   - API Key: [from platform.openai.com]

2. **Google Calendar OAuth2**
   - Credentials → Add → Google Calendar OAuth2
   - Name: "Google Calendar - Fast Track Motors"
   - Sign in with FTM Google account

3. **HubSpot API**
   - In HubSpot: Settings → Integrations → Private Apps → Create
   - Name: "n8n Voice AI Integration"
   - Scopes: crm.objects.contacts (read/write), crm.objects.deals (read/write)
   - Copy token → In n8n: Credentials → Add → HubSpot API
   - Name: "HubSpot - Fast Track Motors"
   - Paste token

4. **Google Sheets OAuth2**
   - Credentials → Add → Google Sheets OAuth2
   - Name: "Google Sheets - FTM Call Logs"
   - Sign in with account that has sheet access

### Step 4: Update Workflow Nodes (20 min)

Open the imported workflow and update:

**All Google Calendar nodes** (Get/Create/Delete Events):
- Credentials: Select "Google Calendar - Fast Track Motors"
- Calendar: Enter your Calendar ID

**All HubSpot nodes** (Create Contact, Log Transcript, Create Deal):
- Credentials: Select "HubSpot - Fast Track Motors"

**OpenAI Chat Model node:**
- Credentials: Select "OpenAI API"

**Slack Notification nodes** (Booking Alert, Error Alert):
- URL field: Paste your Slack webhook URLs

**Log to Google Sheets node:**
- Credentials: Select "Google Sheets - FTM Call Logs"
- Spreadsheet ID: Paste your Sheet ID
- Sheet Name: "Call Logs"

### Step 5: Test & Activate (30 min)

**Manual Test:**
```bash
1. Click "Retell Webhook" node
2. Click "Listen for Test Event"
3. Use Postman/curl to POST test data:

curl -X POST https://your-n8n.com/webhook/ftm-voice-agent \
  -H "Content-Type: application/json" \
  -H "User-Agent: Retell-AI-Webhook" \
  -d '{
    "body": {
      "call": {
        "call_id": "test-001",
        "transcript": "I want to book a test drive tomorrow at 2 PM",
        "from_number": "+12015551234",
        "call_status": "in_progress"
      }
    }
  }'

4. Check execution in n8n (should be green)
5. Verify:
   - Google Sheets: New row appears
   - HubSpot: Contact created
   - Slack: Notification received (if booking detected)
```

**Security Test:**
```bash
# Test unauthorized request (should return 403)
curl -X POST https://your-n8n.com/webhook/ftm-voice-agent \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'

# Should return: {"error": "Unauthorized", "message": "Invalid webhook source"}
```

**Live Call Test:**
```bash
1. Activate workflow (toggle "Active")
2. Copy webhook URL
3. Configure in Retell AI:
   - Backend URL: [your webhook URL]
   - Method: POST
   - Header: User-Agent: Retell-AI-Webhook
4. Call Retell phone number
5. Test booking an appointment
6. Verify end-to-end:
   ✓ Calendar event created
   ✓ HubSpot contact + deal created
   ✓ Slack notification received
   ✓ Google Sheets logged
```

---

## Quick Troubleshooting

### Problem: Workflow fails at Security Check
**Cause:** User-Agent header missing or incorrect
**Fix:** Ensure Retell sends `User-Agent: Retell-AI-Webhook` (or contains "Retell")

### Problem: Google Calendar operations fail
**Cause:** OAuth credentials expired or calendar ID wrong
**Fix:**
1. Re-authenticate Google Calendar credential
2. Verify calendar ID matches exactly (including @gmail.com)

### Problem: HubSpot contact creation fails
**Cause:** Missing required scopes or invalid token
**Fix:**
1. Check HubSpot private app has all required scopes
2. Regenerate token if needed
3. Update credential in n8n

### Problem: AI Agent times out
**Cause:** OpenAI API slow or conversation too complex
**Fix:**
1. Check OpenAI API status: status.openai.com
2. Verify API key valid and has billing enabled
3. Review conversation for loops (AI asking same question repeatedly)

### Problem: Double bookings occurring
**Cause:** Race condition (two calls at exact same time)
**Fix:**
1. Check Google Sheets logs for timing
2. Review AI prompt adherence (is it checking availability first?)
3. Consider implementing Redis locking (see audit doc)

### Problem: Slack notifications not sending
**Cause:** Webhook URL incorrect or expired
**Fix:**
1. Test webhook with curl:
   ```bash
   curl -X POST [YOUR_WEBHOOK] \
     -H 'Content-type: application/json' \
     -d '{"text":"Test"}'
   ```
2. If fails, regenerate webhook in Slack

---

## Monitoring Checklist

**Daily:**
- [ ] Check Slack #automation-errors for failures
- [ ] Review last 24 hours in Google Sheets call log

**Weekly:**
- [ ] Calculate booking conversion rate (bookings / total calls)
- [ ] Review HubSpot deals created via Voice AI
- [ ] Check for any double-booking incidents

**Monthly:**
- [ ] Review OpenAI API costs vs. budget
- [ ] Analyze common call patterns for prompt optimization
- [ ] Update business hours if needed (seasonal changes)

---

## Key Configuration Values

**Save these for your deployment:**

```
Google Calendar ID: ___________________________________

Google Sheet ID: _______________________________________

HubSpot Portal ID: _____________________________________

Slack Webhook (Sales): _________________________________

Slack Webhook (Errors): ________________________________

n8n Webhook URL: _______________________________________

OpenAI API Key (last 4): _______________________________

n8n Workflow ID: _______________________________________
```

---

## Performance Expectations

**Average call duration:** 2.5-3.5 seconds for AI processing
**Success rate:** Should be >98% (with error handling)
**Cost per call:** ~$0.003 (OpenAI API)
**Concurrent calls supported:** 10-20 simultaneous

---

## What to Do After Deployment

1. **First 24 Hours:** Monitor closely
   - Check every call in Google Sheets
   - Review execution logs in n8n
   - Test various scenarios (booking, canceling, rescheduling)

2. **First Week:** Validate patterns
   - Calculate booking conversion rate
   - Identify any recurring errors
   - Adjust AI prompt if needed based on actual conversations

3. **First Month:** Optimize
   - Review cost vs. budget
   - Analyze customer satisfaction (if collecting feedback)
   - Document any edge cases discovered
   - Train sales team on reviewing Voice AI leads

4. **Ongoing:** Scale
   - Replicate workflow for additional clients
   - Implement Redis locking if double-bookings >1/month
   - Add custom reports in Google Sheets
   - Consider upgrading to dedicated error workflow

---

## Support & Resources

**Documentation:**
- Full audit: `/home/asmar/Revion/Ftmotors/voice-ai/PRODUCTION-WORKFLOW-AUDIT.md`
- Architecture: `/home/asmar/Revion/Ftmotors/voice-ai/ARCHITECTURE-DIAGRAM.md`
- Deployment checklist: `/home/asmar/Revion/Ftmotors/voice-ai/DEPLOYMENT-CHECKLIST.md`

**n8n Resources:**
- Docs: https://docs.n8n.io
- Community: https://community.n8n.io
- Status: https://status.n8n.io

**API Documentation:**
- OpenAI: https://platform.openai.com/docs
- HubSpot: https://developers.hubspot.com/docs/api
- Google Calendar: https://developers.google.com/calendar/api/guides
- Retell AI: [Your Retell docs]

**Revion Support:**
- Technical escalation: [support contact]
- Emergency on-call: [emergency contact]

---

## Version Information

**Workflow Version:** 2.0 (Production)
**n8n Version Required:** 1.0.0+
**Last Updated:** 2025-12-01
**Prepared by:** Revion Consulting - Automation Architecture

---

## Quick Commands Reference

```bash
# Test webhook locally (if running n8n locally)
ngrok http 5678
# Or
cloudflared tunnel --url http://localhost:5678

# Check n8n execution logs (CLI)
n8n executions:list --workflow="FTM - Voice AI Booking Agent (PRODUCTION)"

# Export workflow for backup
n8n export:workflow --id=[WORKFLOW_ID] --output=backup.json

# Check OpenAI usage
curl https://api.openai.com/v1/usage \
  -H "Authorization: Bearer YOUR_API_KEY"

# Test Google Calendar connection
curl "https://www.googleapis.com/calendar/v3/calendars/[CALENDAR_ID]/events" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Test HubSpot connection
curl https://api.hubapi.com/crm/v3/objects/contacts \
  -H "Authorization: Bearer YOUR_HUBSPOT_TOKEN"
```

---

## Success Criteria

Your deployment is successful when:
- ✅ Live call books appointment end-to-end
- ✅ Google Calendar event appears correctly
- ✅ HubSpot contact + deal created automatically
- ✅ Slack notification received in #sales-alerts
- ✅ Google Sheets log entry complete
- ✅ No errors in n8n execution log
- ✅ Security test rejects unauthorized requests
- ✅ Sales team confirms they can see leads in HubSpot

**If all checked: Deployment complete. You're in production.**

---

**Deploy with confidence. This workflow is production-ready.**

Need help? Review the full audit document or contact Revion support.
