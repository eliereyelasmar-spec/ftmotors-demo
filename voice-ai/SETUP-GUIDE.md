# Fast Track Motors Voice AI - Quick Setup Guide

## What You Need
- Retell AI account (retellai.com)
- n8n running (localhost or cloud)
- Google Calendar
- (Optional) Twilio for SMS

## Step 1: Retell AI Setup

### Create Account
1. Go to https://retellai.com
2. Sign up (free trial available)

### Create Agent
1. Click **Create Agent**
2. Name: `Fast Track Motors Receptionist`
3. Copy/paste prompt from: `fast-track-motors-prompt-v2.txt`
4. Settings:
   - Model: `gpt-4.1-mini` (fast + affordable)
   - Voice: Pick a natural voice (recommend "Joanna" or "Matthew")
   - Language: English (US)

### Get Phone Number
1. In Retell dashboard, go to **Phone Numbers**
2. Purchase a local NJ number (or use your own via Twilio)
3. Assign to your agent

## Step 2: n8n Workflow Setup

### Import Workflow
1. Open n8n at localhost:5678
2. Import: `n8n-workflow-v2-complete.json`

### Configure Credentials

**OpenAI:**
1. Settings → Credentials → Add → OpenAI
2. Enter your API key

**Google Calendar:**
1. Settings → Credentials → Add → Google Calendar OAuth2
2. Follow OAuth flow
3. Update calendar ID in workflow nodes

**Twilio (for SMS forms):**
1. Settings → Credentials → Add → Twilio
2. Enter Account SID, Auth Token
3. Update phone number in workflow

### Activate Workflow
1. Toggle workflow to **Active**
2. Copy webhook URL: `http://localhost:5678/webhook/ftm-voice-agent`

## Step 3: Connect Retell to n8n

### If Running Locally (need tunnel)
```bash
# Install ngrok
npm install -g ngrok

# Create tunnel
ngrok http 5678
```
Copy the `https://xxxxx.ngrok.io` URL

### In Retell Dashboard
1. Go to your agent settings
2. Find **Custom LLM / Webhook** section
3. Paste: `https://xxxxx.ngrok.io/webhook/ftm-voice-agent`
4. Save

## Step 4: Test

### Test Call
1. Call your Retell phone number
2. Say: "Hi, I'd like to schedule a test drive"
3. Verify:
   - AI responds naturally
   - Calendar booking works
   - (If configured) SMS form sending works

### Test Scenarios
- [ ] "What are your hours?"
- [ ] "I want to schedule a test drive for tomorrow at 2pm"
- [ ] "Do you have any Honda Accords?"
- [ ] "I need an oil change"
- [ ] "What about financing? I have bad credit"
- [ ] "Can you text me the pre-qualification form?"

## Files Reference

| File | Purpose |
|------|---------|
| `fast-track-motors-prompt-v2.txt` | AI agent prompt (with SMS + trade-in) |
| `n8n-workflow-v2-complete.json` | Full workflow with all tools |
| `fast-track-motors-prompt.txt` | Original simpler prompt |
| `n8n-workflow.json` | Original simpler workflow |

## Troubleshooting

**AI not responding:**
- Check n8n workflow is active
- Check webhook URL is correct in Retell
- Check ngrok tunnel is running (if local)

**Calendar not booking:**
- Verify Google Calendar credentials
- Check calendar ID is correct
- Check timezone settings

**SMS not sending:**
- Verify Twilio credentials
- Check phone number format (+1XXXXXXXXXX)
- Check Twilio balance

## Production Deployment

For production (vs demo):
1. Use n8n Cloud instead of localhost
2. Remove ngrok dependency
3. Use production Retell phone number
4. Configure proper error handling

---

**Ready to test!** Call your Retell number and try booking a test drive.
