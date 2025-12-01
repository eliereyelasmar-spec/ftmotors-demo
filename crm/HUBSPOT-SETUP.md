# HubSpot CRM Setup Guide
## Fast Track Motors - Complete Configuration

**Last Updated:** December 1, 2024
**Business:** Fast Track Motors (Used Car Dealership - Paterson, NJ)
**HubSpot Tier:** Free/Starter Compatible

---

## Table of Contents

1. [Overview](#overview)
2. [Pipeline Configuration](#pipeline-configuration)
3. [Custom Properties](#custom-properties)
4. [Lead Scoring](#lead-scoring)
5. [Automation & Workflows](#automation--workflows)
6. [Integration Points](#integration-points)
7. [Step-by-Step Setup Instructions](#step-by-step-setup-instructions)
8. [Team Access & Permissions](#team-access--permissions)

---

## Overview

### Business Context

Fast Track Motors operates in the competitive used car market in Paterson, NJ, serving a diverse customer base with:

- **Sales Division:** Used vehicles priced $10K-$30K
- **Service Department:** Oil changes, repairs, NJ inspections
- **Financing:** In-house and bank financing for all credit situations
- **Trade-Ins:** Vehicle evaluations and trade-in allowances

### Lead Sources

1. **Voice AI Receptionist** (Retell AI) - Primary 24/7 lead capture
2. **Website Forms** - Financing pre-qual, test drives, trade-ins, service bookings
3. **Walk-Ins** - Physical lot traffic
4. **Third-Party Platforms** - CarGurus, Facebook Marketplace
5. **Referrals** - Previous customers and community

### CRM Objectives

- **Speed to Lead:** Contact within 5 minutes of inquiry
- **Lead Qualification:** Automated scoring and prioritization
- **Pipeline Visibility:** Real-time deal tracking for sales and service
- **Data Quality:** Capture complete vehicle and customer information
- **Automation:** Reduce manual tasks, increase follow-up consistency

---

## Pipeline Configuration

### 1. Sales Pipeline: "Fast Track Motors - Vehicle Sales"

**Purpose:** Track leads from initial inquiry through vehicle delivery

| Stage | Probability | Avg. Days | Description | Exit Criteria |
|-------|-------------|-----------|-------------|---------------|
| **New Lead** | 5% | 0-1 days | Fresh inquiry, not yet contacted | First contact made |
| **Contacted** | 15% | 1-3 days | Initial conversation completed | Test drive scheduled or qualified out |
| **Test Drive Scheduled** | 35% | 3-7 days | Appointment confirmed | Test drive completed or no-show |
| **Test Drive Completed** | 50% | 2-5 days | Customer drove vehicle | Ready to discuss numbers |
| **Negotiation** | 65% | 3-7 days | Price, trade-in, terms discussion | Agreement reached or walking |
| **Financing** | 80% | 2-5 days | Credit app submitted | Approved and ready to close |
| **Sold** | 100% | N/A | Deal closed, vehicle delivered | Contract signed |
| **Lost** | 0% | N/A | Deal did not close | Reason logged |

#### Stage Details

**NEW LEAD (5% Win Probability)**
- **Goal:** Make contact within 5 minutes
- **Required Actions:**
  - Attempt first contact (call preferred, text backup)
  - Log contact method and response
  - Verify lead source
- **Automations:**
  - Instant SMS alert to on-duty salesperson
  - Auto-create follow-up task
  - If after-hours, add to "Hot Lead" morning sequence
- **Warning:** If no contact after 1 day
- **Critical:** If no contact after 2 days

**CONTACTED (15% Win Probability)**
- **Goal:** Qualify interest and schedule test drive
- **Required Actions:**
  - Confirm vehicle of interest
  - Discuss budget and financing needs
  - Ask about trade-in
  - Propose test drive appointment
- **Exit Criteria:**
  - To Next: Test drive scheduled or discussing specific vehicle
  - To Lost: No response after 5 attempts or explicitly not interested
- **Warning:** If no activity after 3 days
- **Critical:** If no activity after 7 days

**TEST DRIVE SCHEDULED (35% Win Probability)**
- **Goal:** Ensure customer shows for appointment
- **Required Actions:**
  - Send confirmation with date/time/location
  - Prepare vehicle (clean, fueled, ready)
  - Review credit situation if known
- **Automations:**
  - 24-hour reminder (text)
  - 1-hour reminder (text)
  - If no-show, trigger recovery sequence
- **Warning:** If appointment date passes without update

**TEST DRIVE COMPLETED (50% Win Probability)**
- **Goal:** Move to negotiation immediately
- **Required Actions:**
  - Capture test drive feedback
  - Discuss pricing and payment structure
  - Begin credit application if interested
- **Exit Criteria:**
  - To Next: Customer ready to discuss numbers
  - To Lost: Not interested or shopping elsewhere
- **Warning:** If no follow-up within 2 days
- **Critical:** If no follow-up within 5 days

**NEGOTIATION (65% Win Probability)**
- **Goal:** Reach agreement on all terms
- **Required Actions:**
  - Present pricing worksheet (breakdown)
  - Evaluate trade-in if applicable
  - Discuss down payment options
  - Address objections
- **Key Fields Required:**
  - Asking Price
  - Trade-In Value (if applicable)
  - Down Payment
- **Warning:** If no progress after 3 days
- **Critical:** If no progress after 7 days

**FINANCING (80% Win Probability)**
- **Goal:** Secure credit approval
- **Required Actions:**
  - Submit credit application to lenders
  - Communicate approval status to customer
  - Finalize loan terms and monthly payment
- **Key Fields Required:**
  - Lender
  - APR
  - Loan Term
  - Monthly Payment
- **Warning:** If no approval after 2 days
- **Critical:** If no approval after 5 days

**SOLD (100% - Closed Won)**
- **Goal:** Deliver exceptional customer experience
- **Required Actions:**
  - Complete all paperwork (title, registration, insurance)
  - Deliver vehicle with full tank
  - Explain warranty and service options
  - Request Google review
- **Automations:**
  - Send thank you email immediately
  - Send review request after 3 days
  - Add to service reminder sequence
  - Schedule 30-day check-in call

**LOST (0% - Closed Lost)**
- **Goal:** Capture loss reason and nurture for future
- **Required Fields:**
  - Reason Lost (dropdown selection)
- **Automations:**
  - Add to "Be Back" nurture sequence
  - Schedule 30-day follow-up task
  - Flag for remarketing campaigns

---

### 2. Service Pipeline: "Fast Track Motors - Service Department"

**Purpose:** Manage service appointments from request through completion

| Stage | Probability | Avg. Hours | Description | Exit Criteria |
|-------|-------------|------------|-------------|---------------|
| **Appointment Requested** | 30% | 4-24 hours | Service inquiry received | Appointment confirmed |
| **Confirmed** | 60% | 1-7 days | Customer confirmed appointment | Vehicle dropped off |
| **Vehicle Dropped Off** | 75% | 1-4 hours | Vehicle in service bay | Work begins |
| **In Service** | 85% | 2-8 hours | Actively being serviced | Work complete |
| **Ready for Pickup** | 95% | 4-48 hours | Work complete, awaiting pickup | Customer picks up |
| **Completed** | 100% | N/A | Service paid and picked up | Invoice closed |
| **No Show** | 0% | N/A | Customer missed appointment | Rescheduled or abandoned |
| **Cancelled** | 0% | N/A | Customer cancelled | Reason logged |

#### Service Type Codes

| Service | Code | Est. Duration | Est. Cost |
|---------|------|---------------|-----------|
| Oil Change | OIL | 45 min | $39-$69 |
| Brake Service | BRK | 2 hours | $150-$400 |
| Tire Service | TIR | 1 hour | $25-$150 |
| NJ Inspection | INS | 30 min | Varies |
| Diagnostic | DIAG | 1 hour | $89-$149 |
| A/C Service | AC | 1.5 hours | $100-$250 |
| General Repair | REP | TBD | TBD |

---

## Custom Properties

### Contact Properties

#### Group: "Dealership Information"

| Property Name | Label | Type | Options | Description |
|---------------|-------|------|---------|-------------|
| `lead_source` | Lead Source | Dropdown | Walk-In, Phone Call, Website Form, AI Voice Assistant, Referral, CarGurus, Facebook Marketplace, Google Ad, Repeat Customer, Other | How customer found us |
| `credit_situation` | Credit Situation | Dropdown | Excellent (720+), Good (680-719), Fair (620-679), Poor (Below 620), No Credit, Unknown | Credit tier for financing |
| `vehicle_interest` | Vehicle Interest | Text | N/A | Specific vehicle(s) customer wants |
| `budget_range` | Budget Range | Dropdown | Under $10K, $10K-$15K, $15K-$20K, $20K-$25K, $25K-$30K, Over $30K | Customer's stated budget |
| `preferred_contact_method` | Preferred Contact Method | Dropdown | Phone Call, Text/SMS, Email, Any | How to reach them |
| `has_trade_in` | Has Trade-In | Checkbox | Yes/No | Does customer have trade? |
| `trade_in_vehicle` | Trade-In Vehicle | Text | N/A | Year Make Model format |
| `primary_language` | Primary Language | Dropdown | English, Spanish, Other | Language preference |
| `customer_vehicles` | Customer's Vehicles | Text Area | N/A | Vehicles owned (service history) |
| `ftm_lead_score` | FTM Lead Score | Number | 0-100 | AI-calculated quality score |

### Deal Properties

#### Group: "Deal Information" (Sales Deals)

| Property Name | Label | Type | Description |
|---------------|-------|------|-------------|
| `stock_number` | Stock Number | Text | Vehicle inventory number |
| `vehicle_vin` | VIN | Text | 17-character VIN |
| `vehicle_year` | Vehicle Year | Number | 4-digit year |
| `vehicle_make` | Vehicle Make | Text | e.g., Honda, Ford, Toyota |
| `vehicle_model` | Vehicle Model | Text | e.g., Accord, F-150, Camry |
| `vehicle_trim` | Vehicle Trim | Text | e.g., EX, XLT, LE |
| `vehicle_mileage` | Vehicle Mileage | Number | Odometer reading |
| `asking_price` | Asking Price | Currency | List price of vehicle |
| `trade_in_value` | Trade-In Value | Currency | Allowance for trade |
| `down_payment` | Down Payment | Currency | Customer down payment |
| `amount_financed` | Amount Financed | Currency | Total loan amount |
| `monthly_payment` | Monthly Payment | Currency | Calculated payment |
| `loan_term_months` | Loan Term (Months) | Dropdown | 36, 48, 60, 72, 84 |
| `apr` | APR | Number | Interest rate percentage |
| `lender` | Lender | Text | Financing institution |
| `gross_profit` | Gross Profit | Currency | Deal profitability |
| `test_drive_date` | Test Drive Date | Date | When test drive occurred |
| `delivery_date` | Delivery Date | Date | Vehicle delivery date |
| `reason_lost` | Reason Lost | Dropdown | Price Too High, Bought Elsewhere, Credit Declined, No Response, Changed Mind, Trade-In Value, Vehicle Not Available, Other |
| `salesperson` | Salesperson | Dropdown | Robert, Ramon, Julio, Leo, Jorge, Isaac, David, Ali (Owner) |

#### Group: "Service Information" (Service Deals)

| Property Name | Label | Type | Description |
|---------------|-------|------|-------------|
| `service_type` | Service Type | Multi-Checkbox | Oil Change, Brake Service, Tire Service, NJ Inspection, Diagnostic, A/C Service, Engine Repair, Transmission, Other |
| `service_vehicle` | Service Vehicle | Text | Year Make Model being serviced |
| `service_mileage` | Service Mileage | Number | Current odometer |
| `appointment_datetime` | Appointment Date/Time | Date | Scheduled service time |

---

## Lead Scoring

### Fast Track Motors Lead Score (0-100 Scale)

**Purpose:** Prioritize follow-up based on likelihood to convert

#### Scoring Categories

**1. Contact Engagement (Max 30 Points)**
- Responded to outreach: +10 points
- Inbound call: +8 points
- Multiple page views (3+): +5 points
- Form submission: +7 points

**2. Purchase Intent (Max 35 Points)**
- Specific vehicle mentioned: +10 points
- Test drive scheduled: +15 points
- Asked about financing: +8 points
- Mentioned trade-in: +7 points
- Ready to buy today: +10 points

**3. Qualification Factors (Max 25 Points)**
- Budget matches inventory: +10 points
- Local zip code (within 15 miles): +5 points
- Credit situation known: +5 points
- Down payment available: +5 points

**4. Lead Source Quality (Max 10 Points)**
- Referral: +10 points
- Repeat customer: +10 points
- CarGurus/Car Sites: +7 points
- Walk-in: +8 points
- AI Voice Assistant: +7 points
- Google Ad: +6 points
- Website organic: +5 points

#### Score Thresholds & Actions

| Score Range | Label | Color | Action | Priority |
|-------------|-------|-------|--------|----------|
| 70-100 | Hot Lead | Red | Contact within 5 minutes | 1 |
| 40-69 | Warm Lead | Orange | Contact within 1 hour | 2 |
| 20-39 | Cool Lead | Blue | Contact within 24 hours, nurture | 3 |
| 0-19 | Cold Lead | Gray | Long-term nurture sequence | 4 |

#### Score Decay Rules

- **No activity for 7 days:** -5 points
- **No response to 3+ attempts:** -10 points
- **Lead age exceeds 30 days:** -15 points

---

## Automation & Workflows

### Critical Workflows

#### 1. New Lead Assignment & Alert
**Trigger:** New deal created in "New Lead" stage
**Actions:**
1. Assign to on-duty salesperson (round-robin or manual)
2. Send SMS alert to assigned salesperson
3. Create task: "First contact attempt - 5 minutes"
4. Log lead source in timeline
5. If after-hours (8pm-8am), add to "Morning Priority" list

#### 2. Test Drive Reminder Sequence
**Trigger:** Deal enters "Test Drive Scheduled" stage
**Actions:**
1. Send confirmation SMS immediately
2. Wait until 24 hours before appointment
3. Send reminder SMS: "Looking forward to seeing you tomorrow at [TIME]"
4. Wait until 1 hour before appointment
5. Send final reminder: "See you in 1 hour at Fast Track Motors!"
6. If no-show detected (deal not progressed), trigger recovery workflow

#### 3. Test Drive No-Show Recovery
**Trigger:** Deal in "Test Drive Scheduled" stage for 24+ hours after appointment time
**Actions:**
1. Send SMS: "We missed you today! Can we reschedule your test drive?"
2. Create task for salesperson: "Follow up on no-show"
3. If no response in 48 hours, move to "Lost" stage with reason "No Show"

#### 4. Deal Won - Post-Sale Sequence
**Trigger:** Deal moved to "Sold" stage
**Actions:**
1. Send thank you email immediately
2. Wait 3 days
3. Send Google review request via SMS
4. Wait 7 days
5. Send service reminder sequence enrollment
6. Create task: "30-day check-in call"

#### 5. Deal Lost - Nurture & Recovery
**Trigger:** Deal moved to "Lost" stage
**Actions:**
1. Require "Reason Lost" field to be filled
2. Send personalized follow-up email based on reason
3. Add to "Be Back" monthly email campaign
4. Create task: "30-day follow-up call"
5. If reason is "Price Too High" or "Trade Value", notify manager

#### 6. Lead Scoring Automation
**Trigger:** Contact property updated or deal stage changed
**Actions:**
1. Recalculate lead score based on criteria
2. Update `ftm_lead_score` property
3. If score reaches 70+, send SMS alert to salesperson
4. If score drops below 20, remove from active sequences

#### 7. Service Appointment Reminders
**Trigger:** Deal in "Confirmed" stage (Service Pipeline)
**Actions:**
1. Wait until 24 hours before appointment
2. Send reminder SMS with service details
3. Wait until 1 hour before appointment
4. Send "We're ready for you" SMS
5. If no-show, send "We missed you" message and create rescheduling task

#### 8. Service Completion - Review Request
**Trigger:** Deal moved to "Completed" stage (Service Pipeline)
**Actions:**
1. Send thank you SMS immediately
2. Wait 24 hours
3. Send satisfaction survey
4. If positive response, send Google review request
5. Schedule next service reminder based on mileage/time

---

## Integration Points

### n8n Voice AI Workflow Integration

The Voice AI receptionist (Retell AI) captures leads via phone and sends data to n8n for processing. The n8n workflow must integrate with HubSpot as follows:

#### Webhook Payload Structure

When the Voice AI captures a lead, it sends this data structure to n8n:

```json
{
  "lead_type": "sales" | "service",
  "contact": {
    "firstName": "string",
    "lastName": "string",
    "phone": "string",
    "email": "string (optional)",
    "lead_source": "voice_ai",
    "preferred_contact_method": "phone" | "text"
  },
  "deal": {
    "pipeline": "ftm_sales_pipeline" | "ftm_service_pipeline",
    "stage": "new_lead" | "appointment_requested",
    "dealname": "string (auto-generated)",
    "vehicle_interest": "string (for sales)",
    "budget_range": "string (for sales)",
    "credit_situation": "string (for sales)",
    "has_trade_in": boolean,
    "trade_in_vehicle": "string (optional)",
    "service_type": ["array of service types"] (for service),
    "service_vehicle": "string (for service)",
    "appointment_datetime": "ISO 8601 datetime (for service)"
  }
}
```

#### n8n to HubSpot Workflow Steps

1. **Receive Webhook** from Retell AI
2. **Check if Contact Exists** (HubSpot: Search contact by phone)
3. **Branch:**
   - **If exists:** Update contact properties with new data
   - **If new:** Create new contact
4. **Create Deal** associated with contact
5. **Calculate Lead Score** based on captured data
6. **Update Contact** with calculated lead score
7. **Trigger HubSpot Workflow** (via deal stage change)
8. **Send SMS Alert** to on-duty salesperson
9. **Log Activity** in HubSpot timeline

#### Required HubSpot API Scopes

- `crm.objects.contacts.read`
- `crm.objects.contacts.write`
- `crm.objects.deals.read`
- `crm.objects.deals.write`
- `crm.schemas.contacts.read`
- `crm.schemas.deals.read`

#### Property Internal Names for API Mapping

Use these exact internal names when creating properties via API or n8n:

**Contact Properties:**
- `lead_source`
- `credit_situation`
- `vehicle_interest`
- `budget_range`
- `preferred_contact_method`
- `has_trade_in`
- `trade_in_vehicle`
- `primary_language`
- `customer_vehicles`
- `ftm_lead_score`

**Deal Properties:**
- `stock_number`
- `vehicle_vin`
- `vehicle_year`
- `vehicle_make`
- `vehicle_model`
- `vehicle_trim`
- `vehicle_mileage`
- `asking_price`
- `trade_in_value`
- `down_payment`
- `amount_financed`
- `monthly_payment`
- `loan_term_months`
- `apr`
- `lender`
- `gross_profit`
- `test_drive_date`
- `delivery_date`
- `reason_lost`
- `salesperson`
- `service_type`
- `service_vehicle`
- `service_mileage`
- `appointment_datetime`

---

## Step-by-Step Setup Instructions

### Phase 1: Property Groups & Custom Properties (30 minutes)

#### Step 1.1: Create Property Groups

1. Navigate to **Settings** (gear icon) → **Data Management** → **Properties**
2. Click **"Groups"** tab at the top
3. Click **"Create group"**
4. Create these 3 groups:

**Group 1: Dealership Information**
- Name: `dealership_info`
- Display Name: "Dealership Information"
- Display Order: 0
- Object Type: Contacts

**Group 2: Deal Information**
- Name: `dealership_deal_info`
- Display Name: "Deal Information"
- Display Order: 1
- Object Type: Deals

**Group 3: Service Information**
- Name: `dealership_service_info`
- Display Name: "Service Information"
- Display Order: 2
- Object Type: Deals

#### Step 1.2: Create Contact Properties

For each property in the [Contact Properties](#contact-properties) table:

1. Go to **Properties** → **Contact properties**
2. Click **"Create property"**
3. Fill in:
   - **Object Type:** Contact
   - **Group:** Dealership Information
   - **Label:** [from table]
   - **Internal Name:** [from table - use snake_case]
   - **Field Type:** [from table]
   - **Description:** [from table]
4. If dropdown, add all options from table
5. Click **"Create"**

**Quick tip:** Use the JSON file (`hubspot-properties.json`) with the HubSpot API to create these programmatically (see Phase 4).

#### Step 1.3: Create Deal Properties

Same process as Step 1.2, but for Deal properties. Assign to appropriate group (Deal Information or Service Information).

---

### Phase 2: Pipeline Configuration (20 minutes)

#### Step 2.1: Create Sales Pipeline

1. Go to **Settings** → **Objects** → **Deals**
2. Click **"Pipelines"** tab
3. Click **"Create pipeline"**
4. Name: "Fast Track Motors - Vehicle Sales"
5. Add stages in this exact order (use table from [Sales Pipeline](#1-sales-pipeline-fast-track-motors---vehicle-sales)):
   - Stage Name
   - Win Probability (%)
6. Click **"Create"**

#### Step 2.2: Configure Stage Properties

For each stage:
1. Click the stage name to edit
2. Set:
   - **Win Probability:** [from table]
   - **Rotting:** Enable, set warning/critical days
3. Add required properties (optional, but recommended):
   - For "Negotiation": `asking_price`, `trade_in_value`, `down_payment`
   - For "Financing": `lender`, `apr`, `loan_term_months`, `monthly_payment`
   - For "Lost": `reason_lost` (required)

#### Step 2.3: Create Service Pipeline

Repeat Step 2.1 and 2.2 for the Service Pipeline using the [Service Pipeline](#2-service-pipeline-fast-track-motors---service-department) table.

---

### Phase 3: Lead Scoring Setup (30 minutes)

#### Option A: Manual Workflow Setup (HubSpot Free/Starter)

1. Create calculated property for lead score:
   - Go to **Properties** → **Contact properties**
   - Use the existing `ftm_lead_score` property
   - Manually update scores based on actions

#### Option B: n8n Automated Scoring (Recommended)

1. Build n8n workflow to calculate score when:
   - New contact created
   - Contact property updated
   - Deal stage changed
2. Use scoring criteria from [Lead Scoring](#lead-scoring) section
3. Update `ftm_lead_score` via HubSpot API
4. Trigger SMS alerts for scores 70+

#### Step 3.1: Create Score-Based Lists

1. Go to **Contacts** → **Lists**
2. Create 4 active lists:

**Hot Leads (70-100)**
- Filter: `FTM Lead Score` is greater than or equal to 70

**Warm Leads (40-69)**
- Filter: `FTM Lead Score` is greater than or equal to 40
- AND: `FTM Lead Score` is less than 70

**Cool Leads (20-39)**
- Filter: `FTM Lead Score` is greater than or equal to 20
- AND: `FTM Lead Score` is less than 40

**Cold Leads (0-19)**
- Filter: `FTM Lead Score` is less than 20

---

### Phase 4: Automation & Workflows (45 minutes)

**Note:** Workflows require HubSpot Starter tier or higher. For Free tier, use n8n to replicate these workflows via API.

#### Step 4.1: New Lead Assignment

1. Go to **Automation** → **Workflows**
2. Click **"Create workflow"** → **"Deal-based"**
3. Name: "New Lead - Assignment & Alert"
4. Enrollment trigger:
   - Deal is created
   - Pipeline: Fast Track Motors - Vehicle Sales
   - Stage: New Lead
5. Actions:
   - Assign deal to salesperson (round-robin or specific)
   - Create task: "First contact - 5 minutes"
   - Send internal SMS notification (via Twilio or n8n)
6. Turn workflow **ON**

#### Step 4.2: Test Drive Reminders

1. Create workflow: "Test Drive - Reminder Sequence"
2. Enrollment trigger:
   - Deal enters stage: Test Drive Scheduled
3. Actions:
   - Send email: "Test Drive Confirmation" (with calendar invite)
   - Delay until 24 hours before `test_drive_date`
   - Send SMS: "Looking forward to your test drive tomorrow"
   - Delay until 1 hour before `test_drive_date`
   - Send SMS: "See you in 1 hour at Fast Track Motors!"
4. Turn workflow **ON**

#### Step 4.3: Deal Won - Post-Sale

1. Create workflow: "Deal Won - Customer Delight"
2. Enrollment trigger:
   - Deal enters stage: Sold
3. Actions:
   - Send email: "Thank You from Fast Track Motors"
   - Delay 3 days
   - Send SMS: "How's your new ride? Leave us a review: [Google Link]"
   - Delay 7 days
   - Enroll in email sequence: "Service Reminders"
   - Create task: "30-day check-in call"
4. Turn workflow **ON**

#### Step 4.4: Deal Lost - Nurture

1. Create workflow: "Deal Lost - Be Back Sequence"
2. Enrollment trigger:
   - Deal enters stage: Lost
3. Actions:
   - Require property: `reason_lost`
   - If reason = "Price Too High": Send email "Price Drop Alert Subscription"
   - If reason = "Bought Elsewhere": Send email "We'd love another chance"
   - Create task: "30-day follow-up call"
   - Add to list: "Be Back - Monthly Email"
4. Turn workflow **ON**

#### Step 4.5: Service Appointment Reminders

1. Create workflow: "Service - Appointment Reminders"
2. Enrollment trigger:
   - Deal enters stage: Confirmed (Service Pipeline)
3. Actions:
   - Delay until 24 hours before `appointment_datetime`
   - Send SMS: "Service appointment reminder tomorrow at [TIME]"
   - Delay until 1 hour before `appointment_datetime`
   - Send SMS: "We're ready for you! See you in 1 hour."
4. Turn workflow **ON**

---

### Phase 5: Dashboard & Reporting (15 minutes)

#### Step 5.1: Create Sales Dashboard

1. Go to **Reports** → **Dashboards**
2. Click **"Create dashboard"**
3. Name: "Fast Track Motors - Sales Performance"
4. Add reports:
   - **Pipeline Overview:** Deals by stage (bar chart)
   - **Win Rate:** Closed Won vs. Closed Lost (pie chart)
   - **Lead Source Performance:** Deals by Lead Source (table)
   - **Hot Leads:** Contact list filtered by score 70+
   - **Days in Stage:** Average days per pipeline stage
   - **Salesperson Leaderboard:** Closed deals by `salesperson`

#### Step 5.2: Create Service Dashboard

1. Create dashboard: "Fast Track Motors - Service Operations"
2. Add reports:
   - **Appointments Today:** Deals in "Confirmed" stage
   - **In Service Now:** Deals in "In Service" stage
   - **Ready for Pickup:** Deals in "Ready for Pickup" stage
   - **Service Type Breakdown:** Deals by `service_type`
   - **Completion Rate:** Completed vs. No Show/Cancelled

---

### Phase 6: Testing & Validation (30 minutes)

#### Test Checklist

- [ ] Create test contact with all properties filled
- [ ] Create test sales deal and move through all stages
- [ ] Create test service deal and move through all stages
- [ ] Verify lead scoring calculation (if automated)
- [ ] Test workflow triggers (check emails/SMS)
- [ ] Verify pipeline stage probabilities
- [ ] Test Voice AI → n8n → HubSpot integration
- [ ] Confirm salesperson assignments working
- [ ] Test "Lost" deal reason requirement
- [ ] Verify dashboards displaying data correctly

---

## Team Access & Permissions

### Recommended User Roles

**Owner/Manager (Ali)**
- Role: Super Admin
- Access: Full HubSpot access
- Can: Edit properties, workflows, settings, view all deals

**Salespeople (Robert, Ramon, Julio, Leo, Jorge, Isaac, David)**
- Role: Sales (with restrictions)
- Access: Own deals only
- Can: Create/edit own deals and contacts, view sales pipeline
- Cannot: Edit properties, workflows, settings, view others' deals

**Service Advisors (Future)**
- Role: Service
- Access: Service pipeline only
- Can: Create/edit service deals, view service reports

### Setting User Permissions

1. Go to **Settings** → **Users & Teams**
2. Click on each user
3. Set **Permissions**:
   - **Super Admin:** Full access
   - **Sales:** Set restrictions:
     - View: Own deals only
     - Edit: Own records and unassigned
     - Delete: Own records only
   - **Service:** Restrict to Service Pipeline only

---

## Maintenance & Best Practices

### Weekly Tasks
- Review deals in "Warning" rotting status
- Update lead scores for inactive contacts
- Clean up duplicate contacts
- Review lost deals and patterns

### Monthly Tasks
- Audit custom property usage (remove unused)
- Review workflow performance and optimize
- Update salesperson list if team changes
- Export deals report for accounting

### Quarterly Tasks
- Review pipeline stage conversion rates
- Adjust lead scoring criteria based on performance
- Update automation sequences based on customer feedback
- Train team on new features

---

## Support & Resources

**HubSpot Academy:**
- CRM Setup: https://academy.hubspot.com/courses/crm-setup
- Workflows: https://academy.hubspot.com/courses/workflows

**API Documentation:**
- HubSpot API: https://developers.hubspot.com/docs/api/overview
- Properties API: https://developers.hubspot.com/docs/api/crm/properties

**Revion Consulting Contact:**
- For implementation support or customization
- n8n workflow development
- Advanced automation setup

---

## Appendix: Quick Reference

### Pipeline Stage IDs

**Sales Pipeline:**
- `new_lead`
- `contacted`
- `test_drive_scheduled`
- `test_drive_completed`
- `negotiation`
- `financing`
- `closed_won`
- `closed_lost`

**Service Pipeline:**
- `appointment_requested`
- `confirmed`
- `vehicle_dropped_off`
- `in_service`
- `ready_for_pickup`
- `completed`
- `no_show`
- `cancelled`

### Common HubSpot Field Types

- **Single-line text:** `string` / `text`
- **Multi-line text:** `string` / `textarea`
- **Number:** `number`
- **Currency:** `number` (with currency formatting)
- **Date:** `datetime` / `date`
- **Dropdown:** `enumeration` / `select`
- **Multi-select:** `enumeration` / `checkbox`
- **Checkbox:** `bool` / `booleancheckbox`

---

**Document Version:** 1.0
**Last Updated:** December 1, 2024
**Prepared By:** Revion Consulting - CRM Specialist Agent
