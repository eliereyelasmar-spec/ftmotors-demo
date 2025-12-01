# Google Sheets Lead Backup Template

## Overview

This template provides a simple, CRM-agnostic backup for all leads captured through the Fast Track Motors forms. Use this when:
- HubSpot is not yet configured
- You want a free backup of all leads
- The sales team prefers spreadsheet-based tracking

---

## Sheet Structure

### Sheet 1: All Leads

Create a Google Sheet with the following columns:

| Column | Header | Data Type | Description |
|--------|--------|-----------|-------------|
| A | Timestamp | DateTime | When the lead was submitted |
| B | Lead Type | Text | Form type (vehicle_inquiry, test_drive, service, trade_in, financing, contact) |
| C | Source | Text | Where the lead came from (website, landing_page) |
| D | Name | Text | Customer full name |
| E | Phone | Text | Customer phone number |
| F | Email | Text | Customer email |
| G | Vehicle Interest | Text | Year, make, model (if applicable) |
| H | Budget | Text | Budget range (if provided) |
| I | Preferred Date | Date | Preferred appointment date |
| J | Preferred Time | Text | Preferred time slot |
| K | Trade-In Info | Text | Trade-in vehicle details |
| L | Credit Situation | Text | Self-reported credit rating |
| M | Down Payment | Currency | Down payment amount |
| N | Monthly Budget | Currency | Monthly payment budget |
| O | Service Type | Text | Type of service requested |
| P | Message | Text | Additional notes/message |
| Q | Status | Text | Lead status (New, Contacted, Scheduled, etc.) |
| R | Assigned To | Text | Sales rep assignment |
| S | Notes | Text | Internal notes |

---

## Column Formatting

### Recommended Settings:

1. **Timestamp (A)**: Format as "MM/DD/YYYY HH:MM:SS"
2. **Phone (E)**: Format as plain text to preserve formatting
3. **Down Payment (M)**: Format as currency ($)
4. **Monthly Budget (N)**: Format as currency ($)
5. **Status (Q)**: Use data validation dropdown:
   - New
   - Contacted
   - Appointment Scheduled
   - Test Drive Complete
   - In Negotiation
   - Sold
   - Lost
   - No Response

---

## n8n Integration Setup

### Step 1: Create the Google Sheet
1. Go to Google Sheets and create a new spreadsheet
2. Name it "Fast Track Motors - Leads"
3. Add all headers from the table above to Row 1
4. Freeze Row 1 (View > Freeze > 1 row)

### Step 2: Connect n8n to Google Sheets

In your n8n workflow, add a Google Sheets node after the webhook:

```json
{
  "nodes": [
    {
      "name": "Append to Google Sheets",
      "type": "n8n-nodes-base.googleSheets",
      "parameters": {
        "operation": "append",
        "documentId": "YOUR_SPREADSHEET_ID",
        "sheetName": "All Leads",
        "columns": {
          "Timestamp": "={{ $now.format('MM/DD/YYYY HH:mm:ss') }}",
          "Lead Type": "={{ $json.type }}",
          "Source": "={{ $json.source }}",
          "Name": "={{ $json.name || $json.firstName + ' ' + $json.lastName }}",
          "Phone": "={{ $json.phone }}",
          "Email": "={{ $json.email }}",
          "Vehicle Interest": "={{ $json.vehicleInterest || '' }}",
          "Budget": "={{ $json.budget || '' }}",
          "Preferred Date": "={{ $json.preferredDate || '' }}",
          "Preferred Time": "={{ $json.preferredTime || '' }}",
          "Trade-In Info": "={{ $json.tradeIn || '' }}",
          "Credit Situation": "={{ $json.creditSituation || '' }}",
          "Down Payment": "={{ $json.downPayment || '' }}",
          "Monthly Budget": "={{ $json.monthlyBudget || '' }}",
          "Service Type": "={{ $json.serviceType || '' }}",
          "Message": "={{ $json.message || $json.comments || '' }}",
          "Status": "New",
          "Assigned To": "",
          "Notes": ""
        }
      }
    }
  ]
}
```

### Step 3: Set Up Google API Credentials

1. In n8n, go to Settings > Credentials
2. Add new credential: Google Sheets OAuth2
3. Follow the OAuth flow to connect your Google account
4. Select the credential in your Google Sheets node

---

## Views/Filters to Create

### Recommended Filter Views:

1. **New Leads Today**
   - Filter: Status = "New" AND Timestamp = Today

2. **Hot Leads (Financing)**
   - Filter: Lead Type = "financing_prequalification"

3. **Test Drives Scheduled**
   - Filter: Lead Type = "test_drive" AND Status = "Appointment Scheduled"

4. **Service Requests**
   - Filter: Lead Type = "service_appointment"

5. **Trade-In Opportunities**
   - Filter: Lead Type = "trade_in_request"

---

## Conditional Formatting

Add these conditional formatting rules:

1. **New Leads** (Status = "New")
   - Background: Light Yellow (#FFF9C4)

2. **Hot Leads** (Lead Type contains "financing")
   - Background: Light Orange (#FFE0B2)

3. **Scheduled** (Status = "Appointment Scheduled")
   - Background: Light Green (#C8E6C9)

4. **Sold** (Status = "Sold")
   - Background: Green (#81C784)

5. **Lost/No Response** (Status = "Lost" OR "No Response")
   - Background: Light Gray (#E0E0E0)

---

## Daily Workflow Checklist

### Morning (9 AM):
- [ ] Review all new leads from overnight
- [ ] Assign leads to sales team
- [ ] Prioritize financing leads (highest intent)

### Throughout Day:
- [ ] Update status as leads are contacted
- [ ] Add notes from conversations
- [ ] Schedule follow-ups

### End of Day:
- [ ] Verify all new leads have been contacted
- [ ] Update statuses
- [ ] Identify leads needing follow-up tomorrow

---

## Reporting

### Weekly Metrics to Track:

| Metric | Formula |
|--------|---------|
| Total New Leads | =COUNTIF(Q:Q, "New") |
| Conversion Rate | =COUNTIF(Q:Q, "Sold") / COUNTA(Q2:Q) |
| Leads by Type | =COUNTIF(B:B, "test_drive") |
| Response Rate | =(COUNTA(Q:Q) - COUNTIF(Q:Q, "No Response")) / COUNTA(Q:Q) |

### Create a Summary Tab:
- Today's leads
- This week's leads
- Leads by type (pie chart)
- Conversion funnel

---

## Sharing Settings

1. Share with sales team as "Editor"
2. Share with management as "Commenter" or "Viewer"
3. Enable notifications for new rows (Tools > Notification rules)

---

## Backup Best Practices

1. **Daily Export**: Download CSV backup daily
2. **Version History**: Google Sheets keeps 30-day version history
3. **Duplicate Sheet**: Create monthly archive copies

---

## Template Link

Create your copy from this template structure and share the link with your team.

**To Use:**
1. Copy this structure into a new Google Sheet
2. Share the Sheet ID with Revion for n8n integration
3. Begin receiving leads automatically

---

*Prepared by Revion Consulting*
*Intelligence that drives growth*
