// js/svg-renderer.js - COMPLETELY CLEAN VERSION
class SVGRenderer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.namespace = 'http://www.w3.org/2000/svg';
        this.scale = 1.5; // Good visibility scale
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

    // Render bodice pattern
    renderBodice(patternData, svg) {
        console.log('🎨 Rendering bodice pattern:', patternData);
        
        const { points, darts, seams } = patternData;
        
        if (!points) {
            console.error('No points data for bodice');
            return;
        }

        // Draw seams
        if (seams) {
            Object.entries(seams).forEach(([name, seamPoints]) => {
                console.log(`Drawing seam: ${name}`, seamPoints);
                this.drawSeam(seamPoints, svg, true, name);
            });
        }

        // Draw darts
        if (darts) {
            Object.entries(darts).forEach(([name, dart]) => {
                console.log(`Drawing dart: ${name}`, dart);
                this.drawDart(dart, svg, name);
            });
        }

        // Draw points and labels
        Object.entries(points).forEach(([name, point]) => {
            this.drawPoint(point, name, svg);
        });

        // Add grain line from center front
        if (points.waistCenter && points.neckCenter) {
            this.drawGrainLine(points.waistCenter, points.neckCenter, svg, 'Grain Line');
        }
    }

    // Render sleeve pattern
    renderSleeve(patternData, svg) {
        console.log('🎨 Rendering sleeve pattern:', patternData);
        
        const { points, seams } = patternData;
        
        if (!points) {
            console.error('No points data for sleeve');
            return;
        }

        // Draw seams
        if (seams) {
            Object.entries(seams).forEach(([name, seamPoints]) => {
                console.log(`Drawing sleeve seam: ${name}`, seamPoints);
                this.drawSeam(seamPoints, svg, true, name);
            });
        }

        // Draw points and labels
        Object.entries(points).forEach(([name, point]) => {
            this.drawPoint(point, name, svg);
        });

        // Add grain line from cap to wrist
        if (points.capCenter && points.wristFront) {
            this.drawGrainLine(points.capCenter, points.wristFront, svg, 'Sleeve Grain');
        }
    }

    // Draw a seam line
    drawSeam(points, svg, isCuttingLine = true, seamName = '') {
        if (!points || points.length < 2) {
            console.warn(`Invalid seam points for ${seamName}:`, points);
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
        path.setAttribute('stroke', isCuttingLine ? '#2c3e50' : '#6c757d');
        path.setAttribute('stroke-width', isCuttingLine ? '3' : '2');
        path.setAttribute('stroke-dasharray', isCuttingLine ? 'none' : '5,5');
        path.setAttribute('data-name', seamName);
        
        svg.appendChild(path);
        console.log(`✅ Seam drawn: ${seamName}`);
    }

    // Draw a dart
    drawDart(dart, svg, dartName = '') {
        if (!dart || !dart.position) {
            console.warn(`Invalid dart: ${dartName}`, dart);
            return;
        }
        
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

        this.drawSeam(leftLeg, svg, false, `${dartName}-left`);
        this.drawSeam(rightLeg, svg, false, `${dartName}-right`);

        // Dart point
        this.drawPoint(
            { x: position.x, y: position.y - length }, 
            `${dartName}-point`, 
            svg, 
            '#e74c3c'
        );
        
        console.log(`✅ Dart drawn: ${dartName}`);
    }

    // Draw a point with label
    drawPoint(point, label, svg, color = '#3498db') {
        const svgPoint = this.toSVGCoords(point);
        
        // Draw point circle
        const circle = document.createElementNS(this.namespace, 'circle');
        circle.setAttribute('cx', svgPoint.x);
        circle.setAttribute('cy', svgPoint.y);
        circle.setAttribute('r', '6');
        circle.setAttribute('fill', color);
        circle.setAttribute('stroke', '#2c3e50');
        circle.setAttribute('stroke-width', '2');
        circle.setAttribute('data-name', label);
        svg.appendChild(circle);

        // Add label
        const text = document.createElementNS(this.namespace, 'text');
        text.setAttribute('x', svgPoint.x + 10);
        text.setAttribute('y', svgPoint.y - 10);
        text.setAttribute('font-size', '11');
        text.setAttribute('fill', '#2c3e50');
        text.setAttribute('font-family', 'Arial, sans-serif');
        text.setAttribute('font-weight', 'bold');
        text.textContent = label;
        svg.appendChild(text);
        
        console.log(`✅ Point drawn: ${label} at (${point.x}, ${point.y})`);
    }

    // Draw grain line
    drawGrainLine(start, end, svg, label = 'Grain') {
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
        line.setAttribute('data-name', label);
        svg.appendChild(line);

        // Add arrowhead
        this.drawArrowhead(endPoint, Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x), svg);
        
        console.log(`✅ Grain line drawn: ${label}`);
    }

    // Draw arrowhead for grain line
    drawArrowhead(point, angle, svg) {
        const size = 10;
        const arrow = document.createElementNS(this.namespace, 'path');
        
        const pathData = `M ${point.x} ${point.y} 
                         L ${point.x - size * Math.cos(angle - Math.PI/6)} ${point.y - size * Math.sin(angle - Math.PI/6)}
                         L ${point.x - size * Math.cos(angle + Math.PI/6)} ${point.y - size * Math.sin(angle + Math.PI/6)} 
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
