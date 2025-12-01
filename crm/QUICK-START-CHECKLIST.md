# HubSpot CRM Quick Start Checklist
## Fast Track Motors - Implementation Guide

**Use this checklist to implement the complete HubSpot CRM configuration in the correct order.**

---

## Phase 1: HubSpot Account Setup (15 minutes)

- [ ] **1.1** Sign up for HubSpot account (Free or Starter tier)
  - URL: https://www.hubspot.com/products/get-started
  - Use business email: contact@fasttrackmotors.com

- [ ] **1.2** Complete initial account setup
  - Company name: Fast Track Motors
  - Industry: Automotive Sales & Service
  - Location: Paterson, NJ

- [ ] **1.3** Invite team members
  - Ali (Owner) - Super Admin
  - Robert, Ramon, Julio, Leo, Jorge, Isaac, David - Sales users

---

## Phase 2: Property Groups & Custom Properties (45 minutes)

### Option A: Manual Creation (Recommended for first-time)

- [ ] **2.1** Create Property Groups
  - [ ] Navigate to Settings > Data Management > Properties > Groups tab
  - [ ] Create "Dealership Information" (contacts)
  - [ ] Create "Deal Information" (deals)
  - [ ] Create "Service Information" (deals)

- [ ] **2.2** Create Contact Properties (10 properties)
  - [ ] `lead_source` (Dropdown - 10 options)
  - [ ] `credit_situation` (Dropdown - 6 options)
  - [ ] `vehicle_interest` (Text)
  - [ ] `budget_range` (Dropdown - 6 options)
  - [ ] `preferred_contact_method` (Dropdown - 4 options)
  - [ ] `has_trade_in` (Checkbox)
  - [ ] `trade_in_vehicle` (Text)
  - [ ] `primary_language` (Dropdown - 3 options)
  - [ ] `customer_vehicles` (Text Area)
  - [ ] `ftm_lead_score` (Number)

- [ ] **2.3** Create Deal Properties (24 properties)
  - **Sales Properties (20):**
    - [ ] `stock_number` (Text)
    - [ ] `vehicle_vin` (Text)
    - [ ] `vehicle_year` (Number)
    - [ ] `vehicle_make` (Text)
    - [ ] `vehicle_model` (Text)
    - [ ] `vehicle_trim` (Text)
    - [ ] `vehicle_mileage` (Number)
    - [ ] `asking_price` (Number)
    - [ ] `trade_in_value` (Number)
    - [ ] `down_payment` (Number)
    - [ ] `amount_financed` (Number)
    - [ ] `monthly_payment` (Number)
    - [ ] `loan_term_months` (Dropdown - 5 options)
    - [ ] `apr` (Number)
    - [ ] `lender` (Text)
    - [ ] `gross_profit` (Number - Hidden)
    - [ ] `test_drive_date` (Date)
    - [ ] `delivery_date` (Date)
    - [ ] `reason_lost` (Dropdown - 8 options)
    - [ ] `salesperson` (Dropdown - 8 options)
  - **Service Properties (4):**
    - [ ] `service_type` (Multi-checkbox - 9 options)
    - [ ] `service_vehicle` (Text)
    - [ ] `service_mileage` (Number)
    - [ ] `appointment_datetime` (Date)

### Option B: API/Programmatic Creation (Advanced)

- [ ] **2.4** Use `hubspot-properties.json` with HubSpot API
  - [ ] Create Private App in HubSpot (Settings > Integrations > Private Apps)
  - [ ] Copy Access Token
  - [ ] Use n8n or script to bulk create properties
  - [ ] See `/crm/N8N-INTEGRATION.md` for API details

---

## Phase 3: Pipeline Configuration (30 minutes)

### Sales Pipeline

- [ ] **3.1** Create "Fast Track Motors - Vehicle Sales" pipeline
  - [ ] Go to Settings > Objects > Deals > Pipelines tab
  - [ ] Click "Create pipeline"
  - [ ] Name: "Fast Track Motors - Vehicle Sales"

- [ ] **3.2** Add Sales Pipeline Stages (8 stages)
  - [ ] New Lead (5% probability)
  - [ ] Contacted (15% probability)
  - [ ] Test Drive Scheduled (35% probability)
  - [ ] Test Drive Completed (50% probability)
  - [ ] Negotiation (65% probability)
  - [ ] Financing (80% probability)
  - [ ] Sold (100% probability - Closed Won)
  - [ ] Lost (0% probability - Closed Lost)

