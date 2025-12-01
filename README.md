# Fast Track Motors - Premium Demo Package

**Client:** Fast Track Motors
**Location:** 509 10th Avenue, Paterson, NJ 07514
**Phone:** (201) 340-6400
**Owner:** Ali Kassab

## Quick Start

### View Demo Locally
```bash
# Open the demo landing page
open demo/index.html

# Or start a local server
python -m http.server 8000
# Then visit: http://localhost:8000/demo/
```

### Voice AI Demo
1. Set up local n8n with the workflow in `voice-ai/n8n-workflow.json`
2. Expose via tunnel: `ngrok http 5678` or `cloudflared tunnel`
3. Connect Retell AI to the tunnel webhook URL
4. Call the demo number to experience the AI receptionist

## Project Structure

```
Ftmotors/
├── README.md                    # This file
├── demo/
│   ├── index.html              # Main demo landing page
│   ├── dashboard-preview.html  # Interactive dashboard mockup
│   └── roi-calculator.html     # ROI projection tool
├── voice-ai/
│   ├── fast-track-motors-prompt.txt  # Voice AI system prompt
│   └── n8n-workflow.json            # n8n workflow for voice
├── forms/
│   ├── vehicle-inquiry.html
│   ├── test-drive.html
│   ├── service-appointment.html
│   ├── trade-in.html
│   └── financing-prequalification.html
├── hubspot/
│   ├── sales-pipeline.json
│   ├── service-pipeline.json
│   ├── custom-properties.json
│   └── lead-scoring.json
├── workflows/
│   ├── lead-router.json
│   ├── appointment-reminders.json
│   ├── follow-up-sequence.json
│   ├── review-request.json
│   └── service-reminder.json
└── docs/
    ├── proposal.md
    └── comparison-matrix.md
```

## Technical Stack

- **Voice AI:** Retell AI + local n8n (via ngrok/cloudflared tunnel) + Google Calendar
- **CRM:** HubSpot (free tier works for demo, scales to paid)
- **Automation:** Local n8n (exposed via tunnel for Retell webhook)
- **Forms:** HTML/CSS/JS (can embed anywhere)
- **Demo Hosting:** Vercel/Netlify for live website demo

## Key Features

### 1. 24/7 AI Voice Receptionist
- Answers calls instantly, any time
- Books test drives and service appointments
- Handles financing inquiries
- Speaks Spanish (optional)
- Integrates with Google Calendar

### 2. Smart Lead Capture
- Vehicle inquiry forms
- Test drive scheduling
- Trade-in valuation requests
- Financing pre-qualification
- Service appointment booking

### 3. HubSpot CRM Integration
- Dual pipeline (Sales + Service)
- Custom automotive properties
- AI-powered lead scoring
- Automated follow-ups

### 4. n8n Automation Workflows
- Instant lead routing to team
- Appointment reminders (SMS + Email)
- Follow-up sequences
- Review request automation
- Service reminder campaigns

## ROI Projections

| Metric | Conservative Estimate |
|--------|----------------------|
| Missed calls captured | 50+/week |
| Additional appointments | 15-20/month |
| Incremental revenue | $37,500-$50,000/month |
| Investment | $800-$1,200/month |
| **ROI** | **30x - 60x** |

## Deployment Checklist

- [ ] Import n8n workflow
- [ ] Connect Google Calendar
- [ ] Set up Retell AI agent
- [ ] Configure HubSpot pipelines
- [ ] Deploy demo website
- [ ] Test voice AI end-to-end
- [ ] Train staff on system

---

**Built by Revion Consulting**
*Intelligence that drives growth*
