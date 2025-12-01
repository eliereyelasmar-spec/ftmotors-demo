# n8n to HubSpot Integration Guide
## Fast Track Motors - Voice AI & Automation Workflows

**Last Updated:** December 1, 2024
**Purpose:** Connect Retell AI Voice Receptionist to HubSpot CRM via n8n

---

## Overview

This document provides n8n workflow configuration for integrating the Fast Track Motors Voice AI receptionist (Retell AI) with HubSpot CRM. The workflow handles lead capture, contact creation/update, deal creation, lead scoring, and automated notifications.

---

## Architecture

```
Retell AI (Voice Receptionist)
    ↓ (Webhook)
n8n Workflow
    ↓
├── Parse Voice AI Data
├── Check if Contact Exists (HubSpot API)
├── Create/Update Contact (HubSpot API)
├── Calculate Lead Score
├── Create Deal (HubSpot API)
├── Send SMS Alert to Salesperson (Twilio/SMS API)
└── Log Activity (HubSpot Timeline)
```

---

## Prerequisites

### HubSpot Setup

1. **Private App Access Token**
   - Go to: HubSpot Settings > Integrations > Private Apps
   - Create app: "Fast Track Motors n8n Integration"
   - Required scopes:
     - `crm.objects.contacts.read`
     - `crm.objects.contacts.write`
     - `crm.objects.deals.read`
     - `crm.objects.deals.write`
     - `crm.schemas.contacts.read`
     - `crm.schemas.deals.read`
     - `timeline` (optional, for activity logging)
   - Copy Access Token

2. **Custom Properties Created**
   - Ensure all properties from `hubspot-properties.json` are created
   - Verify property internal names match exactly

3. **Pipelines Configured**
   - Sales Pipeline: `ftm_sales_pipeline`
   - Service Pipeline: `ftm_service_pipeline`

### n8n Cloud/Self-Hosted Setup

1. **n8n Credentials**
   - Create HubSpot credential using Private App Token
   - Create Twilio credential (for SMS alerts)
   - Create webhook URL for Retell AI

2. **Twilio Setup** (for SMS notifications)
   - Twilio Account SID
   - Twilio Auth Token
   - Twilio Phone Number

---

## Webhook Payload from Retell AI

### Expected Data Structure

When the Voice AI captures a lead, it sends this JSON payload to your n8n webhook:

```json
{
  "call_id": "abc123",
  "timestamp": "2024-12-01T14:30:00Z",
  "lead_type": "sales",
  "contact": {
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+19735551234",
    "email": "john.doe@example.com",
    "preferred_contact_method": "text",
    "primary_language": "english"
  },
  "sales_data": {
    "vehicle_interest": "2020 Honda Accord",
    "budget_range": "15k_20k",
    "credit_situation": "fair",
    "has_trade_in": true,
    "trade_in_vehicle": "2015 Toyota Camry"
  },
  "service_data": {
    "service_type": ["oil_change", "inspection"],
    "service_vehicle": "2018 Ford F-150",
    "appointment_datetime": "2024-12-05T10:00:00Z"
  },
  "metadata": {
    "call_duration": 180,
    "sentiment": "positive",
    "urgency": "high"
  }
}
```

---

## n8n Workflow: Sales Lead Capture

### Node 1: Webhook Trigger

**Type:** Webhook
**Method:** POST
**Path:** `/ftm-voice-lead`
**Authentication:** None (or API Key)

**Output:**
```json
{
  "body": {
    // Full payload from Retell AI
  }
}
```

---

### Node 2: Parse & Validate Data

**Type:** Code (JavaScript)
**Purpose:** Extract and validate required fields

