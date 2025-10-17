// js/pattern-generator.js - FIXED SCALE VERSION
class PatternGenerator {
    constructor() {
        this.scale = 10; // Increased scale for better visibility
        this.seamAllowance = 2.0;
    }

    // Basic Bodice Block - Front (SIMPLIFIED FOR TESTING)
    generateBodiceFront(measurements) {
        console.log("📐 Generating bodice front with measurements:", measurements);
        
        const m = measurements;
        
        // SIMPLIFIED POINTS - LARGER AND BETTER SPACED
        const points = {
            // Neck points (centered, larger spacing)
            neckCenter: { x: 0, y: 0 },
            neckShoulder: { x: m.neckWidth * 2, y: 0 },
            
            // Shoulder points (proper spacing)
            shoulderTip: { x: m.neckWidth * 2 + m.shoulderSlope * 3, y: -m.shoulderDrop * 3 },
            
            // Armhole points (larger, visible)
            armholeDepth: { x: m.chestWidth, y: -m.scyeDepth * 2 },
            
            // Waist points (proper body proportions)
            waistSide: { x: m.waistGirth / 2, y: -m.backWaistLength * 2 },
            waistCenter: { x: 0, y: -m.backWaistLength * 2 }
        };

        console.log("📊 Bodice front points:", points);

        return {
            type: 'bodice-front',
            points: points,
            darts: this.calculateBodiceDarts(m),
            seams: this.generateBodiceSeams(points, m)
        };
    }

    // Basic Bodice Block - Back (SIMPLIFIED)
    generateBodiceBack(measurements) {
        console.log("📐 Generating bodice back with measurements:", measurements);
        
        const m = measurements;
        
        const points = {
            neckCenter: { x: 0, y: 0 },
            neckShoulder: { x: m.neckWidth * 2, y: 0 },
            shoulderTip: { x: m.neckWidth * 2 + m.shoulderSlope * 3, y: -m.shoulderDrop * 3 },
            armholeDepth: { x: m.backWidth, y: -m.scyeDepth * 2 },
            waistSide: { x: m.waistGirth / 2, y: -m.backWaistLength * 2 },
            waistCenter: { x: 0, y: -m.backWaistLength * 2 }
        };

        console.log("📊 Bodice back points:", points);

        return {
            type: 'bodice-back',
            points: points,
            darts: this.calculateBackDarts(m),
            seams: this.generateBodiceSeams(points, m)
        };
    }

    // Basic Sleeve Block (SIMPLIFIED)
    generateSleeve(measurements) {
        console.log("📐 Generating sleeve with measurements:", measurements);
        
        const m = measurements;
        
        // LARGER SLEEVE FOR BETTER VISIBILITY
        const capHeight = m.scyeDepth * 3;
        const bicepWidth = m.chestGirth * 0.5;
        
        const points = {
            capCenter: { x: 0, y: 0 },
            capFront: { x: bicepWidth, y: -capHeight * 0.3 },
            capBack: { x: -bicepWidth, y: -capHeight * 0.4 },
            underarm: { x: bicepWidth, y: -capHeight },
            wristFront: { x: m.wristWidth, y: -m.sleeveLength * 2 },
            wristBack: { x: -m.wristWidth, y: -m.sleeveLength * 2 }
        };

        console.log("📊 Sleeve points:", points);

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
                position: { x: measurements.chestWidth * 0.6, y: -measurements.bustLevel * 1.5 },
                width: measurements.chestGirth * 0.05,
                length: measurements.bustLevel
            },
            waistDart: {
                position: { x: measurements.waistGirth * 0.3, y: -measurements.backWaistLength * 1.8 },
                width: measurements.waistGirth * 0.06,
                length: measurements.backWaistLength
            }
        };
    }

    calculateBackDarts(measurements) {
        return {
            shoulderDart: {
                position: { x: measurements.neckWidth, y: -measurements.shoulderDrop * 1.5 },
                width: measurements.shoulderSlope * 0.5,
                length: measurements.backWidth * 0.4
            },
            waistDart: {
                position: { x: measurements.waistGirth * 0.2, y: -measurements.backWaistLength * 1.8 },
                width: measurements.waistGirth * 0.08,
                length: measurements.backWaistLength * 0.6
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

    setScale(newScale) {
        this.scale = newScale;
    }

    setSeamAllowance(allowance) {
        this.seamAllowance = allowance;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = PatternGenerator;
}
