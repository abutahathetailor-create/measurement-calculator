// js/calculator.js
class MeasurementCalculator {
    constructor() {
        this.unit = 'cm';
        this.measurements = {
            bh: 179,  // Body Height
            cg: 100,  // Chest Girth
            wg: 90,   // Waist Girth
            hg: 102,  // Hip Girth
            sl: 64    // Sleeve Length
        };
    }

    setUnit(unit) {
        this.unit = unit;
    }

    setMeasurement(type, value) {
        this.measurements[type] = parseFloat(value) || 0;
    }

    // Convert between cm and inches
    convertValue(value, toUnit) {
        if (toUnit === 'inches') {
            return value * 0.3937;
        } else {
            return value / 0.3937;
        }
    }

    // Core measurement formulas
    calculateAll() {
        const m = this.measurements;
        
        // Convert to cm if inputs are in inches
        let bh_cm = this.unit === 'inches' ? this.convertValue(m.bh, 'cm') : m.bh;
        let cg_cm = this.unit === 'inches' ? this.convertValue(m.cg, 'cm') : m.cg;
        let wg_cm = this.unit === 'inches' ? this.convertValue(m.wg, 'cm') : m.wg;
        let hg_cm = this.unit === 'inches' ? this.convertValue(m.hg, 'cm') : m.hg;
        let sl_cm = this.unit === 'inches' ? this.convertValue(m.sl, 'cm') : m.sl;

        const results = {
            // Basic measurements
            Bh: { cm: bh_cm, description: 'Body Height' },
            Cg: { cm: cg_cm, description: 'Chest Girth' },
            Wg: { cm: wg_cm, description: 'Waist Girth' },
            Hg: { cm: hg_cm, description: 'Hip Girth' },
            Sl: { cm: sl_cm, description: 'Sleeve Length' },

            // Calculated measurements
            Nw: { cm: (1/10 * 1/2 * cg_cm) + 3, description: 'Neck Width' },
            Sd: { cm: (cg_cm/8) + 12.5, description: 'Scye Depth' },
            bwl: { cm: bh_cm/4, description: 'Back Waist Length' },
            Lg: { cm: (bh_cm/2) - (bh_cm/8) - 3, description: 'Length' },
            Ad: { cm: ((cg_cm/8) + 12.5) + 2.5, description: 'Armhole Depth' },
            Bw: { cm: (2/10 * cg_cm) + 1.2, description: 'Back Width' },
            Sw: { cm: (cg_cm/8) + 3, description: 'Scye Width' },
            Cw: { cm: (2/10 * cg_cm) + 0.8, description: 'Chest Width' },
            Aw: { cm: (wg_cm/4) - 1.3, description: 'Abdomen Width' }
        };

        // Add inches conversion
        Object.keys(results).forEach(key => {
            results[key].inches = this.convertValue(results[key].cm, 'inches');
        });

        // Calculate totals
        const totalChestCm = results.Bw.cm + results.Sw.cm + results.Cw.cm;
        const minusCm = cg_cm/2;
        
        results['Total Chest'] = { 
            cm: totalChestCm, 
            inches: this.convertValue(totalChestCm, 'inches'),
            description: 'Total Chest' 
        };
        results['Minus'] = { 
            cm: minusCm, 
            inches: this.convertValue(minusCm, 'inches'),
            description: 'Minus (1/2 Cg)' 
        };
        results['Ease'] = { 
            cm: totalChestCm - minusCm, 
            inches: this.convertValue(totalChestCm - minusCm, 'inches'),
            description: 'Ease' 
        };

        return results;
    }

    // Get measurement for pattern generation
    getPatternMeasurements() {
        const results = this.calculateAll();
        return {
            bodyHeight: results.Bh.cm,
            chestGirth: results.Cg.cm,
            waistGirth: results.Wg.cm,
            hipGirth: results.Hg.cm,
            sleeveLength: results.Sl.cm,
            neckWidth: results.Nw.cm,
            scyeDepth: results.Sd.cm,
            backWaistLength: results.bwl.cm,
            armholeDepth: results.Ad.cm,
            backWidth: results.Bw.cm,
            chestWidth: results.Cw.cm
        };
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MeasurementCalculator;
}