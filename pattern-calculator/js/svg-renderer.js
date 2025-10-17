// js/svg-renderer.js - CLEAN VERSION (NO TEST PATTERN)
class SVGRenderer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.namespace = 'http://www.w3.org/2000/svg';
        this.scale = 2.0; // Good scale for visibility
        this.offsetX = 400;
        this.offsetY = 300;
    }

    // Clear existing SVG
    clear() {
        if (this.container) {
            this.container.innerHTML = '';
            
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
        
        // Add background
        const background = document.createElementNS(this.namespace, 'rect');
        background.setAttribute('width', '100%');
        background.setAttribute('height', '100%');
        background.setAttribute('fill', '#ffffff');
        background.setAttribute('stroke', '#dee2e6');
        background.setAttribute('stroke-width', '1');
        svg.appendChild(background);
        
        this.container.appendChild(svg);
        return svg;
    }

    // Convert pattern coordinates to SVG coordinates
    toSVGCoords(point) {
        return {
            x: (point.x * this.scale) + this.offsetX,
            y: (point.y * this.scale) + this.offsetY
        };
    }

    // Render bodice pattern
    renderBodice(patternData, svg) {
        const { points, darts, seams } = patternData;
        
        console.log("Rendering bodice with points:", points);
        
        // Draw seams
        if (seams) {
            Object.values(seams).forEach(seam => {
                this.drawSeam(seam, svg);
            });
        }

        // Draw darts
        if (darts) {
            Object.values(darts).forEach(dart => {
                this.drawDart(dart, svg);
            });
        }

        // Draw points and labels
        if (points) {
            Object.entries(points).forEach(([name, point]) => {
                this.drawPoint(point, name, svg);
            });
        }

        // Add grain line
        if (points.waistCenter && points.neckCenter) {
            this.drawGrainLine(points.waistCenter, points.neckCenter, svg);
        }
    }

    // Render sleeve pattern
    renderSleeve(patternData, svg) {
        const { points, seams } = patternData;
        
        console.log("Rendering sleeve with points:", points);
        
        // Draw seams
        if (seams) {
            Object.values(seams).forEach(seam => {
                this.drawSeam(seam, svg);
            });
        }

        // Draw points
        if (points) {
            Object.entries(points).forEach(([name, point]) => {
                this.drawPoint(point, name, svg);
            });
        }

        // Add grain line
        if (points.capCenter && points.wristFront) {
            this.drawGrainLine(points.capCenter, points.wristFront, svg);
        }
    }

    // Draw a seam line
    drawSeam(points, svg, isCuttingLine = true) {
        if (!points || points.length < 2) return;

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
        path.setAttribute('stroke', isCuttingLine ? '#2c3e50' : '#6c757d');
        path.setAttribute('stroke-width', isCuttingLine ? '3' : '2');
        path.setAttribute('stroke-dasharray', isCuttingLine ? 'none' : '5,5');
        
        svg.appendChild(path);
    }

    // Draw a dart
    drawDart(dart, svg) {
        if (!dart || !dart.position) return;
        
        const { position, width, length } = dart;
        
        // Dart legs
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

        // Dart point
        this.drawPoint(
            { x: position.x, y: position.y - length }, 
            'dart', 
            svg, 
            '#e74c3c'
        );
    }

    // Draw a point with label
    drawPoint(point, label, svg, color = '#3498db') {
        const svgPoint = this.toSVGCoords(point);
        
        const circle = document.createElementNS(this.namespace, 'circle');
        circle.setAttribute('cx', svgPoint.x);
        circle.setAttribute('cy', svgPoint.y);
        circle.setAttribute('r', '5');
        circle.setAttribute('fill', color);
        circle.setAttribute('stroke', '#2c3e50');
        circle.setAttribute('stroke-width', '2');
        svg.appendChild(circle);

        // Add label
        const text = document.createElementNS(this.namespace, 'text');
        text.setAttribute('x', svgPoint.x + 8);
        text.setAttribute('y', svgPoint.y - 8);
        text.setAttribute('font-size', '10');
        text.setAttribute('fill', '#2c3e50');
        text.setAttribute('font-family', 'Arial, sans-serif');
        text.setAttribute('font-weight', 'bold');
        text.textContent = label;
        svg.appendChild(text);
    }

    // Draw grain line
    drawGrainLine(start, end, svg) {
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
    }

    // Set scale
    setScale(newScale) {
        this.scale = newScale;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = SVGRenderer;
}
