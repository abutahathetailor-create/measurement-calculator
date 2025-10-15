// data/pattern-templates.js
const PatternTemplates = {
    // Standard measurement ratios for pattern drafting
    ratios: {
        shoulderSlope: (measurements) => measurements.chestGirth * 0.05,
        shoulderDrop: (measurements) => measurements.chestGirth * 0.03,
        bustLevel: (measurements) => measurements.bodyHeight * 0.25,
        bustDartWidth: (measurements) => measurements.chestGirth * 0.1,
        dartWidth: (measurements) => measurements.waistGirth * 0.02,
        wristWidth: (measurements) => measurements.chestGirth * 0.1
    },

    // Pattern block definitions
    blocks: {
        'basic-bodice': {
            name: 'Basic Bodice Block',
            description: 'Foundation pattern for tops and dresses',
            pieces: ['front', 'back'],
            requiredMeasurements: ['bodyHeight', 'chestGirth', 'waistGirth', 'backWaistLength']
        },
        'basic-sleeve': {
            name: 'Basic Sleeve Block', 
            description: 'Set-in sleeve foundation',
            pieces: ['sleeve'],
            requiredMeasurements: ['chestGirth', 'sleeveLength', 'scyeDepth']
        },
        'basic-skirt': {
            name: 'Basic Skirt Block',
            description: 'Straight skirt foundation',
            pieces: ['front', 'back'],
            requiredMeasurements: ['waistGirth', 'hipGirth', 'bodyHeight']
        }
    },

    // Get calculated measurements for pattern generation
    getPatternMeasurements(baseMeasurements) {
        const measurements = { ...baseMeasurements };
        
        // Add calculated measurements using ratios
        Object.entries(this.ratios).forEach(([key, ratioFn]) => {
            measurements[key] = ratioFn(baseMeasurements);
        });

        return measurements;
    },

    // Validate if measurements are sufficient for a pattern
    validateMeasurements(patternType, measurements) {
        const block = this.blocks[patternType];
        if (!block) return false;

        return block.requiredMeasurements.every(measurement => 
            measurements[measurement] && measurements[measurement] > 0
        );
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = PatternTemplates;
}