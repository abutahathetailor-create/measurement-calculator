// js/svg-renderer.js - DEBUG VERSION
class SVGRenderer {
constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.namespace = 'http://www.w3.org/2000/svg';
    this.scale = 0.3; // REDUCED SCALE - patterns were too big
    this.offsetX = 400;
    this.offsetY = 300;
}

    // Clear existing SVG
    clear() {
        console.log("🧹 Clearing container...");
        if (this.container) {
            // Remove any existing SVG
            const oldSVG = this.container.querySelector('svg');
            if (oldSVG) {
                oldSVG.remove();
                console.log("✅ Old SVG removed");
            }
            
            // Hide placeholder
            const placeholder = this.container.querySelector('.pattern-placeholder');
            if (placeholder) {
                placeholder.style.display = 'none';
                console.log("✅ Placeholder hidden");
            }
        }
    }

    // Create SVG element
    createSVG(width, height) {
        console.log("🆕 Creating SVG:", width, height);
        this.clear();
        
        const svg = document.createElementNS(this.namespace, 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svg.style.background = '#ffffff';
        svg.style.border = '2px solid blue'; // Debug border
        
        console.log("SVG created:", svg);

        // Add a simple test shape to verify SVG works
        const testRect = document.createElementNS(this.namespace, 'rect');
        testRect.setAttribute('x', '50');
        testRect.setAttribute('y', '50');
        testRect.setAttribute('width', '100');
        testRect.setAttribute('height', '100');
        testRect.setAttribute('fill', 'red');
        testRect.setAttribute('stroke', 'black');
        testRect.setAttribute('stroke-width', '2');
        svg.appendChild(testRect);
        
        // Add test text
        const testText = document.createElementNS(this.namespace, 'text');
        testText.setAttribute('x', '100');
        testText.setAttribute('y', '120');
        testText.setAttribute('font-size', '16');
        testText.setAttribute('fill', 'black');
        testText.setAttribute('text-anchor', 'middle');
        testText.textContent = 'TEST PATTERN';
        svg.appendChild(testText);
        
        // Insert into container
        if (this.container) {
            this.container.appendChild(svg);
            console.log("✅ SVG inserted into container");
            console.log("Container children:", this.container.children);
        } else {
            console.error("❌ Container not found for SVG insertion");
        }
        
        return svg;
    }

    // Simple test render
    renderTestPattern(svg) {
        console.log("🎨 Rendering test pattern...");
        
        // Add a circle
        const circle = document.createElementNS(this.namespace, 'circle');
        circle.setAttribute('cx', '200');
        circle.setAttribute('cy', '200');
        circle.setAttribute('r', '50');
        circle.setAttribute('fill', 'blue');
        circle.setAttribute('stroke', 'darkblue');
        circle.setAttribute('stroke-width', '3');
        svg.appendChild(circle);
        
        console.log("✅ Test pattern rendered");
    }

    // Convert coordinates (simplified)
    toSVGCoords(point) {
        if (!point || typeof point.x === 'undefined' || typeof point.y === 'undefined') {
            console.error("❌ Invalid point:", point);
            return { x: 200, y: 200 }; // Fallback to center
        }
        return {
            x: (point.x * this.scale) + this.offsetX,
            y: (point.y * this.scale) + this.offsetY
        };
    }

    // Simple pattern rendering
    renderBodice(patternData, svg) {
        console.log("👕 Rendering bodice...", patternData);
        this.renderTestPattern(svg); // Use test pattern for now
    }

    renderSleeve(patternData, svg) {
        console.log("👔 Rendering sleeve...", patternData);
        this.renderTestPattern(svg); // Use test pattern for now
    }

    // Set scale
    setScale(newScale) {
        this.scale = newScale;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = SVGRenderer;
}