- [ ] **3.3** Configure stage rotting alerts
  - [ ] Enable rotting for all stages
  - [ ] Set warning/critical days per stage (see HUBSPOT-SETUP.md)

### Service Pipeline

- [ ] **3.4** Create "Fast Track Motors - Service Department" pipeline
  - [ ] Click "Create pipeline"
  - [ ] Name: "Fast Track Motors - Service Department"

- [ ] **3.5** Add Service Pipeline Stages (8 stages)
  - [ ] Appointment Requested (30% probability)
  - [ ] Confirmed (60% probability)
  - [ ] Vehicle Dropped Off (75% probability)
  - [ ] In Service (85% probability)
  - [ ] Ready for Pickup (95% probability)
  - [ ] Completed (100% probability - Closed Won)
  - [ ] No Show (0% probability - Closed Lost)
  - [ ] Cancelled (0% probability - Closed Lost)

---

## Phase 4: Lead Scoring (30 minutes)

- [ ] **4.1** Create score-based contact lists
  - [ ] Hot Leads (ftm_lead_score >= 70)
  - [ ] Warm Leads (ftm_lead_score 40-69)
  - [ ] Cool Leads (ftm_lead_score 20-39)
  - [ ] Cold Leads (ftm_lead_score < 20)

- [ ] **4.2** Set up lead scoring calculation
  - **Option A:** Manual scoring (Free tier)
  - **Option B:** n8n automated scoring (Recommended)
    - [ ] Build n8n workflow to calculate score
    - [ ] Update `ftm_lead_score` via API
    - [ ] See `/crm/N8N-INTEGRATION.md` for details

---

## Phase 5: Workflows & Automation (60 minutes)

**Note:** Workflows require HubSpot Starter tier or higher. For Free tier, use n8n to replicate via API.

### Critical Workflows

- [ ] **5.1** New Lead Assignment & Alert
  - [ ] Trigger: Deal created in "New Lead" stage
  - [ ] Actions: Assign salesperson, create task, send SMS alert

- [ ] **5.2** Test Drive Reminder Sequence
  - [ ] Trigger: Deal enters "Test Drive Scheduled"
  - [ ] Actions: Confirmation email, 24h reminder, 1h reminder

- [ ] **5.3** Deal Won - Post-Sale
  - [ ] Trigger: Deal enters "Sold" stage
  - [ ] Actions: Thank you email, review request (3 days), service reminders

- [ ] **5.4** Deal Lost - Nurture
  - [ ] Trigger: Deal enters "Lost" stage
  - [ ] Actions: Require reason, add to nurture sequence, 30-day task

- [ ] **5.5** Service Appointment Reminders
  - [ ] Trigger: Deal in "Confirmed" stage (Service Pipeline)
  - [ ] Actions: 24h reminder SMS, 1h reminder SMS

---

## Phase 6: Voice AI Integration (90 minutes)

- [ ] **6.1** HubSpot API Setup
  - [ ] Create Private App: "Fast Track Motors n8n Integration"
  - [ ] Grant required scopes (see N8N-INTEGRATION.md)
  - [ ] Copy Access Token for n8n

- [ ] **6.2** n8n Workflow Development
  - [ ] Import workflow from `/crm/N8N-INTEGRATION.md`
  - [ ] Configure HubSpot credentials
  - [ ] Configure Twilio credentials (for SMS)
  - [ ] Get webhook URL from n8n

- [ ] **6.3** Retell AI Webhook Configuration
  - [ ] Log into Retell AI dashboard
  - [ ] Set webhook URL to n8n endpoint
  - [ ] Configure authentication

- [ ] **6.4** Testing
  - [ ] Send test webhook payload
  - [ ] Verify contact created in HubSpot
  - [ ] Verify deal created in correct pipeline
  - [ ] Verify lead score calculated
  - [ ] Verify SMS alert sent (if hot lead)

---

## Phase 7: Dashboards & Reporting (30 minutes)

- [ ] **7.1** Create Sales Dashboard
  - [ ] Go to Reports > Dashboards > Create dashboard
  - [ ] Name: "Fast Track Motors - Sales Performance"
  - [ ] Add reports:
    - [ ] Pipeline overview (deals by stage)
    - [ ] Win rate (closed won vs lost)
    - [ ] Lead source performance
    - [ ] Hot leads list
    - [ ] Salesperson leaderboard

- [ ] **7.2** Create Service Dashboard
  - [ ] Create dashboard: "Fast Track Motors - Service Operations"
  - [ ] Add reports:
    - [ ] Appointments today
    - [ ] In service now
    - [ ] Ready for pickup
    - [ ] Service type breakdown
    - [ ] Completion rate

