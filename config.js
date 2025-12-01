/**
 * Fast Track Motors - Configuration
 *
 * Update these values before deploying to production.
 * All forms will use these centralized settings.
 */

window.FTM_CONFIG = {
    // n8n Webhook URL - Update this with your production webhook URL
    // For localhost testing: 'http://localhost:5678/webhook/ftm-lead'
    // For tunnel (ngrok/cloudflare): 'https://your-tunnel.ngrok.io/webhook/ftm-lead'
    webhookUrl: 'http://localhost:5678/webhook/ftm-lead',

    // Company Information
    company: {
        name: 'Fast Track Motors',
        phone: '(201) 340-6400',
        phoneLink: '+12013406400',
        address: '509 10th Ave, Paterson, NJ 07514',
        email: 'sales@fasttrackmotors.com'
    },

    // Alert Recipients (for n8n workflow)
    alerts: {
        phone1: '+12013406400', // Primary recipient
        phone2: '',             // Secondary recipient (optional)
        email: 'sales@fasttrackmotors.com'
    },

    // Demo Mode Settings
    demo: {
        // When true, forms will simulate success without hitting webhook
        // Set to false in production
        enabled: false,

        // Simulate this delay (ms) for demo submissions
        delay: 1000
    }
};

// Set the global webhook URL for backward compatibility
window.FTM_WEBHOOK_URL = window.FTM_CONFIG.webhookUrl;

// Log config status (remove in production)
if (window.FTM_CONFIG.demo.enabled) {
    console.log('FTM Config: Demo mode enabled. Forms will simulate success.');
} else {
    console.log('FTM Config: Production mode. Forms will submit to:', window.FTM_CONFIG.webhookUrl);
}
