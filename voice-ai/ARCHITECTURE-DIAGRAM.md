# Fast Track Motors - Voice AI Production Architecture

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         RETELL AI PLATFORM                              │
│                   (Voice Call Handler + STT/TTS)                        │
└────────────────────────────┬────────────────────────────────────────────┘
                             │
                             │ POST Webhook
                             │ (Call data + transcript)
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          N8N WORKFLOW ENGINE                            │
│                     (Fast Track Motors - Production)                    │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────┐      │
│  │ SECURITY LAYER                                               │      │
│  │  ┌──────────────┐          ┌──────────────┐                │      │
│  │  │   Webhook    │─────────▶│   Security   │                │      │
│  │  │   Trigger    │          │    Check     │                │      │
│  │  │              │          │ (User-Agent) │                │      │
│  │  └──────────────┘          └───────┬──────┘                │      │
│  │                                     │                       │      │
│  │                          ┌──────────┴──────────┐           │      │
│  │                          │ Valid?              │           │      │
│  │                          └─┬──────────────────┬┘           │      │
│  │                        YES │                  │ NO         │      │
│  └────────────────────────────┼──────────────────┼────────────┘      │
│                               │                  │                    │
│                               │                  ▼                    │
│                               │          ┌──────────────┐             │
│                               │          │   Reject     │             │
│                               │          │ Unauthorized │             │
│                               │          │  (403 Error) │             │
│                               │          └──────────────┘             │
│                               │                                       │
│  ┌────────────────────────────┼───────────────────────────────────┐  │
│  │ DATA PROCESSING            ▼                                   │  │
│  │             ┌──────────────────────────┐                       │  │
│  │             │   Extract Call Data      │                       │  │
│  │             │  • call_id               │                       │  │
│  │             │  • transcript            │                       │  │
│  │             │  • from_number           │                       │  │
│  │             │  • call_status           │                       │  │
│  │             │  • timestamp             │                       │  │
│  │             └────────┬─────────────────┘                       │  │
│  │                      │                                         │  │
│  │         ┌────────────┴────────────┐                           │  │
│  │         │                         │                           │  │
│  └─────────┼─────────────────────────┼───────────────────────────┘  │
│            │                         │                              │
│  ┌─────────▼─────────┐    ┌──────────▼──────────────────────────┐  │
│  │ CRM INTEGRATION   │    │   AI PROCESSING CORE                │  │
│  │                   │    │                                     │  │
│  │ ┌───────────────┐ │    │  ┌────────────────────────────┐   │  │
│  │ │   Create/     │ │    │  │      AI Agent Node         │   │  │
│  │ │    Update     │ │    │  │  (OpenAI GPT-4.1-mini)     │   │  │
│  │ │   HubSpot     │ │    │  │                            │   │  │
│  │ │   Contact     │◀┼────┼──│  • System Prompt           │   │  │
│  │ │               │ │    │  │  • Call Context            │   │  │
│  │ │ Properties:   │ │    │  │  • Business Rules          │   │  │
│  │ │ • lead_source │ │    │  │  • Error Instructions      │   │  │
│  │ │ • call_id     │ │    │  │                            │   │  │
│  │ │ • timestamp   │ │    │  │  Connected Tools:          │   │  │
│  │ └───────┬───────┘ │    │  │  ┌──────────────────────┐ │   │  │
│  │         │         │    │  │  │ Google Calendar:     │ │   │  │
│  │         │         │    │  │  │ • Get Events         │ │   │  │
│  │ ┌───────▼───────┐ │    │  │  │ • Create Event       │ │   │  │
│  │ │  Log Call     │ │    │  │  │ • Delete Event       │ │   │  │
│  │ │  Transcript   │ │    │  │  │                      │ │   │  │
│  │ │  as HubSpot   │ │    │  │  │ Retry Logic:         │ │   │  │
│  │ │     Note      │ │    │  │  │ • Get: 3x w/ 1000ms  │ │   │  │
│  │ │               │ │    │  │  │ • Create: 2x w/ 500ms│ │   │  │
│  │ └───────────────┘ │    │  │  │ • Delete: 2x w/ 500ms│ │   │  │
│  │                   │    │  │  └──────────────────────┘ │   │  │
│  └───────────────────┘    │  └────────────┬───────────────┘   │  │
│                           │               │                   │  │
│                           └───────────────┼───────────────────┘  │
│                                           │                      │
│  ┌────────────────────────────────────────┼──────────────────┐  │
│  │ POST-PROCESSING PIPELINE               ▼                  │  │
│  │                                                            │  │
│  │           ┌────────────────────────────────┐              │  │
│  │           │   Check if Booking Made        │              │  │
│  │           │   (Regex: booked|scheduled)    │              │  │
│  │           └──────────┬─────────────────────┘              │  │
│  │                      │                                    │  │
│  │           ┌──────────┴──────────┐                         │  │
│  │           │ Booking Confirmed?  │                         │  │
│  │           └─┬────────────────┬──┘                         │  │
│  │         YES │                │ NO                         │  │
│  │    ┌────────▼──────┐         │                            │  │
│  │    │  Create Deal  │         │                            │  │
│  │    │  in HubSpot   │         │                            │  │
│  │    │               │         │                            │  │
│  │    │ Stage:        │         │                            │  │
│  │    │ appointment   │         │                            │  │
│  │    │  scheduled    │         │                            │  │
│  │    └────────┬──────┘         │                            │  │
│  │             │                │                            │  │
│  │    ┌────────▼──────┐         │                            │  │
│  │    │     Slack     │         │                            │  │
│  │    │  Notification │         │                            │  │
│  │    │ (Sales Alert) │         │                            │  │
│  │    └───────────────┘         │                            │  │
│  │                              │                            │  │
│  │    ┌─────────────────────────┴──────────┐                │  │
│  │    │  Log to Google Sheets              │                │  │
│  │    │  (Complete Call History)           │                │  │
│  │    │                                    │                │  │
│  │    │  Columns:                          │                │  │
│  │    │  • timestamp • call_id             │                │  │
│  │    │  • from_number • call_status       │                │  │
│  │    │  • transcript_length • ai_response │                │  │
│  │    │  • booking_made • hubspot_id       │                │  │
│  │    │  • errors                          │                │  │
│  │    └────────────────────────────────────┘                │  │
│  │                                                           │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ ERROR HANDLING                                           │  │
│  │                                                          │  │
│  │  ┌────────────────────────────────────────────────┐     │  │
│  │  │  On Any Node Failure:                          │     │  │
│  │  │  • Continue workflow (continueOnFail: true)    │     │  │
│  │  │  • Log error details                           │     │  │
│  │  │  • Send Slack alert                            │     │  │
│  │  │                                                │     │  │
│  │  │     ┌──────────────────────────┐              │     │  │
│  │  │     │   Slack Error Alert      │              │     │  │
│  │  │     │  (#automation-errors)    │              │     │  │
│  │  │     │                          │              │     │  │
│  │  │     │  Contains:               │              │     │  │
│  │  │     │  • Call ID               │              │     │  │
│  │  │     │  • Error details         │              │     │  │
│  │  │     │  • Failed node name      │              │     │  │
│  │  │     │  • Timestamp             │              │     │  │
│  │  │     └──────────────────────────┘              │     │  │
│  │  └────────────────────────────────────────────────┘     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ RESPONSE                                                 │  │
│  │                                                          │  │
│  │             ┌──────────────────────────┐                │  │
│  │             │  Respond to Webhook      │                │  │
│  │             │  (Return AI output       │                │  │
│  │             │   to Retell)             │                │  │
│  │             └──────────────────────────┘                │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└──────────────────────────┬───────────────────────────────────────┘
                           │
                           │ JSON Response
                           ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         RETELL AI PLATFORM                              │
│                   (Converts response to speech)                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## External System Integrations

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SYSTEMS & DATA FLOW                         │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│   Google         │      │    HubSpot       │      │     Slack        │
│   Calendar       │      │      CRM         │      │   Workspace      │
│                  │      │                  │      │                  │
│ ┌──────────────┐ │      │ ┌──────────────┐ │      │ ┌──────────────┐ │
│ │   Calendar   │ │      │ │   Contacts   │ │      │ │ #sales-      │ │
│ │    Events    │ │      │ │   Database   │ │      │ │  alerts      │ │
│ │              │◀┼──────┼─│              │ │      │ │              │◀┼─┐
│ │ • Test       │ │ Read │ │ • Name       │ │      │ │ Booking      │ │ │
│ │   Drives     │ │Write │ │ • Phone      │ │      │ │ Notifications│ │ │
│ │ • Service    │ │      │ │ • Source     │ │      │ │              │ │ │
│ │ • Appts      │ │      │ │ • Call ID    │ │      │ └──────────────┘ │ │
│ └──────────────┘ │      │ └──────────────┘ │      │                  │ │
│                  │      │                  │      │ ┌──────────────┐ │ │
│                  │      │ ┌──────────────┐ │      │ │ #automation- │ │ │
│                  │      │ │    Deals     │ │      │ │  errors      │ │ │
│                  │      │ │   Database   │ │      │ │              │◀┼─┘
│                  │      │ │              │ │      │ │ Error        │ │
│                  │      │ │ • Stage      │ │      │ │ Alerts       │ │
│                  │      │ │ • Amount     │ │      │ │              │ │
│                  │      │ │ • Source     │ │      │ └──────────────┘ │
│                  │      │ └──────────────┘ │      │                  │
│                  │      │                  │      └──────────────────┘
│                  │      │ ┌──────────────┐ │
│                  │      │ │    Notes     │ │      ┌──────────────────┐
│                  │      │ │  (Activity)  │ │      │  Google Sheets   │
│                  │      │ │              │ │      │                  │
│                  │      │ │ • Full       │ │      │ ┌──────────────┐ │
│                  │      │ │   Transcript │ │      │ │  Call Logs   │ │
│                  │      │ │ • Call Data  │ │      │ │   Sheet      │ │
│                  │      │ └──────────────┘ │      │ │              │◀┼─┐
└──────────────────┘      │                  │      │ │ Historical   │ │ │
                          └──────────────────┘      │ │ Data for     │ │ │
                                                    │ │ Analytics    │ │ │
                          ┌──────────────────┐      │ │              │ │ │
                          │     OpenAI       │      │ └──────────────┘ │ │
                          │   API Platform   │      │                  │ │
                          │                  │      └──────────────────┘ │
                          │ ┌──────────────┐ │                           │
                          │ │  GPT-4.1     │ │                           │
                          │ │    Mini      │ │                           │
                          │ │              │◀┼───────────────────────────┘
                          │ │ • NLP        │ │ API Calls
                          │ │ • Intent     │ │ (conversation processing)
                          │ │   Detection  │ │
                          │ │ • Response   │ │
                          │ │   Generation │ │
                          │ └──────────────┘ │
                          │                  │
                          └──────────────────┘

All connections from n8n workflow ───────────────────▶
```

---

## Data Flow Sequence (Happy Path - Booking)

```
TIME    ACTOR              ACTION                           RESULT
────    ─────              ──────                           ──────
00:00   Customer          Calls Retell phone number        Call initiated

00:02   Retell AI         Answers, converts speech→text    "Hi, I want to
                                                            book a test drive"

00:03   Retell AI         POSTs to n8n webhook             Webhook triggered
                          (transcript + metadata)

00:04   n8n               Security check (User-Agent)      ✅ Valid

00:05   n8n               Extracts call data               call_id, phone,
                                                            transcript ready

00:06   n8n               Creates HubSpot contact          Contact ID: 123456
                          (parallel with AI Agent)

00:07   n8n               Sends to AI Agent                AI processing...

00:08   AI Agent          "Let me check availability"      Calls get_events tool

00:09   Google Calendar   Returns available slots          3 time slots returned

00:10   AI Agent          "I have 2 PM, 3 PM, 4 PM         Customer hears options
                          available tomorrow"

00:12   Customer          "I'll take 2 PM please"          Retell POSTs again

00:13   n8n               AI Agent processes request       Calls get_events again
                                                            to verify

00:14   Google Calendar   2 PM tomorrow = FREE             Verification passed

00:15   AI Agent          Calls create_event tool          Event creation...

00:16   Google Calendar   Event created successfully       ✅ Booking confirmed
                          "Test Drive - [Customer]"

00:17   AI Agent          "Your appointment is booked      Response generated
                          for tomorrow at 2 PM"

00:18   n8n               Logs transcript to HubSpot       Note added to contact

00:19   n8n               Booking detection (regex)        Match: "booked" found

00:20   n8n               Creates HubSpot deal             Deal ID: 789012
                          Stage: appointmentscheduled      Amount: $25,000

00:21   n8n               Sends Slack notification         #sales-alerts:
                          to #sales-alerts                 "New appointment!"

00:22   n8n               Logs to Google Sheets            Row appended with
                                                            full call data

00:23   n8n               Responds to Retell webhook       JSON response returned

00:24   Retell AI         Converts response→speech         "Your appointment is
                                                            booked..."

00:25   Customer          Hears confirmation               Call ends

────────────────────────────────────────────────────────────────────────────

TOTAL DURATION: 25 seconds
SYSTEMS TOUCHED: 7 (Retell, n8n, OpenAI, Google Calendar, HubSpot, Slack, Sheets)
API CALLS: ~8 total
COST: ~$0.003
```

---

## Error Handling Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                        ERROR SCENARIOS                              │
└─────────────────────────────────────────────────────────────────────┘

SCENARIO 1: Google Calendar API Failure
────────────────────────────────────────
Event Create fails
    │
    ├─▶ Retry #1 (wait 500ms) ──▶ Still fails
    │
    ├─▶ Retry #2 (wait 500ms) ──▶ Still fails
    │
    └─▶ continueOnFail: true
        │
        ├─▶ Error logged to workflow execution
        │
        ├─▶ Slack Error Alert sent (#automation-errors)
        │
        ├─▶ AI tells customer: "Having trouble with calendar,
        │                        we'll call you back in 30 min"
        │
        ├─▶ HubSpot contact still created (with transcript)
        │
        ├─▶ Google Sheets log entry includes error details
        │
        └─▶ Workflow completes (degraded but not crashed)


SCENARIO 2: HubSpot API Failure
────────────────────────────────
Contact Create fails
    │
    └─▶ continueOnFail: true
        │
        ├─▶ Workflow continues (AI Agent still processes)
        │
        ├─▶ Booking can still happen in Calendar
        │
        ├─▶ Error logged to Slack
        │
        ├─▶ Google Sheets captures call (manual CRM entry needed)
        │
        └─▶ Workflow completes


SCENARIO 3: OpenAI Timeout
───────────────────────────
AI Agent times out (>30s)
    │
    └─▶ n8n workflow timeout
        │
        ├─▶ Error logged to n8n execution history
        │
        ├─▶ Slack Error Alert sent
        │
        ├─▶ Retell receives timeout error
        │
        ├─▶ Retell fallback: "Experiencing technical difficulties"
        │
        └─▶ Manual follow-up required (phone number logged)


SCENARIO 4: Unauthorized Webhook Access
────────────────────────────────────────
POST without "Retell" User-Agent
    │
    └─▶ Security Check fails
        │
        └─▶ Respond with 403 Forbidden
            │
            └─▶ No workflow execution (request rejected)
```

---

## Node Connection Map

```
┌─────────────────────────────────────────────────────────────────────┐
│                     NODE DEPENDENCY GRAPH                           │
└─────────────────────────────────────────────────────────────────────┘

[Retell Webhook]
        │
        └──▶ [Security Check]
                │
                ├─ TRUE ──▶ [Extract Call Data]
                │               │
                │               ├──▶ [Create HubSpot Contact]
                │               │       │
                │               │       └──▶ [Log Transcript to HubSpot]
                │               │
                │               └──▶ [AI Agent] ◀── [OpenAI Chat Model]
                │                       │              (connected via
                │                       │               ai_languageModel)
                │                       │
                │                       ├── Tools ──▶ [Get Events]
                │                       ├── Tools ──▶ [Create Event]
                │                       └── Tools ──▶ [Delete Event]
                │                       │
                │                       ├──▶ [Check if Booking Made]
                │                       │       │
                │                       │       └─ TRUE ─▶ [Create Deal]
                │                       │                     │
                │                       │                     └──▶ [Slack Booking Alert]
                │                       │
                │                       ├──▶ [Log to Google Sheets]
                │                       │
                │                       └──▶ [Respond to Webhook]
                │
                └─ FALSE ──▶ [Reject Unauthorized]


Error Handling (parallel to all nodes):
    [Any Node Error] ──▶ [Slack Error Alert]
                         (triggered by continueOnFail)
```

---

## Credential & Authentication Map

```
┌─────────────────────────────────────────────────────────────────────┐
│                    CREDENTIALS REQUIRED                             │
└─────────────────────────────────────────────────────────────────────┘

1. OpenAI API
   ├─ Type: API Key
   ├─ Used by: [OpenAI Chat Model] node
   ├─ Permissions: Chat completions
   └─ Cost: Pay-per-use (~$0.003/call)

2. Google Calendar OAuth2
   ├─ Type: OAuth2 (Service Account or User OAuth)
   ├─ Used by: [Get Events], [Create Event], [Delete Event] nodes
   ├─ Permissions: Calendar read/write
   └─ Cost: Free (within quota)

3. HubSpot API
   ├─ Type: Private App Token
   ├─ Used by: [Create Contact], [Log Transcript], [Create Deal] nodes
   ├─ Required Scopes:
   │   ├─ crm.objects.contacts.read
   │   ├─ crm.objects.contacts.write
   │   ├─ crm.objects.deals.read
   │   ├─ crm.objects.deals.write
   │   └─ crm.schemas.contacts.read
   └─ Cost: Free (within rate limits)

4. Google Sheets OAuth2
   ├─ Type: OAuth2
   ├─ Used by: [Log to Google Sheets] node
   ├─ Permissions: Spreadsheets write
   └─ Cost: Free

5. Slack Webhooks
   ├─ Type: Webhook URL (no auth needed)
   ├─ Used by: [Slack Booking Alert], [Slack Error Alert] nodes
   ├─ Permissions: Post messages to specific channel
   └─ Cost: Free
```

---

## Performance Characteristics

```
┌─────────────────────────────────────────────────────────────────────┐
│                      PERFORMANCE METRICS                            │
└─────────────────────────────────────────────────────────────────────┘

Average Response Times (per node):
────────────────────────────────
  Webhook Trigger          <10ms
  Security Check           <5ms
  Extract Call Data        <5ms
  HubSpot Contact Create   ~200ms
  AI Agent Processing      1500-2500ms (varies by conversation)
  Google Calendar Get      ~150ms
  Google Calendar Create   ~200ms
  Google Calendar Delete   ~150ms
  HubSpot Transcript Log   ~150ms
  HubSpot Deal Create      ~200ms
  Slack Notification       ~100ms
  Google Sheets Log        ~150ms
  Respond to Webhook       <10ms

Total Average Duration: 2.5-3.5 seconds

Bottlenecks:
────────────
1. AI Agent Processing (1.5-2.5s) - Largest component
   Mitigation: Using GPT-4.1-mini (faster than GPT-4.1)

2. Multiple HubSpot API calls - Cumulative 550ms
   Mitigation: Running in parallel where possible

3. Google Calendar operations - Cumulative 500ms
   Mitigation: Retry logic optimized for speed (500ms waits)

Scalability:
────────────
Concurrent Calls Supported: ~10-20 simultaneous (n8n dependent)
Max Calls per Day: Unlimited (API quotas permitting)
Rate Limits:
  - OpenAI: 10,000 requests/min (far exceeds needs)
  - Google Calendar: 1,000,000 queries/day (far exceeds needs)
  - HubSpot: 150 requests/10s (adequate for <90 calls/min)
  - Slack: ~1 message/second (adequate)
```

---

**Document Version:** 1.0
**Last Updated:** 2025-12-01
**Maintained by:** Revion Consulting - Automation Architecture
