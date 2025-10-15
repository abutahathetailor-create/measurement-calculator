// js/ui-manager.js - DEBUG VERSION
class UIManager {
    constructor() {
        console.log("✅ UIManager constructor called");
        this.calculator = new MeasurementCalculator();
        console.log("✅ Calculator initialized:", this.calculator);
        this.patternGenerator = new PatternGenerator();
        console.log("✅ PatternGenerator initialized:", this.patternGenerator);
        this.svgRenderer = null;
        this.currentPattern = null;
    }

    initialize() {
        console.log("🚀 UIManager.initialize() called");
        this.setupEventListeners();
        this.setupSVGRenderer();
        this.calculateAndDisplay();
        console.log("✅ UIManager fully initialized");
    }

    setupEventListeners() {
        console.log("🔧 Setting up event listeners");
        
        // Test if elements exist
        const testElements = ['bh', 'cg', 'wg', 'hg', 'sl', 'pattern-display'];
        testElements.forEach(id => {
            const element = document.getElementById(id);
            console.log(`Element #${id}:`, element ? '✅ FOUND' : '❌ MISSING');
        });

        // Measurement input changes
        const measurementInputs = ['bh', 'cg', 'wg', 'hg', 'sl'];
        measurementInputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', () => {
                    console.log(`Input ${id} changed:`, input.value);
                    this.calculator.setMeasurement(id, input.value);
                    this.calculateAndDisplay();
                });
            }
        });

        // Unit toggle
        const unitButtons = document.querySelectorAll('.unit-btn');
        unitButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                console.log("Unit button clicked:", e.target.textContent);
                unitButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.calculator.setUnit(e.target.textContent.includes('cm') ? 'cm' : 'inches');
                this.calculateAndDisplay();
            });
        });

        // Pattern type selection
        const patternButtons = document.querySelectorAll('.pattern-type-btn');
        patternButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                console.log("Pattern button clicked:", e.target.dataset.patternType);
                patternButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.generatePattern(e.target.dataset.patternType);
            });
        });

        console.log("✅ Event listeners setup complete");
    }

    setupSVGRenderer() {
        console.log("🎨 Setting up SVG Renderer");
        const container = document.getElementById('pattern-display');
        console.log("Pattern display container:", container);
        
        this.svgRenderer = new SVGRenderer('pattern-display');
        console.log("✅ SVG Renderer initialized:", this.svgRenderer);
    }

    calculateAndDisplay() {
        console.log("📊 Calculating measurements...");
        try {
            const results = this.calculator.calculateAll();
            console.log("✅ Calculation results:", results);
            this.displayMeasurementResults(results);
            
            if (this.currentPattern) {
                console.log("🔄 Regenerating current pattern:", this.currentPattern);
                this.generatePattern(this.currentPattern);
            }
        } catch (error) {
            console.error("❌ Calculation error:", error);
        }
    }

    displayMeasurementResults(results) {
        console.log("📋 Displaying measurement results");
        const resultsBody = document.getElementById('results-body');
        if (!resultsBody) {
            console.error("❌ results-body element not found!");
            return;
        }

        resultsBody.innerHTML = '';

        Object.entries(results).forEach(([key, data]) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${key}</strong></td>
                <td>${data.description}</td>
                <td>${data.cm.toFixed(2)} cm</td>
                <td>${data.inches.toFixed(2)} inches</td>
            `;
            resultsBody.appendChild(row);
        });
        console.log("✅ Results table updated");
    }

    generatePattern(patternType) {
        console.log("✂️ Generating pattern:", patternType);
        this.currentPattern = patternType;
        
        try {
            const measurements = this.calculator.getPatternMeasurements();
            console.log("Pattern measurements:", measurements);

            let patternData;
            switch (patternType) {
                case 'bodice-front':
                    patternData = this.patternGenerator.generateBodiceFront(measurements);
                    break;
                case 'bodice-back':
                    patternData = this.patternGenerator.generateBodiceBack(measurements);
                    break;
                case 'sleeve':
                    patternData = this.patternGenerator.generateSleeve(measurements);
                    break;
                default:
                    patternData = this.patternGenerator.generateBodiceFront(measurements);
            }

            console.log("✅ Pattern data generated:", patternData);
            this.renderPattern(patternData);
        } catch (error) {
            console.error("❌ Pattern generation error:", error);
        }
    }

    renderPattern(patternData) {
        console.log("🎨 Rendering pattern...");
        if (!this.svgRenderer) {
            console.error("❌ SVG Renderer not initialized!");
            return;
        }

        try {
            const svg = this.svgRenderer.createSVG(800, 600);
            console.log("✅ SVG element created:", svg);
            
            switch (patternData.type) {
                case 'bodice-front':
                case 'bodice-back':
                    this.svgRenderer.renderBodice(patternData, svg);
                    break;
                case 'sleeve':
                    this.svgRenderer.renderSleeve(patternData, svg);
                    break;
            }

            console.log("✅ Pattern rendered successfully");
            this.updatePatternInfo(patternData);
        } catch (error) {
            console.error("❌ Pattern rendering error:", error);
        }
    }

    updatePatternInfo(patternData) {
        console.log("📝 Updating pattern info");
        const infoElement = document.getElementById('pattern-info');
        if (!infoElement) {
            console.error("❌ pattern-info element not found!");
            return;
        }

        const patternNames = {
            'bodice-front': 'Bodice Front Block',
            'bodice-back': 'Bodice Back Block', 
            'sleeve': 'Basic Sleeve Block'
        };

        infoElement.innerHTML = `
            <h4>${patternNames[patternData.type] || 'Pattern'}</h4>
            <p>Scale: 1:${this.svgRenderer.scale}</p>
            <p>Seam Allowance: ${this.patternGenerator.seamAllowance}cm</p>
        `;
        console.log("✅ Pattern info updated");
    }

    exportPattern() {
        console.log("💾 Exporting pattern...");
        // ... rest of export method
    }

    printPattern() {
        console.log("🖨️ Printing pattern...");
        window.print();
    }
}

// Enhanced initialization with error handling
document.addEventListener('DOMContentLoaded', () => {
    console.log("📄 DOM Content Loaded - Starting app initialization");
    
    try {
        console.log("🔍 Checking if required classes exist:");
        console.log("- MeasurementCalculator:", typeof MeasurementCalculator);
        console.log("- PatternGenerator:", typeof PatternGenerator);
        console.log("- SVGRenderer:", typeof SVGRenderer);
        
        const uiManager = new UIManager();
        uiManager.initialize();
        
        // Make available globally for debugging
        window.patternApp = uiManager;
        console.log("🎉 App initialized successfully! Available as window.patternApp");
        
    } catch (error) {
        console.error("💥 CRITICAL ERROR during app initialization:", error);
        alert("Error initializing pattern calculator. Check console for details.");
    }
});
