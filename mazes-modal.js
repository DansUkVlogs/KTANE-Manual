

if (typeof window.MazesSolver === 'undefined') {
class MazesSolver {
    constructor() {
        console.log('MazesSolver constructor called');
        this.selectedCircles = [];
        this.identifiedMaze = null;
        this.startPos = null;
        this.endPos = null;
        this.solution = null;
        
        // Add a small delay to ensure DOM is fully ready
        setTimeout(() => {
            this.initializeGrid();
            this.bindEvents();
        }, 100);
    }

    initializeGrid() {
        console.log('Initializing grid...');
        const circleGrid = document.getElementById('circleGrid');
        
        if (!circleGrid) {
            console.error('Could not find circleGrid element');
            return;
        }
        
        // Clear existing grid if any (prevent duplicates)
        circleGrid.innerHTML = '';
        
        // Create 6x6 grid (y from 5 to 0, x from 0 to 5)
        for (let y = 5; y >= 0; y--) {
            for (let x = 0; x <= 5; x++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.dataset.x = x;
                cell.dataset.y = y;
                
                // Add coordinate label for debugging
                const coordLabel = document.createElement('span');
                coordLabel.className = 'grid-coords';
                coordLabel.textContent = `${x},${y}`;
                cell.appendChild(coordLabel);
                
                cell.addEventListener('click', () => this.toggleCircle(x, y, cell));
                circleGrid.appendChild(cell);
            }
        }
        console.log('Grid initialized with', circleGrid.children.length, 'cells');
    }

    bindEvents() {
        document.getElementById('identifyMaze').addEventListener('click', () => this.identifyMaze());
        document.getElementById('resetAll').addEventListener('click', () => this.resetAll());
    }

    toggleCircle(x, y, cell) {
        const pos = [x, y];
        const existingIndex = this.selectedCircles.findIndex(circle => 
            circle[0] === x && circle[1] === y
        );
        
        if (existingIndex >= 0) {
            // Remove circle
            this.selectedCircles.splice(existingIndex, 1);
            cell.classList.remove('circle');
        } else {
            // Add circle
            this.selectedCircles.push(pos);
            cell.classList.add('circle');
        }
        
        // Clear maze identification when circles change
        this.clearMazeIdentification();
    }

    identifyMaze() {
        if (this.selectedCircles.length !== 2) {
            const mazeInfo = document.getElementById('mazeInfo');
            if (mazeInfo) {
                mazeInfo.innerHTML = '<span style="color:#ff6b35;font-weight:bold;">Please select exactly 2 circles</span>';
                mazeInfo.classList.remove('identified');
            }
            return;
        }

        // Use the maze identification function from mazes-data.js
        this.identifiedMaze = findMazeByCircles(this.selectedCircles);
        
        const mazeInfo = document.getElementById('mazeInfo');
        const navigationInstructions = document.getElementById('navigationInstructions');
        
        if (this.identifiedMaze) {
            // Set the circles as start and end points
            this.startPos = this.selectedCircles[0];
            this.endPos = this.selectedCircles[1];
            
            mazeInfo.innerHTML = `
                <strong>Maze ${this.identifiedMaze.id} Identified!</strong><br>
                Start: (${this.startPos[0]},${this.startPos[1]}) → End: (${this.endPos[0]},${this.endPos[1]})
            `;
            mazeInfo.classList.add('identified');
            
            // Hide navigation instructions since we auto-set start/end
            navigationInstructions.style.display = 'none';
            
            // Create grid and immediately show path
            this.createInteractiveGrid();
            this.calculateAndShowPath();
            
        } else {
            mazeInfo.innerHTML = `
                <strong>No maze found</strong><br>
                Please check your circle positions. Circles at: ${this.selectedCircles.map(c => `(${c[0]},${c[1]})`).join(' and ')}
            `;
            mazeInfo.classList.remove('identified');
            navigationInstructions.style.display = 'none';
        }
    }

    createInteractiveGrid() {
        const solutionGrid = document.getElementById('solutionGrid');
        const pathInstructions = document.getElementById('pathInstructions');
        
        // Show the grid
        solutionGrid.style.display = 'grid';
        solutionGrid.innerHTML = '';
        
        // Create cells (y from 5 to 0, x from 0 to 5)
        for (let y = 5; y >= 0; y--) {
            for (let x = 0; x <= 5; x++) {
                const cell = document.createElement('div');
                cell.className = 'solution-cell';
                cell.dataset.x = x;
                cell.dataset.y = y;
                
                // Mark circles
                if (this.identifiedMaze.circles.some(circle => circle[0] === x && circle[1] === y)) {
                    cell.classList.add('circle');
                }
                
                // Add walls
                for (const wall of this.identifiedMaze.walls) {
                    if (wall.x === x && wall.y === y) {
                        cell.classList.add(`wall-${wall.direction}`);
                    }
                }
                
                // No click handler needed - circles are auto start/end
                
                solutionGrid.appendChild(cell);
            }
        }
        
        pathInstructions.innerHTML = '<p>Click on a cell to set your start position</p>';
    }

    handleCellClick(x, y) {
        if (!this.startPos) {
            // Set start position
            this.startPos = [x, y];
            this.updateGridDisplay();
            document.getElementById('pathInstructions').innerHTML = '<p>Now click on another cell to set your end position</p>';
        } else if (!this.endPos) {
            // Set end position
            this.endPos = [x, y];
            this.updateGridDisplay();
            this.calculateAndShowPath();
        } else {
            // Reset and set new start
            this.startPos = [x, y];
            this.endPos = null;
            this.solution = null;
            this.updateGridDisplay();
            document.getElementById('pathInstructions').innerHTML = '<p>Now click on another cell to set your end position</p>';
        }
    }

    calculateAndShowPath() {
        if (!this.startPos || !this.endPos || !this.identifiedMaze) return;
        
        // Calculate path using BFS
        this.solution = this.calculatePath(this.startPos, this.endPos, this.identifiedMaze);
        this.updateGridDisplay();
        
        if (this.solution) {
            const pathInstructions = document.getElementById('pathInstructions');
            const instructions = this.generateInstructions(this.solution);
            pathInstructions.innerHTML = `
                <h4>Path Found! (${this.solution.length} steps)</h4>
                ${instructions}
                <p><em>Click any cell to set a new start position</em></p>
            `;
            pathInstructions.classList.add('has-path');
        } else {
            document.getElementById('pathInstructions').innerHTML = '<p style="color: #f44336;">No path found! Try different positions.</p>';
        }
    }

    calculatePath(start, end, maze) {
        // BFS pathfinding considering walls
        const queue = [[start, [start]]];
        const visited = new Set();
        visited.add(`${start[0]},${start[1]}`);
        
        while (queue.length > 0) {
            const [[x, y], path] = queue.shift();
            
            // Check if we reached the end
            if (x === end[0] && y === end[1]) {
                return path;
            }
            
            // Check all 4 directions
            const directions = [
                [0, 1],  // up
                [1, 0],  // right
                [0, -1], // down
                [-1, 0]  // left
            ];
            
            for (const [dx, dy] of directions) {
                const nx = x + dx;
                const ny = y + dy;
                
                // Check bounds
                if (nx < 0 || nx > 5 || ny < 0 || ny > 5) continue;
                
                const nextPosKey = `${nx},${ny}`;
                if (visited.has(nextPosKey)) continue;
                
                // Check for walls blocking this move
                if (this.hasWallBetween([x, y], [nx, ny], maze)) continue;
                
                visited.add(nextPosKey);
                queue.push([[nx, ny], [...path, [nx, ny]]]);
            }
        }
        
        return null; // No path found
    }

    hasWallBetween(from, to, maze) {
        const [fx, fy] = from;
        const [tx, ty] = to;
        const dx = tx - fx;
        const dy = ty - fy;
        
        // Check walls in maze data
        for (const wall of maze.walls) {
            const [wx, wy] = [wall.x, wall.y];
            
            if (wall.direction === 'bottom') {
                // Wall below cell (wx, wy), blocks movement from (wx, wy) to (wx, wy-1)
                if ((fx === wx && fy === wy && tx === wx && ty === wy - 1) ||
                    (fx === wx && fy === wy - 1 && tx === wx && ty === wy)) {
                    return true;
                }
            } else if (wall.direction === 'left') {
                // Wall left of cell (wx, wy), blocks movement from (wx, wy) to (wx-1, wy)
                if ((fx === wx && fy === wy && tx === wx - 1 && ty === wy) ||
                    (fx === wx - 1 && fy === wy && tx === wx && ty === wy)) {
                    return true;
                }
            }
        }
        
        return false;
    }

    updateGridDisplay() {
        const cells = document.querySelectorAll('.solution-cell');
        
        cells.forEach(cell => {
            const x = parseInt(cell.dataset.x);
            const y = parseInt(cell.dataset.y);
            
            // Remove existing state classes
            cell.classList.remove('start', 'end', 'path');
            
            // Check if this cell is in the path
            const inPath = this.solution && this.solution.some(pos => pos[0] === x && pos[1] === y);
            
            // Mark start position
            if (this.startPos && x === this.startPos[0] && y === this.startPos[1]) {
                cell.classList.add('start');
                console.log('Added start class to cell', x, y);
            }
            // Mark end position  
            else if (this.endPos && x === this.endPos[0] && y === this.endPos[1]) {
                cell.classList.add('end');
                console.log('Added end class to cell', x, y);
            }
            // Mark path (excluding start and end)
            else if (inPath) {
                cell.classList.add('path');
            }
        });
    }

    generateInstructions(path) {
        if (path.length < 2) return '<p>Already at destination!</p>';
        
        const directions = {
            '0,1': 'UP',
            '1,0': 'RIGHT', 
            '0,-1': 'DOWN',
            '-1,0': 'LEFT'
        };
        
        let instructions = '<div>';
        for (let i = 0; i < path.length - 1; i++) {
            const current = path[i];
            const next = path[i + 1];
            const dx = next[0] - current[0];
            const dy = next[1] - current[1];
            const direction = directions[`${dx},${dy}`] || 'UNKNOWN';
            
            instructions += `
                <div class="path-step">
                    ${i + 1}. From (${current[0]},${current[1]}) go ${direction} to (${next[0]},${next[1]})
                </div>
            `;
        }
        instructions += '</div>';
        
        return instructions;
    }

    clearMazeIdentification() {
        this.identifiedMaze = null;
        const mazeInfo = document.getElementById('mazeInfo');
        const navigationInstructions = document.getElementById('navigationInstructions');
        const solutionGrid = document.getElementById('solutionGrid');
        const pathInstructions = document.getElementById('pathInstructions');
        
        mazeInfo.innerHTML = '<p>Click "Identify Maze" after selecting circles</p>';
        mazeInfo.classList.remove('identified');
        navigationInstructions.style.display = 'none';
        solutionGrid.style.display = 'none';
        pathInstructions.innerHTML = '<p>Identify the maze above to see the interactive grid</p>';
        pathInstructions.classList.remove('has-path');
        
        this.startPos = null;
        this.endPos = null;
        this.solution = null;
    }

    resetAll() {
        // Clear selected circles
        this.selectedCircles = [];
        const circleCells = document.querySelectorAll('.grid-cell.circle');
        circleCells.forEach(cell => cell.classList.remove('circle'));
        
        // Clear maze identification
        this.clearMazeIdentification();
    }
}
window.MazesSolver = MazesSolver;
}

function initializeMazes() {
    console.log('Initializing MazesSolver...');
    try {
        if (typeof MazesSolver !== 'undefined') {
            new MazesSolver();
            console.log('MazesSolver initialized successfully');
        } else {
            console.error('MazesSolver class not found');
        }
    } catch (error) {
        console.error('Error initializing MazesSolver:', error);
    }
}

// Mazes Modal JS - always initialize on load
(function() {
    setTimeout(initializeMazes, 100);
})();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMazes);
} else {
    // DOM is already ready
    initializeMazes();
}

