// Prevent duplicate initialization
if (typeof window.CapacitorDischargeModule === 'undefined') {

class CapacitorDischargeModule {
    constructor() {
        // No initialization needed for instructional content
        console.log('Capacitor Discharge instructional module loaded');
    }
}

// Mark as loaded to prevent duplicates
window.CapacitorDischargeModule = CapacitorDischargeModule;

// Initialize the module (minimal setup for instructional content)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new CapacitorDischargeModule();
    });
} else {
    new CapacitorDischargeModule();
}

}