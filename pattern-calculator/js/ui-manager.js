// js/ui-manager.js
class UIManager {
    constructor() {
        this.calculator = new MeasurementCalculator();
        this.patternGenerator = new PatternGenerator();
        this.svgRenderer = null;
        this.currentPattern = null;
    }

    initialize() {
        this.setupEventListeners();
        this.setupSVGRenderer();
        this.calculateAndDisplay();
    }

    setupEventListeners() {
        // Measurement input changes
        const measurementInputs = ['bh', 'cg', 'wg', 'hg', 'sl'];
        measurementInputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', () => {
                    this.calculator.setMeasurement(id, input.value);
                    this.calculateAndDisplay();
                });
            }
        });

        // Unit toggle
        const unitButtons = document.querySelectorAll('.unit-btn');
        unitButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
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
                patternButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.generatePattern(e.target.dataset.patternType);
            });
        });
    }

    setupSVGRenderer() {
        this.svgRenderer = new SVGRenderer('pattern-display');
    }

    calculateAndDisplay() {
        const results = this.calculator.calculateAll();
        this.displayMeasurementResults(results);
        
        if (this.currentPattern) {
            this.generatePattern(this.currentPattern);
        }
    }

    displayMeasurementResults(results) {
        const resultsBody = document.getElementById('results-body');
        if (!resultsBody) return;

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
    }

    generatePattern(patternType) {
        this.currentPattern = patternType;
        const measurements = this.calculator.getPatternMeasurements();
        
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

        this.renderPattern(patternData);
    }

    renderPattern(patternData) {
        if (!this.svgRenderer) return;

        const svg = this.svgRenderer.createSVG(800, 600);
        
        switch (patternData.type) {
            case 'bodice-front':
            case 'bodice-back':
                this.svgRenderer.renderBodice(patternData, svg);
                break;
            case 'sleeve':
                this.svgRenderer.renderSleeve(patternData, svg);
                break;
        }

        // Update pattern info
        this.updatePatternInfo(patternData);
    }

    updatePatternInfo(patternData) {
        const infoElement = document.getElementById('pattern-info');
        if (!infoElement) return;

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
    }

    // Export pattern as SVG
    exportPattern() {
        const svgElement = document.querySelector('#pattern-display svg');
        if (!svgElement) return;

        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgElement);
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `pattern-${this.currentPattern || 'design'}.svg`;
        link.click();
        
        URL.revokeObjectURL(url);
    }

    // Print pattern
    printPattern() {
        window.print();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const uiManager = new UIManager();
    uiManager.initialize();
    
    // Make available globally for debugging
    window.patternApp = uiManager;
});