```javascript
// Extract data from webhook payload
const payload = $input.item.json.body;

// Validate required fields
if (!payload.contact || !payload.contact.phone) {
  throw new Error("Missing required field: phone");
}

// Normalize phone number (remove formatting)
const phone = payload.contact.phone.replace(/\D/g, '');

// Prepare contact data
const contact = {
  firstname: payload.contact.firstName || '',
  lastname: payload.contact.lastName || '',
  phone: phone,
  email: payload.contact.email || null,
  lead_source: 'voice_ai',
  preferred_contact_method: payload.contact.preferred_contact_method || 'phone',
  primary_language: payload.contact.primary_language || 'english'
};

// Prepare sales-specific data
let salesData = {};
if (payload.lead_type === 'sales' && payload.sales_data) {
  salesData = {
    vehicle_interest: payload.sales_data.vehicle_interest || null,
    budget_range: payload.sales_data.budget_range || null,
    credit_situation: payload.sales_data.credit_situation || 'unknown',
    has_trade_in: payload.sales_data.has_trade_in || false,
    trade_in_vehicle: payload.sales_data.trade_in_vehicle || null
  };
}

// Prepare service-specific data
let serviceData = {};
if (payload.lead_type === 'service' && payload.service_data) {
  serviceData = {
    service_type: payload.service_data.service_type || [],
    service_vehicle: payload.service_data.service_vehicle || null,
    appointment_datetime: payload.service_data.appointment_datetime || null
  };
}

// Return structured data
return {
  json: {
    lead_type: payload.lead_type,
    contact: contact,
    sales_data: salesData,
    service_data: serviceData,
    metadata: payload.metadata || {},
    call_id: payload.call_id
  }
};
```

---

### Node 3: Check if Contact Exists

**Type:** HTTP Request
**Method:** POST
**URL:** `https://api.hubapi.com/crm/v3/objects/contacts/search`
**Authentication:** Header Auth
- Name: `Authorization`
- Value: `Bearer YOUR_HUBSPOT_TOKEN`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Body (JSON):**
```json
{
  "filterGroups": [
    {
      "filters": [
        {
          "propertyName": "phone",
          "operator": "EQ",
          "value": "{{$node['Parse & Validate Data'].json.contact.phone}}"
        }
      ]
    }
  ],
  "properties": [
    "firstname",
    "lastname",
    "email",
    "phone",
    "ftm_lead_score"
  ],
  "limit": 1
}
```

**Output:**
- If contact exists: Returns contact ID and properties
- If not exists: Returns empty results array

---

### Node 4: IF - Contact Exists?

**Type:** IF
**Condition:**
- Value 1: `{{$node['Check if Contact Exists'].json.results.length}}`
- Operation: `Greater Than`
- Value 2: `0`

**True Branch:** Update existing contact
**False Branch:** Create new contact

---

### Node 5a: Update Existing Contact

**Type:** HTTP Request
**Method:** PATCH
**URL:** `https://api.hubapi.com/crm/v3/objects/contacts/{{$node['Check if Contact Exists'].json.results[0].id}}`

**Body (JSON):**
```json
{
  "properties": {
    "firstname": "{{$node['Parse & Validate Data'].json.contact.firstname}}",
    "lastname": "{{$node['Parse & Validate Data'].json.contact.lastname}}",
    "email": "{{$node['Parse & Validate Data'].json.contact.email}}",
    "lead_source": "voice_ai",
    "preferred_contact_method": "{{$node['Parse & Validate Data'].json.contact.preferred_contact_method}}",
    "vehicle_interest": "{{$node['Parse & Validate Data'].json.sales_data.vehicle_interest}}",
    "budget_range": "{{$node['Parse & Validate Data'].json.sales_data.budget_range}}",
    "credit_situation": "{{$node['Parse & Validate Data'].json.sales_data.credit_situation}}",
    "has_trade_in": "{{$node['Parse & Validate Data'].json.sales_data.has_trade_in}}",
    "trade_in_vehicle": "{{$node['Parse & Validate Data'].json.sales_data.trade_in_vehicle}}"
  }
}
```

---

### Node 5b: Create New Contact

**Type:** HTTP Request
**Method:** POST
**URL:** `https://api.hubapi.com/crm/v3/objects/contacts`

**Body (JSON):** Same as Node 5a

---

### Node 6: Merge Branches

**Type:** Merge
**Mode:** Merge by Position
**Purpose:** Combine both branches (create or update)

---

### Node 7: Calculate Lead Score

**Type:** Code (JavaScript)
**Purpose:** Calculate FTM Lead Score (0-100)

