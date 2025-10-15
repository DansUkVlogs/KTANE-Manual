// Prevent duplicate initialization
if (typeof window.VentingGasModule === 'undefined') {

class VentingGasModule {
    constructor() {
        // No initialization needed for instructional content
        console.log('Venting Gas instructional module loaded');
    }
}

// Mark as loaded to prevent duplicates
window.VentingGasModule = VentingGasModule;

// Initialize the module (minimal setup for instructional content)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new VentingGasModule();
    });
} else {
    new VentingGasModule();
}

}