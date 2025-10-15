// js/pattern-generator.js
class PatternGenerator {
    constructor() {
        this.scale = 1; // Scale factor for SVG rendering
        this.seamAllowance = 2.0; // Default seam allowance in cm
    }

    // Basic Bodice Block - Front
    generateBodiceFront(measurements) {
        const m = measurements;
        
        // Key points for bodice front
        const points = {
            // Neck points
            neckCenter: { x: 0, y: 0 },
            neckShoulder: { x: m.neckWidth / 2, y: 0 },
            
            // Shoulder points
            shoulderTip: { x: m.neckWidth / 2 + m.shoulderSlope, y: -m.shoulderDrop },
            
            // Armhole points
            armholeDepth: { x: m.chestWidth / 2, y: -m.scyeDepth },
            
            // Bust points
            bustPoint: { x: m.bustDartWidth / 2, y: -m.bustLevel },
            
            // Waist points
            waistSide: { x: m.waistGirth / 4 + m.dartWidth, y: -m.backWaistLength },
            waistCenter: { x: 0, y: -m.backWaistLength }
        };

        return {
            type: 'bodice-front',
            points: points,
            darts: this.calculateBodiceDarts(m),
            seams: this.generateBodiceSeams(points, m)
        };
    }

    // Basic Bodice Block - Back
    generateBodiceBack(measurements) {
        const m = measurements;
        
        const points = {
            neckCenter: { x: 0, y: 0 },
            neckShoulder: { x: m.neckWidth / 2, y: 0 },
            shoulderTip: { x: m.neckWidth / 2 + m.shoulderSlope, y: -m.shoulderDrop },
            armholeDepth: { x: m.backWidth / 2, y: -m.scyeDepth },
            waistSide: { x: m.waistGirth / 4, y: -m.backWaistLength },
            waistCenter: { x: 0, y: -m.backWaistLength }
        };

        return {
            type: 'bodice-back',
            points: points,
            darts: this.calculateBackDarts(m),
            seams: this.generateBodiceSeams(points, m)
        };
    }

    // Basic Sleeve Block
    generateSleeve(measurements) {
        const m = measurements;
        
        // Sleeve cap calculations
        const capHeight = m.scyeDepth * 0.8;
        const bicepWidth = m.chestGirth * 0.2;
        
        const points = {
            capCenter: { x: 0, y: 0 },
            capFront: { x: bicepWidth / 2, y: -capHeight * 0.3 },
            capBack: { x: -bicepWidth / 2, y: -capHeight * 0.4 },
            underarm: { x: bicepWidth / 2, y: -capHeight },
            wristFront: { x: m.wristWidth / 2, y: -m.sleeveLength },
            wristBack: { x: -m.wristWidth / 2, y: -m.sleeveLength }
        };

        return {
            type: 'sleeve',
            points: points,
            seams: this.generateSleeveSeams(points)
        };
    }

    // Calculate dart placements
    calculateBodiceDarts(measurements) {
        return {
            bustDart: {
                position: { x: measurements.chestWidth * 0.3, y: -measurements.bustLevel },
                width: measurements.chestGirth * 0.02,
                length: measurements.bustLevel * 0.6
            },
            waistDart: {
                position: { x: measurements.waistGirth * 0.15, y: -measurements.backWaistLength },
                width: measurements.waistGirth * 0.03,
                length: measurements.backWaistLength * 0.4
            }
        };
    }

    calculateBackDarts(measurements) {
        return {
            shoulderDart: {
                position: { x: measurements.neckWidth * 0.4, y: -measurements.shoulderDrop * 0.5 },
                width: measurements.shoulderSlope * 0.2,
                length: measurements.backWidth * 0.3
            },
            waistDart: {
                position: { x: measurements.waistGirth * 0.1, y: -measurements.backWaistLength },
                width: measurements.waistGirth * 0.04,
                length: measurements.backWaistLength * 0.5
            }
        };
    }

    // Generate seam lines from points
    generateBodiceSeams(points, measurements) {
        return {
            neckline: [points.neckCenter, points.neckShoulder],
            shoulder: [points.neckShoulder, points.shoulderTip],
            armhole: [points.shoulderTip, points.armholeDepth],
            sideSeam: [points.armholeDepth, points.waistSide],
            waistline: [points.waistSide, points.waistCenter],
            centerFront: [points.waistCenter, points.neckCenter]
        };
    }

    generateSleeveSeams(points) {
        return {
            capFront: [points.capCenter, points.capFront, points.underarm],
            capBack: [points.capCenter, points.capBack, points.underarm],
            underSeam: [points.underarm, points.wristFront],
            wrist: [points.wristFront, points.wristBack]
        };
    }

    // Set scale for different display sizes
    setScale(newScale) {
        this.scale = newScale;
    }

    // Set seam allowance
    setSeamAllowance(allowance) {
        this.seamAllowance = allowance;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = PatternGenerator;
}