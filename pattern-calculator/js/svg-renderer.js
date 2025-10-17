// js/svg-renderer.js - COMPLETE UPDATED VERSION
class SVGRenderer {
    constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.namespace = 'http://www.w3.org/2000/svg';
    this.scale = 3.0; // INCREASED SCALE - make patterns larger
    this.offsetX = 400;
    this.offsetY = 300;
    }

    // Clear existing SVG
    clear() {
        if (this.container) {
            // Remove all children
            while (this.container.firstChild) {
                this.container.removeChild(this.container.firstChild);
            }
            
            // Hide placeholder
            const placeholder = this.container.querySelector('.pattern-placeholder');
            if (placeholder) {
                placeholder.style.display = 'none';
            }
        }
    }

    // Create SVG element
    createSVG(width, height) {
        this.clear();
        const svg = document.createElementNS(this.namespace, 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        
        // Add light background
        const background = document.createElementNS(this.namespace, 'rect');
        background.setAttribute('width', '100%');
        background.setAttribute('height', '100%');
        background.setAttribute('fill', '#f8f9fa');
        background.setAttribute('stroke', '#dee2e6');
        background.setAttribute('stroke-width', '1');
        svg.appendChild(background);
        
        this.container.appendChild(svg);
        return svg;
    }

    // Convert pattern coordinates to SVG coordinates
    toSVGCoords(point) {
        if (!point || typeof point.x === 'undefined' || typeof point.y === 'undefined') {
            console.warn('Invalid point:', point);
            return { x: this.offsetX, y: this.offsetY };
        }
        return {
            x: (point.x * this.scale) + this.offsetX,
            y: (point.y * this.scale) + this.offsetY
        };
    }

    // Render bodice pattern - SIMPLIFIED: ONLY CUTTING LINES
    renderBodice(patternData, svg) {
        console.log('🎨 Rendering bodice pattern (cutting lines only):', patternData);
        
        const { seams } = patternData;
        
        if (!seams) {
            console.error('No seams data for bodice');
            return;
        }

        // ONLY DRAW CUTTING LINES - no points, no darts
        Object.values(seams).forEach(seamPoints => {
            this.drawSeam(seamPoints, svg, true);
        });

        console.log('✅ Bodice cutting lines rendered');
    }

    // Render sleeve pattern - SIMPLIFIED: ONLY CUTTING LINES
    renderSleeve(patternData, svg) {
        console.log('🎨 Rendering sleeve pattern (cutting lines only):', patternData);
        
        const { seams } = patternData;
        
        if (!seams) {
            console.error('No seams data for sleeve');
            return;
        }

        // ONLY DRAW CUTTING LINES - no points, no darts
        Object.values(seams).forEach(seamPoints => {
            this.drawSeam(seamPoints, svg, true);
        });

        console.log('✅ Sleeve cutting lines rendered');
    }

    // Draw a seam line (cutting line)
    drawSeam(points, svg, isCuttingLine = true) {
        if (!points || points.length < 2) {
            console.warn('Invalid seam points:', points);
            return;
        }

        const path = document.createElementNS(this.namespace, 'path');
        let pathData = '';
        
        points.forEach((point, index) => {
            const svgPoint = this.toSVGCoords(point);
            if (index === 0) {
                pathData = `M ${svgPoint.x} ${svgPoint.y}`;
            } else {
                pathData += ` L ${svgPoint.x} ${svgPoint.y}`;
            }
        });

        path.setAttribute('d', pathData);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', isCuttingLine ? '#2c3e50' : '#6c757d'); // Dark color for cutting lines
        path.setAttribute('stroke-width', isCuttingLine ? '4' : '2'); // Thicker lines for cutting
        path.setAttribute('stroke-dasharray', isCuttingLine ? 'none' : '5,5');
        
        svg.appendChild(path);
    }

    // Draw a point with label (NOT USED IN SIMPLIFIED VERSION)
    drawPoint(point, label, svg, color = '#3498db') {
        // Commented out - we don't want points in simplified version
        /*
        const svgPoint = this.toSVGCoords(point);
        
        const circle = document.createElementNS(this.namespace, 'circle');
        circle.setAttribute('cx', svgPoint.x);
        circle.setAttribute('cy', svgPoint.y);
        circle.setAttribute('r', '6');
        circle.setAttribute('fill', color);
        circle.setAttribute('stroke', '#2c3e50');
        circle.setAttribute('stroke-width', '2');
        svg.appendChild(circle);

        const text = document.createElementNS(this.namespace, 'text');
        text.setAttribute('x', svgPoint.x + 10);
        text.setAttribute('y', svgPoint.y - 10);
        text.setAttribute('font-size', '11');
        text.setAttribute('fill', '#2c3e50');
        text.setAttribute('font-family', 'Arial, sans-serif');
        text.setAttribute('font-weight', 'bold');
        text.textContent = label;
        svg.appendChild(text);
        */
    }

    // Draw a dart (NOT USED IN SIMPLIFIED VERSION)
    drawDart(dart, svg, dartName = '') {
        // Commented out - we don't want darts in simplified version
        /*
        if (!dart || !dart.position) return;
        
        const { position, width, length } = dart;
        
        const leftLeg = [
            { x: position.x - width/2, y: position.y },
            { x: position.x, y: position.y - length }
        ];
        
        const rightLeg = [
            { x: position.x + width/2, y: position.y },
            { x: position.x, y: position.y - length }
        ];

        this.drawSeam(leftLeg, svg, false);
        this.drawSeam(rightLeg, svg, false);

        this.drawPoint(
            { x: position.x, y: position.y - length }, 
            'dart', 
            svg, 
            '#e74c3c'
        );
        */
    }

    // Draw grain line (NOT USED IN SIMPLIFIED VERSION)
    drawGrainLine(start, end, svg, label = 'Grain') {
        // Commented out - we don't want grain lines in simplified version
        /*
        const startPoint = this.toSVGCoords(start);
        const endPoint = this.toSVGCoords(end);
        
        const line = document.createElementNS(this.namespace, 'line');
        line.setAttribute('x1', startPoint.x);
        line.setAttribute('y1', startPoint.y);
        line.setAttribute('x2', endPoint.x);
        line.setAttribute('y2', endPoint.y);
        line.setAttribute('stroke', '#27ae60');
        line.setAttribute('stroke-width', '2');
        line.setAttribute('stroke-dasharray', '5,3');
        svg.appendChild(line);

        this.drawArrowhead(endPoint, Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x), svg);
        */
    }

    // Draw arrowhead for grain line (NOT USED)
    drawArrowhead(point, angle, svg) {
        // Commented out
    }

    // Set scale
    setScale(newScale) {
        this.scale = newScale;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = SVGRenderer;
}