```javascript
const contact = $node['Parse & Validate Data'].json.contact;
const salesData = $node['Parse & Validate Data'].json.sales_data;
const metadata = $node['Parse & Validate Data'].json.metadata;

let score = 0;

// Contact Engagement (Max 30 points)
score += 8; // Inbound call
if (metadata.sentiment === 'positive') score += 10; // Positive interaction

// Purchase Intent (Max 35 points)
if (salesData.vehicle_interest) score += 10; // Specific vehicle mentioned
if (metadata.urgency === 'high') score += 10; // Ready to buy today
if (salesData.credit_situation && salesData.credit_situation !== 'unknown') score += 8; // Asked about financing
if (salesData.has_trade_in) score += 7; // Mentioned trade-in

// Qualification Factors (Max 25 points)
if (salesData.budget_range) score += 10; // Budget stated
if (salesData.credit_situation !== 'unknown') score += 5; // Credit situation known

// Lead Source Quality (Max 10 points)
score += 7; // AI Voice Assistant

// Cap at 100
score = Math.min(score, 100);

return {
  json: {
    lead_score: score
  }
};
```

---

### Node 8: Update Contact with Lead Score

**Type:** HTTP Request
**Method:** PATCH
**URL:** `https://api.hubapi.com/crm/v3/objects/contacts/{{$node['Merge Branches'].json.id}}`

**Body (JSON):**
```json
{
  "properties": {
    "ftm_lead_score": "{{$node['Calculate Lead Score'].json.lead_score}}"
  }
}
```

---

### Node 9: Create Deal

**Type:** HTTP Request
**Method:** POST
**URL:** `https://api.hubapi.com/crm/v3/objects/deals`

**Body (JSON) - Sales Deal:**
```json
{
  "properties": {
    "dealname": "{{$node['Parse & Validate Data'].json.contact.firstname}} {{$node['Parse & Validate Data'].json.contact.lastname}} - {{$node['Parse & Validate Data'].json.sales_data.vehicle_interest}}",
    "pipeline": "ftm_sales_pipeline",
    "dealstage": "new_lead",
    "vehicle_interest": "{{$node['Parse & Validate Data'].json.sales_data.vehicle_interest}}",
    "budget_range": "{{$node['Parse & Validate Data'].json.sales_data.budget_range}}",
    "trade_in_vehicle": "{{$node['Parse & Validate Data'].json.sales_data.trade_in_vehicle}}"
  },
  "associations": [
    {
      "to": {
        "id": "{{$node['Merge Branches'].json.id}}"
      },
      "types": [
        {
          "associationCategory": "HUBSPOT_DEFINED",
          "associationTypeId": 3
        }
      ]
    }
  ]
}
```

**Body (JSON) - Service Deal:**
```json
{
  "properties": {
    "dealname": "Service - {{$node['Parse & Validate Data'].json.contact.firstname}} {{$node['Parse & Validate Data'].json.contact.lastname}}",
    "pipeline": "ftm_service_pipeline",
    "dealstage": "appointment_requested",
    "service_type": "{{$node['Parse & Validate Data'].json.service_data.service_type.join(';')}}",
    "service_vehicle": "{{$node['Parse & Validate Data'].json.service_data.service_vehicle}}",
    "appointment_datetime": "{{$node['Parse & Validate Data'].json.service_data.appointment_datetime}}"
  },
  "associations": [
    {
      "to": {
        "id": "{{$node['Merge Branches'].json.id}}"
      },
      "types": [
        {
          "associationCategory": "HUBSPOT_DEFINED",
          "associationTypeId": 3
        }
      ]
    }
  ]
}
```

---

### Node 10: IF - Hot Lead?

**Type:** IF
**Condition:**
- Value 1: `{{$node['Calculate Lead Score'].json.lead_score}}`
- Operation: `Greater Than or Equal`
- Value 2: `70`

**True Branch:** Send SMS alert
**False Branch:** Skip

---

### Node 11: Send SMS Alert to Salesperson

**Type:** HTTP Request (Twilio API)
**Method:** POST
**URL:** `https://api.twilio.com/2010-04-01/Accounts/YOUR_ACCOUNT_SID/Messages.json`
**Authentication:** Basic Auth (Account SID / Auth Token)

**Body (Form-Data):**
```
From: +1234567890 (Your Twilio Number)
To: +1SALESPERSONPHONE (On-duty salesperson)
Body: 🔥 HOT LEAD ALERT!
{{$node['Parse & Validate Data'].json.contact.firstname}} {{$node['Parse & Validate Data'].json.contact.lastname}}
Phone: {{$node['Parse & Validate Data'].json.contact.phone}}
Interest: {{$node['Parse & Validate Data'].json.sales_data.vehicle_interest}}
Lead Score: {{$node['Calculate Lead Score'].json.lead_score}}
Contact within 5 minutes!
```

---

### Node 12: Log Activity in HubSpot Timeline

