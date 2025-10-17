// js/pattern-generator.js - REAL PATTERN DRAFTING
class PatternGenerator {
    constructor() {
        this.scale = 1.0;
        this.seamAllowance = 2.0;
    }

    // REAL BODICE FRONT BLOCK - Professional drafting method
    generateBodiceFront(measurements) {
        const m = measurements;
        
        // Basic bodice block calculations
        const shoulderLength = m.chestGirth * 0.12 + 1;
        const neckWidth = m.chestGirth * 0.06 + 2;
        const neckDepth = neckWidth + 1;
        const armholeDepth = m.chestGirth * 0.25 + 4;
        const waistLength = m.bodyHeight * 0.25;
        const bustDartPosition = m.chestWidth * 0.3;
        const bustDartLength = m.chestGirth * 0.1;
        
        // Key points for bodice front
        const points = {
            // Start at neck point
            A: { x: 0, y: 0 }, // Neck center front
            
            // Neckline
            B: { x: neckWidth, y: 0 }, // Neck shoulder point
            C: { x: 0, y: -neckDepth }, // Neck center depth
            
            // Shoulder line
            D: { 
                x: neckWidth + shoulderLength, 
                y: -shoulderLength * 0.15 
            }, // Shoulder tip
            
            // Armhole points
            E: { x: m.chestWidth * 0.5, y: -armholeDepth }, // Armhole depth
            F: { x: m.chestWidth * 0.25, y: -armholeDepth * 0.7 }, // Armhole curve 1
            G: { x: m.chestWidth * 0.4, y: -armholeDepth * 0.9 }, // Armhole curve 2
            
            // Side seam and waist
            H: { x: m.chestWidth * 0.5 + 2, y: -waistLength }, // Side waist
            I: { x: 0, y: -waistLength }, // Center waist
            
            // Bust points
            J: { x: bustDartPosition, y: -waistLength * 0.3 }, // Bust point
            K: { x: bustDartPosition, y: -waistLength * 0.7 } // Bust dart point
        };

        // Seams - proper garment construction
        const seams = {
            centerFront: [points.A, points.C, points.I],
            neckline: this.createNeckCurve(points.A, points.B, points.C),
            shoulder: [points.B, points.D],
            armhole: this.createArmholeCurve(points.D, points.F, points.G, points.E),
            sideSeam: [points.E, points.H],
            waistline: [points.H, points.I],
            bustDart: this.createBustDart(points.J, points.K, bustDartLength)
        };

        return {
            type: 'bodice-front',
            points: points,
            seams: seams,
            description: 'Bodice Front Block'
        };
    }

    // REAL BODICE BACK BLOCK
    generateBodiceBack(measurements) {
        const m = measurements;
        
        const shoulderLength = m.chestGirth * 0.12;
        const neckWidth = m.chestGirth * 0.06;
        const neckDepth = neckWidth * 0.5;
        const armholeDepth = m.chestGirth * 0.25 + 3;
        const waistLength = m.bodyHeight * 0.25;
        const backDartPosition = m.chestWidth * 0.2;
        
        const points = {
            A: { x: 0, y: 0 }, // Neck center back
            B: { x: neckWidth, y: 0 }, // Neck shoulder point
            C: { x: 0, y: -neckDepth }, // Neck center depth
            
            D: { 
                x: neckWidth + shoulderLength, 
                y: -shoulderLength * 0.1 
            }, // Shoulder tip
            
            E: { x: m.backWidth * 0.5, y: -armholeDepth }, // Armhole depth
            F: { x: m.backWidth * 0.3, y: -armholeDepth * 0.6 },
            G: { x: m.backWidth * 0.45, y: -armholeDepth * 0.8 },
            
            H: { x: m.backWidth * 0.5 + 1, y: -waistLength }, // Side waist
            I: { x: 0, y: -waistLength }, // Center waist
            
            J: { x: backDartPosition, y: -waistLength * 0.5 } // Back dart
        };

        const seams = {
            centerBack: [points.A, points.C, points.I],
            neckline: this.createBackNeckCurve(points.A, points.B, points.C),
            shoulder: [points.B, points.D],
            armhole: this.createBackArmholeCurve(points.D, points.F, points.G, points.E),
            sideSeam: [points.E, points.H],
            waistline: [points.H, points.I],
            backDart: this.createBackDart(points.J, waistLength * 0.15)
        };

        return {
            type: 'bodice-back',
            points: points,
            seams: seams,
            description: 'Bodice Back Block'
        };
    }

