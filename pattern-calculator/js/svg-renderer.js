// js/svg-renderer.js
class SVGRenderer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.namespace = 'http://www.w3.org/2000/svg';
        this.scale = 2; // Scale factor for better visibility
    }

    // Clear existing SVG
    clear() {
        if (this.container) {
            this.container.innerHTML = '';
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
        background.setAttribute('fill', '#f8f9fa');
        background.setAttribute('stroke', '#dee2e6');
        background.setAttribute('stroke-width', '1');
        svg.appendChild(background);
        
        this.container.appendChild(svg);
        return svg;
    }

    // Render bodice pattern
    renderBodice(patternData, svg) {
        const { points, darts, seams } = patternData;
        
        // Draw seams
        Object.values(seams).forEach(seam => {
            this.drawSeam(seam, svg);
        });

        // Draw darts
        Object.values(darts).forEach(dart => {
            this.drawDart(dart, svg);
        });

        // Draw points and labels
        Object.entries(points).forEach(([name, point]) => {
            this.drawPoint(point, name, svg);
        });

        // Add grain line
        this.drawGrainLine(points.waistCenter, points.neckCenter, svg);
    }

    // Render sleeve pattern
    renderSleeve(patternData, svg) {
        const { points, seams } = patternData;
        
        // Draw seams
        Object.values(seams).forEach(seam => {
            this.drawSeam(seam, svg);
        });

        // Draw points
        Object.entries(points).forEach(([name, point]) => {
            this.drawPoint(point, name, svg);
        });

        // Add grain line
        this.drawGrainLine(points.capCenter, points.wristFront, svg);
    }

    // Draw a seam line
    drawSeam(points, svg, isCuttingLine = true) {
        if (points.length < 2) return;

        const path = document.createElementNS(this.namespace, 'path');
        let pathData = `M ${points[0].x * this.scale} ${points[0].y * this.scale}`;
        
        for (let i = 1; i < points.length; i++) {
            pathData += ` L ${points[i].x * this.scale} ${points[i].y * this.scale}`;
        }

        path.setAttribute('d', pathData);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', isCuttingLine ? '#2c3e50' : '#6c757d');
        path.setAttribute('stroke-width', isCuttingLine ? '2' : '1');
        path.setAttribute('stroke-dasharray', isCuttingLine ? 'none' : '5,5');
        
        svg.appendChild(path);
    }

    // Draw a dart
    drawDart(dart, svg) {
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
            'dart-point', 
            svg, 
            '#e74c3c'
        );
    }

    // Draw a point with label
    drawPoint(point, label, svg, color = '#3498db') {
        const circle = document.createElementNS(this.namespace, 'circle');
        circle.setAttribute('cx', point.x * this.scale);
        circle.setAttribute('cy', point.y * this.scale);
        circle.setAttribute('r', '3');
        circle.setAttribute('fill', color);
        circle.setAttribute('stroke', '#2c3e50');
        circle.setAttribute('stroke-width', '1');
        svg.appendChild(circle);

        // Add label
        const text = document.createElementNS(this.namespace, 'text');
        text.setAttribute('x', point.x * this.scale + 8);
        text.setAttribute('y', point.y * this.scale - 8);
        text.setAttribute('font-size', '10');
        text.setAttribute('fill', '#2c3e50');
        text.setAttribute('font-family', 'Arial, sans-serif');
        text.textContent = label;
        svg.appendChild(text);
    }

    // Draw grain line
    drawGrainLine(start, end, svg) {
        const line = document.createElementNS(this.namespace, 'line');
        line.setAttribute('x1', start.x * this.scale);
        line.setAttribute('y1', start.y * this.scale);
        line.setAttribute('x2', end.x * this.scale);
        line.setAttribute('y2', end.y * this.scale);
        line.setAttribute('stroke', '#27ae60');
        line.setAttribute('stroke-width', '1');
        line.setAttribute('stroke-dasharray', '3,3');
        svg.appendChild(line);

        // Add arrowheads
        this.drawArrowhead(end, Math.atan2(end.y - start.y, end.x - start.x), svg);
    }

    // Draw arrowhead for grain line
    drawArrowhead(point, angle, svg) {
        const size = 8;
        const arrow = document.createElementNS(this.namespace, 'path');
        
        const x = point.x * this.scale;
        const y = point.y * this.scale;
        
        const pathData = `M ${x} ${y} 
                         L ${x - size * Math.cos(angle - Math.PI/6)} ${y - size * Math.sin(angle - Math.PI/6)}
                         L ${x - size * Math.cos(angle + Math.PI/6)} ${y - size * Math.sin(angle + Math.PI/6)} 
                         Z`;
        
        arrow.setAttribute('d', pathData);
        arrow.setAttribute('fill', '#27ae60');
        svg.appendChild(arrow);
    }

    // Set scale
    setScale(newScale) {
        this.scale = newScale;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = SVGRenderer;
}