**Type:** HTTP Request
**Method:** POST
**URL:** `https://api.hubapi.com/crm/v3/objects/contacts/{{$node['Merge Branches'].json.id}}/notes`

**Body (JSON):**
```json
{
  "properties": {
    "hs_note_body": "Voice AI Lead Captured\n\nCall ID: {{$node['Parse & Validate Data'].json.call_id}}\nDuration: {{$node['Parse & Validate Data'].json.metadata.call_duration}}s\nLead Type: {{$node['Parse & Validate Data'].json.lead_type}}\nLead Score: {{$node['Calculate Lead Score'].json.lead_score}}\n\nDetails:\n- Vehicle Interest: {{$node['Parse & Validate Data'].json.sales_data.vehicle_interest}}\n- Budget: {{$node['Parse & Validate Data'].json.sales_data.budget_range}}\n- Credit: {{$node['Parse & Validate Data'].json.sales_data.credit_situation}}\n- Trade-In: {{$node['Parse & Validate Data'].json.sales_data.has_trade_in}}",
    "hs_timestamp": "{{$node['Parse & Validate Data'].json.timestamp}}"
  }
}
```

---

## Error Handling

### Add Error Workflow Node

**Type:** Error Trigger
**Purpose:** Catch and log all workflow errors

**Actions:**
1. Log error to file or database
2. Send alert to operations team
3. Store failed payload for manual retry

```javascript
const error = $input.item.json;

return {
  json: {
    error_type: error.error.name,
    error_message: error.error.message,
    failed_node: error.node,
    timestamp: new Date().toISOString(),
    payload: error.json
  }
};
```

---

## Testing

### Manual Webhook Test Payload

Use this JSON to test the workflow manually:

```json
{
  "call_id": "test_123",
  "timestamp": "2024-12-01T14:30:00Z",
  "lead_type": "sales",
  "contact": {
    "firstName": "Test",
    "lastName": "Customer",
    "phone": "+19735551234",
    "email": "test@example.com",
    "preferred_contact_method": "text",
    "primary_language": "english"
  },
  "sales_data": {
    "vehicle_interest": "2020 Honda Accord",
    "budget_range": "15k_20k",
    "credit_situation": "fair",
    "has_trade_in": true,
    "trade_in_vehicle": "2015 Toyota Camry"
  },
  "metadata": {
    "call_duration": 180,
    "sentiment": "positive",
    "urgency": "high"
  }
}
```

### Verification Steps

1. Check HubSpot Contacts: Verify contact created/updated
2. Check HubSpot Deals: Verify deal created in correct pipeline
3. Check Lead Score: Verify `ftm_lead_score` is calculated
4. Check SMS: Verify salesperson received alert (if score > 70)
5. Check Timeline: Verify activity note logged

---

## Production Deployment

### 1. Update Retell AI Webhook URL

In Retell AI dashboard:
- Set webhook URL to: `https://your-n8n-instance.com/webhook/ftm-voice-lead`
- Set authentication (if using API key)

### 2. Configure n8n Environment Variables

```env
HUBSPOT_ACCESS_TOKEN=your_token_here
TWILIO_ACCOUNT_SID=your_sid_here
TWILIO_AUTH_TOKEN=your_auth_here
TWILIO_PHONE_NUMBER=+1234567890
SALESPERSON_PHONE=+19735551234
```

### 3. Enable n8n Workflow

- Set workflow to "Active"
- Monitor execution logs for first 48 hours
- Adjust lead scoring thresholds based on results

---

## Troubleshooting

### Common Issues

**Issue:** Contact not found but should exist
- **Solution:** Check phone number formatting (must be normalized)

**Issue:** Deal creation fails
- **Solution:** Verify pipeline and stage IDs match HubSpot exactly

**Issue:** Lead score not updating
- **Solution:** Check if `ftm_lead_score` property exists in HubSpot

**Issue:** SMS not sending
- **Solution:** Verify Twilio credentials and phone number format

---

## Next Steps

1. **Service Pipeline Workflow:** Create separate workflow for service appointments
2. **Lead Scoring Decay:** Build daily workflow to apply score decay rules
3. **Follow-Up Automation:** Trigger email sequences based on lead score
4. **Reporting Dashboard:** Send daily summary of leads captured

---

**Document Version:** 1.0
**Last Updated:** December 1, 2024
**Prepared By:** Revion Consulting - CRM Specialist Agent