    // REAL BASIC SLEEVE BLOCK
    generateSleeve(measurements) {
        const m = measurements;
        
        const sleeveCapHeight = m.chestGirth * 0.15;
        const bicepWidth = m.chestGirth * 0.25;
        const wristWidth = m.chestGirth * 0.12;
        const elbowPosition = m.sleeveLength * 0.4;
        
        const points = {
            A: { x: 0, y: 0 }, // Sleeve cap center
            
            // Sleeve cap front
            B: { x: bicepWidth * 0.45, y: -sleeveCapHeight * 0.3 },
            C: { x: bicepWidth * 0.4, y: -sleeveCapHeight * 0.7 },
            D: { x: bicepWidth * 0.35, y: -sleeveCapHeight },
            
            // Sleeve cap back
            E: { x: -bicepWidth * 0.45, y: -sleeveCapHeight * 0.4 },
            F: { x: -bicepWidth * 0.4, y: -sleeveCapHeight * 0.8 },
            G: { x: -bicepWidth * 0.35, y: -sleeveCapHeight },
            
            // Underarm and wrist
            H: { x: bicepWidth * 0.35, y: -m.sleeveLength }, // Front wrist
            I: { x: -bicepWidth * 0.35, y: -m.sleeveLength }, // Back wrist
            
            // Elbow points
            J: { x: bicepWidth * 0.3, y: -elbowPosition }, // Front elbow
            K: { x: -bicepWidth * 0.3, y: -elbowPosition } // Back elbow
        };

        const seams = {
            sleeveCapFront: this.createSleeveCapCurve([points.A, points.B, points.C, points.D]),
            sleeveCapBack: this.createSleeveCapCurve([points.A, points.E, points.F, points.G]),
            underSeamFront: [points.D, points.J, points.H],
            underSeamBack: [points.G, points.K, points.I],
            wristLine: [points.H, points.I]
        };

        return {
            type: 'sleeve',
            points: points,
            seams: seams,
            description: 'Basic Sleeve Block'
        };
    }

    // CURVE CREATION METHODS
    createNeckCurve(start, shoulder, depth) {
        // Create smooth neck curve
        return [
            start,
            { x: shoulder.x * 0.3, y: -depth.y * 0.3 },
            { x: shoulder.x * 0.7, y: -depth.y * 0.1 },
            shoulder
        ];
    }

    createBackNeckCurve(start, shoulder, depth) {
        return [
            start,
            { x: shoulder.x * 0.4, y: -depth.y * 0.2 },
            { x: shoulder.x * 0.8, y: -depth.y * 0.05 },
            shoulder
        ];
    }

    createArmholeCurve(shoulder, curve1, curve2, armhole) {
        return [
            shoulder,
            curve1,
            curve2,
            armhole
        ];
    }

    createBackArmholeCurve(shoulder, curve1, curve2, armhole) {
        return [
            shoulder,
            curve1,
            curve2,
            armhole
        ];
    }

    createSleeveCapCurve(points) {
        return points; // Simple curve for now
    }

    createBustDart(bustPoint, dartPoint, length) {
        const dartWidth = length * 0.15;
        return [
            { x: bustPoint.x - dartWidth, y: bustPoint.y },
            dartPoint,
            { x: bustPoint.x + dartWidth, y: bustPoint.y }
        ];
    }

    createBackDart(dartPoint, length) {
        const dartWidth = length * 0.2;
        return [
            { x: dartPoint.x - dartWidth, y: dartPoint.y },
            { x: dartPoint.x, y: dartPoint.y - length },
            { x: dartPoint.x + dartWidth, y: dartPoint.y }
        ];
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
