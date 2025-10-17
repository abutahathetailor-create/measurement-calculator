// js/pattern-generator.js - TEMPLATE-BASED PATTERNS
class PatternGenerator {
    constructor() {
        this.scale = 1.0;
        this.seamAllowance = 2.0;
    }

    // BODICE FRONT - Using template with measurements
    generateBodiceFront(measurements) {
        const m = measurements;
        
        // Scale factors based on chest measurement
        const scaleX = m.chestGirth / 100; // Base on 100cm chest
        const scaleY = m.bodyHeight / 170; // Base on 170cm height
        
        // Template points for a standard bodice front
        const points = {
            // Neckline points
            neckCenter: { x: 0, y: 0 },
            neckShoulder: { x: 8 * scaleX, y: 0 },
            neckCurve1: { x: 3 * scaleX, y: -3 * scaleY },
            neckCurve2: { x: 6 * scaleX, y: -1 * scaleY },
            
            // Shoulder points
            shoulderTip: { x: 25 * scaleX, y: -4 * scaleY },
            
            // Armhole points - CURVED
            armhole1: { x: 22 * scaleX, y: -12 * scaleY },
            armhole2: { x: 18 * scaleX, y: -18 * scaleY },
            armholeDepth: { x: 12 * scaleX, y: -25 * scaleY },
            
            // Side seam
            sideWaist: { x: 15 * scaleX, y: -45 * scaleY },
            
            // Waistline
            waistCenter: { x: 0, y: -45 * scaleY },
            waistCurve1: { x: 5 * scaleX, y: -44 * scaleY },
            waistCurve2: { x: 10 * scaleX, y: -46 * scaleY },
            
            // Bust points
            bustPoint: { x: 10 * scaleX, y: -15 * scaleY },
            bustDartTop: { x: 10 * scaleX, y: -25 * scaleY },
            bustDartBottom: { x: 10 * scaleX, y: -35 * scaleY }
        };

        const seams = {
            // Center front - straight line
            centerFront: [points.neckCenter, points.waistCenter],
            
            // Neckline - curved
            neckline: [
                points.neckCenter,
                points.neckCurve1,
                points.neckCurve2,
                points.neckShoulder
            ],
            
            // Shoulder - straight line
            shoulder: [points.neckShoulder, points.shoulderTip],
            
            // Armhole - curved
            armhole: [
                points.shoulderTip,
                points.armhole1,
                points.armhole2,
                points.armholeDepth
            ],
            
            // Side seam - straight line
            sideSeam: [points.armholeDepth, points.sideWaist],
            
            // Waistline - slightly curved
            waistline: [
                points.sideWaist,
                points.waistCurve2,
                points.waistCurve1,
                points.waistCenter
            ],
            
            // Bust dart
            bustDart: [
                { x: points.bustPoint.x - 2, y: points.bustPoint.y },
                points.bustDartTop,
                { x: points.bustPoint.x + 2, y: points.bustPoint.y }
            ]
        };

        return {
            type: 'bodice-front',
            points: points,
            seams: seams,
            description: 'Bodice Front Block'
        };
    }

    // BODICE BACK - Template based
    generateBodiceBack(measurements) {
        const m = measurements;
        
        const scaleX = m.chestGirth / 100;
        const scaleY = m.bodyHeight / 170;
        
        const points = {
            // Neckline points
            neckCenter: { x: 0, y: 0 },
            neckShoulder: { x: 7 * scaleX, y: 0 },
            neckCurve1: { x: 3 * scaleX, y: -2 * scaleY },
            neckCurve2: { x: 5 * scaleX, y: -0.5 * scaleY },
            
            // Shoulder points
            shoulderTip: { x: 23 * scaleX, y: -3 * scaleY },
            
            // Armhole points
            armhole1: { x: 20 * scaleX, y: -10 * scaleY },
            armhole2: { x: 16 * scaleX, y: -16 * scaleY },
            armholeDepth: { x: 10 * scaleX, y: -24 * scaleY },
            
            // Side seam
            sideWaist: { x: 13 * scaleX, y: -45 * scaleY },
            
            // Waistline
            waistCenter: { x: 0, y: -45 * scaleY },
            
            // Back dart
            backDartTop: { x: 8 * scaleX, y: -20 * scaleY },
            backDartBottom: { x: 8 * scaleX, y: -35 * scaleY }
        };

        const seams = {
            centerBack: [points.neckCenter, points.waistCenter],
            
            neckline: [
                points.neckCenter,
                points.neckCurve1,
                points.neckCurve2,
                points.neckShoulder
            ],
            
            shoulder: [points.neckShoulder, points.shoulderTip],
            
            armhole: [
                points.shoulderTip,
                points.armhole1,
                points.armhole2,
                points.armholeDepth
            ],
            
            sideSeam: [points.armholeDepth, points.sideWaist],
            
            waistline: [points.sideWaist, points.waistCenter],
            
            backDart: [
                { x: points.backDartTop.x - 1.5, y: points.backDartTop.y },
                points.backDartBottom,
                { x: points.backDartTop.x + 1.5, y: points.backDartTop.y }
            ]
        };

        return {
            type: 'bodice-back',
            points: points,
            seams: seams,
            description: 'Bodice Back Block'
        };
    }

    // BASIC SLEEVE - Template based
    generateSleeve(measurements) {
        const m = measurements;
        
        const scaleX = m.chestGirth / 100;
        const scaleY = m.sleeveLength / 60; // Base on 60cm sleeve
        
        const points = {
            // Sleeve cap points
            capCenter: { x: 0, y: 0 },
            capFront1: { x: 8 * scaleX, y: -5 * scaleY },
            capFront2: { x: 12 * scaleX, y: -12 * scaleY },
            capFrontTip: { x: 15 * scaleX, y: -20 * scaleY },
            
            capBack1: { x: -8 * scaleX, y: -6 * scaleY },
            capBack2: { x: -12 * scaleX, y: -14 * scaleY },
            capBackTip: { x: -15 * scaleX, y: -20 * scaleY },
            
            // Wrist points
            wristFront: { x: 10 * scaleX, y: -60 * scaleY },
            wristBack: { x: -10 * scaleX, y: -60 * scaleY },
            
            // Underarm points
            underarmFront: { x: 15 * scaleX, y: -25 * scaleY },
            underarmBack: { x: -15 * scaleX, y: -25 * scaleY }
        };

        const seams = {
            // Sleeve cap front curve
            capFront: [
                points.capCenter,
                points.capFront1,
                points.capFront2,
                points.capFrontTip,
                points.underarmFront
            ],
            
            // Sleeve cap back curve
            capBack: [
                points.capCenter,
                points.capBack1,
                points.capBack2,
                points.capBackTip,
                points.underarmBack
            ],
            
            // Front under seam
            underSeamFront: [points.underarmFront, points.wristFront],
            
            // Back under seam
            underSeamBack: [points.underarmBack, points.wristBack],
            
            // Wrist line
            wristLine: [points.wristFront, points.wristBack]
        };

        return {
            type: 'sleeve',
            points: points,
            seams: seams,
            description: 'Basic Sleeve Block'
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