---

## Phase 8: Team Permissions & Access (15 minutes)

- [ ] **8.1** Configure User Roles
  - [ ] Ali (Owner): Super Admin - Full access
  - [ ] Salespeople: Sales role - Own deals only
  - [ ] Set view/edit restrictions per user

- [ ] **8.2** Create Team Views
  - [ ] Create saved filter: "My Open Deals"
  - [ ] Create saved filter: "Hot Leads (My Territory)"
  - [ ] Pin filters to sidebar

---

## Phase 9: Testing & Validation (45 minutes)

- [ ] **9.1** Create Test Records
  - [ ] Create test contact with all properties filled
  - [ ] Create test sales deal
  - [ ] Move deal through all stages
  - [ ] Create test service deal
  - [ ] Move service deal through all stages

- [ ] **9.2** Test Automations
  - [ ] Verify workflow triggers fire correctly
  - [ ] Check email/SMS notifications received
  - [ ] Verify lead score updates
  - [ ] Test deal rotting alerts

- [ ] **9.3** Voice AI End-to-End Test
  - [ ] Make test call to Voice AI receptionist
  - [ ] Provide complete lead information
  - [ ] Verify lead captured in HubSpot within 30 seconds
  - [ ] Verify salesperson receives SMS alert
  - [ ] Verify all data fields populated correctly

---

## Phase 10: Go Live (30 minutes)

- [ ] **10.1** Final Checklist
  - [ ] All properties created and visible
  - [ ] Both pipelines configured correctly
  - [ ] Workflows active and tested
  - [ ] Voice AI integration working
  - [ ] Team trained on CRM usage
  - [ ] Dashboards accessible to team

- [ ] **10.2** Enable Production Mode
  - [ ] Set Retell AI to production webhook
  - [ ] Activate all HubSpot workflows
  - [ ] Enable n8n workflow
  - [ ] Monitor first 10 leads closely

- [ ] **10.3** Communication
  - [ ] Announce CRM launch to team
  - [ ] Share dashboard links
  - [ ] Provide quick reference guide
  - [ ] Schedule training session if needed

---

## Post-Launch Monitoring (First 30 Days)

### Week 1
- [ ] Review 100% of leads captured
- [ ] Verify data quality and completeness
- [ ] Adjust lead scoring if needed
- [ ] Fix any workflow bugs

### Week 2
- [ ] Analyze pipeline conversion rates
- [ ] Review lead source performance
- [ ] Optimize SMS alert timing
- [ ] Gather team feedback

### Week 3-4
- [ ] Audit custom property usage
- [ ] Remove unused properties
- [ ] Create additional reports as needed
- [ ] Train team on advanced features

---

## Maintenance Schedule

### Daily
- [ ] Check for rotting deals (morning)
- [ ] Review hot leads list
- [ ] Monitor workflow execution logs

### Weekly
- [ ] Review lost deals and patterns
- [ ] Clean up duplicate contacts
- [ ] Update salesperson assignments if needed

### Monthly
- [ ] Export deals report for accounting
- [ ] Review and adjust lead scoring criteria
- [ ] Update automation sequences based on performance
- [ ] Team training on new features

---

## Support Resources

**Documentation:**
- Complete Setup Guide: `/crm/HUBSPOT-SETUP.md`
- n8n Integration: `/crm/N8N-INTEGRATION.md`
- API Schema: `/crm/hubspot-properties.json`

**HubSpot Resources:**
- Academy: https://academy.hubspot.com
- API Docs: https://developers.hubspot.com/docs/api/overview
- Support: https://help.hubspot.com

**Revion Consulting Support:**
- For implementation assistance
- Custom workflow development
- Advanced automation setup

---

## Estimated Total Time

| Phase | Time | Complexity |
|-------|------|------------|
| Account Setup | 15 min | Easy |
| Properties | 45 min | Medium |
| Pipelines | 30 min | Easy |
| Lead Scoring | 30 min | Medium |
| Workflows | 60 min | Hard |
| Voice AI Integration | 90 min | Hard |
| Dashboards | 30 min | Easy |
| Permissions | 15 min | Easy |
| Testing | 45 min | Medium |
| Go Live | 30 min | Easy |
| **TOTAL** | **6 hours** | - |

**Recommendation:** Complete Phases 1-5 manually in HubSpot (3 hours), then work with Revion Consulting on Phase 6 (Voice AI integration) for optimal results.

---

**Document Version:** 1.0
**Last Updated:** December 1, 2024
**Prepared By:** Revion Consulting - CRM Specialist Agent
