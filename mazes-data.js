// Mazes Module - All KTANE Maze Definitions
if (typeof window.MAZES === 'undefined') {
    window.MAZES = {
        // Maze 1: Circles at [0,4] and [5,3] 
        MAZE_1: {
            id: 1,
            circles: [[0, 4], [5, 3]],
            walls: [
                // Maze 1 walls - you can verify and edit these
                {x: 2, y: 0, direction: 'left'},  
                {x: 4, y: 0, direction: 'left'},
                {x: 1, y: 1, direction: 'bottom'},
                {x: 3, y: 1, direction: 'left'},
                {x: 5, y: 1, direction: 'left'},
                {x: 1, y: 2, direction: 'left'},
                {x: 1, y: 2, direction: 'bottom'},
                {x: 2, y: 2, direction: 'bottom'},
                {x: 3, y: 2, direction: 'bottom'},
                {x: 4, y: 2, direction: 'bottom'},
                {x: 4, y: 2, direction: 'left'},
                {x: 1, y: 3, direction: 'left'},
                {x: 1, y: 3, direction: 'bottom'},
                {x: 3, y: 3, direction: 'left'},
                {x: 4, y: 3, direction: 'bottom'},
                {x: 1, y: 4, direction: 'left'},
                {x: 2, y: 4, direction: 'bottom'},
                {x: 3, y: 4, direction: 'left'},
                {x: 3, y: 4, direction: 'bottom'},
                {x: 4, y: 4, direction: 'bottom'},
                {x: 1, y: 5, direction: 'bottom'},
                {x: 3, y: 5, direction: 'left'},
                {x: 4, y: 5, direction: 'bottom'},
                {x: 5, y: 5, direction: 'bottom'}
            ]
        },

        // Maze 2: Circles at [1, 3] and [4, 4]  
        MAZE_2: {
            id: 2,
            circles: [[1, 2], [4, 4]],
            walls: [
                {x: 0, y: 5, direction: 'bottom'},
                {x: 1, y: 4, direction: 'bottom'},
                {x: 1, y: 3, direction: 'left'},
                {x: 1, y: 2, direction: 'bottom'},
                {x: 1, y: 1, direction: 'left'},
                {x: 1, y: 0, direction: 'left'},
                {x: 2, y: 1, direction: 'left'},
                {x: 2, y: 2, direction: 'left'},
                {x: 2, y: 3, direction: 'bottom'},
                {x: 2, y: 4, direction: 'left'},
                {x: 2, y: 5, direction: 'bottom'},
                {x: 3, y: 0, direction: 'left'},
                {x: 3, y: 1, direction: 'left'},
                {x: 3, y: 2, direction: 'bottom'},
                {x: 3, y: 3, direction: 'left'},
                {x: 3, y: 4, direction: 'bottom'},
                {x: 3, y: 5, direction: 'left'},
                {x: 4, y: 1, direction: 'bottom'},
                {x: 4, y: 2, direction: 'left'},
                {x: 4, y: 3, direction: 'bottom'},
                {x: 4, y: 4, direction: 'left'},
                {x: 4, y: 4, direction: 'bottom'},
                {x: 5, y: 1, direction: 'left'},
                {x: 5, y: 2, direction: 'left'},
                {x: 5, y: 5, direction: 'bottom'}
            ]
        },

        // Maze 3: Circles at [2, 2] and [5, 2]
        MAZE_3: {
            id: 3,
            circles: [[3, 2], [5, 2]],
            walls: [
                {x: 4, y: 0, direction: 'left'},
                {x: 1, y: 1, direction: 'left'},
                {x: 1, y: 1, direction: 'bottom'},
                {x: 2, y: 1, direction: 'bottom'},
                {x: 3, y: 1, direction: 'left'},
                {x: 4, y: 1, direction: 'left'},
                {x: 5, y: 1, direction: 'left'},
                {x: 1, y: 2, direction: 'left'},
                {x: 2, y: 2, direction: 'left'},
                {x: 3, y: 2, direction: 'left'},
                {x: 4, y: 2, direction: 'left'},
                {x: 5, y: 2, direction: 'left'},
                {x: 2, y: 3, direction: 'left'},
                {x: 3, y: 3, direction: 'left'},
                {x: 5, y: 3, direction: 'left'},
                {x: 0, y: 4, direction: 'bottom'},
                {x: 1, y: 4, direction: 'left'},
                {x: 2, y: 4, direction: 'left'},
                {x: 3, y: 4, direction: 'left'},
                {x: 3, y: 4, direction: 'bottom'},
                {x: 4, y: 4, direction: 'bottom'},
                {x: 5, y: 4, direction: 'left'},
                {x: 1, y: 5, direction: 'bottom'},
                {x: 3, y: 5, direction: 'left'},
                {x: 4, y: 5, direction: 'left'}
            ]
        },

        // Maze 4: Circles at [0, 5] and [0, 2]
        MAZE_4: {
            id: 4,
            circles: [[0, 5], [0, 2]],
            walls: [
                {x: 3, y: 0, direction: 'left'},
                {x: 5, y: 0, direction: 'left'},
                {x: 1, y: 1, direction: 'bottom'},
                {x: 2, y: 1, direction: 'bottom'},
                {x: 3, y: 1, direction: 'bottom'},
                {x: 5, y: 1, direction: 'left'},
                {x: 1, y: 2, direction: 'left'},
                {x: 1, y: 2, direction: 'bottom'},
                {x: 2, y: 2, direction: 'bottom'},
                {x: 3, y: 2, direction: 'bottom'},
                {x: 4, y: 2, direction: 'bottom'},
                {x: 1, y: 3, direction: 'left'},
                {x: 1, y: 3, direction: 'bottom'},
                {x: 2, y: 3, direction: 'bottom'},
                {x: 3, y: 3, direction: 'left'},
                {x: 4, y: 3, direction: 'bottom'},
                {x: 5, y: 3, direction: 'left'},
                {x: 1, y: 4, direction: 'left'},
                {x: 2, y: 4, direction: 'left'},
                {x: 3, y: 4, direction: 'bottom'},
                {x: 4, y: 4, direction: 'bottom'},
                {x: 2, y: 5, direction: 'left'},
                {x: 2, y: 5, direction: 'bottom'},
                {x: 3, y: 5, direction: 'bottom'},
                {x: 4, y: 5, direction: 'bottom'}
            ]
        },

        // Maze 5: Circles at [4, 3] and [2, 0]
        MAZE_5: {
            id: 5,
            circles: [[4, 3], [3, 0]],
            walls: [
                {x: 1, y: 0, direction: 'left'},
                {x: 1, y: 1, direction: 'left'},
                {x: 2, y: 1, direction: 'bottom'},
                {x: 3, y: 1, direction: 'bottom'},
                {x: 4, y: 1, direction: 'bottom'},
                {x: 5, y: 1, direction: 'left'},
                {x: 1, y: 2, direction: 'left'},
                {x: 1, y: 2, direction: 'bottom'},
                {x: 2, y: 2, direction: 'bottom'},
                {x: 4, y: 2, direction: 'bottom'},
                {x: 4, y: 2, direction: 'left'},
                {x: 5, y: 2, direction: 'left'},
                {x: 2, y: 3, direction: 'left'},
                {x: 2, y: 3, direction: 'bottom'},
                {x: 3, y: 3, direction: 'bottom'},
                {x: 4, y: 3, direction: 'left'},
                {x: 1, y: 4, direction: 'bottom'},
                {x: 2, y: 4, direction: 'bottom'},
                {x: 4, y: 4, direction: 'bottom'},
                {x: 5, y: 4, direction: 'bottom'},
                {x: 5, y: 4, direction: 'left'},
                {x: 0, y: 5, direction: 'bottom'},
                {x: 1, y: 5, direction: 'bottom'},
                {x: 2, y: 5, direction: 'bottom'},
                {x: 3, y: 5, direction: 'bottom'}
            ]
        },

        // Maze 6: Circles at [3, 5] and [2, 1]
        MAZE_6: {
            id: 6,
            circles: [[4, 5], [2, 1]],
            walls: [
                {x: 4, y: 0, direction: 'left'},
                {x: 1, y: 1, direction: 'bottom'},
                {x: 2, y: 1, direction: 'bottom'},
                {x: 2, y: 1, direction: 'left'},
                {x: 3, y: 1, direction: 'left'},
                {x: 4, y: 1, direction: 'left'},
                {x: 4, y: 1, direction: 'bottom'},
                {x: 0, y: 2, direction: 'bottom'},
                {x: 2, y: 2, direction: 'left'},
                {x: 4, y: 2, direction: 'left'},
                {x: 5, y: 2, direction: 'left'},
                {x: 1, y: 3, direction: 'bottom'},
                {x: 2, y: 3, direction: 'bottom'},
                {x: 2, y: 3, direction: 'left'},
                {x: 3, y: 3, direction: 'left'},
                {x: 4, y: 3, direction: 'left'},
                {x: 5, y: 3, direction: 'bottom'},
                {x: 1, y: 4, direction: 'left'},
                {x: 2, y: 4, direction: 'left'},
                {x: 3, y: 4, direction: 'left'},
                {x: 4, y: 4, direction: 'bottom'},
                {x: 5, y: 4, direction: 'left'},
                {x: 1, y: 5, direction: 'left'},
                {x: 3, y: 5, direction: 'left'},
                {x: 3, y: 5, direction: 'bottom'}
            ]
        },

        // Maze 7: Circles at [1, 5] and [1, 0]
        MAZE_7: {
            id: 7,
            circles: [[1, 5], [1, 0]],
            walls: [
                {x: 1, y: 1, direction: 'left'},
                {x: 1, y: 1, direction: 'bottom'},
                {x: 2, y: 1, direction: 'left'},
                {x: 2, y: 1, direction: 'bottom'},
                {x: 3, y: 1, direction: 'bottom'},
                {x: 5, y: 1, direction: 'left'},
                {x: 2, y: 2, direction: 'left'},
                {x: 3, y: 2, direction: 'bottom'},
                {x: 4, y: 2, direction: 'bottom'},
                {x: 5, y: 2, direction: 'left'},
                {x: 0, y: 3, direction: 'bottom'},
                {x: 1, y: 3, direction: 'bottom'},
                {x: 2, y: 3, direction: 'left'},
                {x: 3, y: 3, direction: 'bottom'},
                {x: 4, y: 3, direction: 'left'},
                {x: 1, y: 4, direction: 'left'},
                {x: 2, y: 4, direction: 'bottom'},
                {x: 3, y: 4, direction: 'bottom'},
                {x: 3, y: 4, direction: 'left'},
                {x: 4, y: 4, direction: 'bottom'},
                {x: 5, y: 4, direction: 'left'},
                {x: 1, y: 5, direction: 'bottom'},
                {x: 2, y: 5, direction: 'bottom'},
                {x: 4, y: 5, direction: 'left'}
            ]
        },

        // Maze 8: Circles at [2, 5] and [2, 2] 
        MAZE_8: {
            id: 8,
            circles: [[3, 5], [2, 2]],
            walls: [
                {x: 1, y: 1, direction: 'left'},
                {x: 2, y: 1, direction: 'bottom'},
                {x: 2, y: 1, direction: 'left'},
                {x: 3, y: 1, direction: 'bottom'},
                {x: 4, y: 1, direction: 'bottom'},
                {x: 5, y: 1, direction: 'bottom'},
                {x: 1, y: 2, direction: 'left'},
                {x: 1, y: 2, direction: 'bottom'},
                {x: 3, y: 2, direction: 'left'},
                {x: 3, y: 2, direction: 'bottom'},
                {x: 4, y: 2, direction: 'bottom'},
                {x: 5, y: 2, direction: 'bottom'},
                {x: 1, y: 3, direction: 'left'},
                {x: 2, y: 3, direction: 'bottom'},
                {x: 3, y: 3, direction: 'bottom'},
                {x: 5, y: 3, direction: 'left'},
                {x: 1, y: 4, direction: 'bottom'},
                {x: 2, y: 4, direction: 'bottom'},
                {x: 3, y: 4, direction: 'bottom'},
                {x: 3, y: 4, direction: 'left'},
                {x: 4, y: 4, direction: 'bottom'},
                {x: 5, y: 4, direction: 'left'},
                {x: 1, y: 5, direction: 'left'},
                {x: 2, y: 5, direction: 'bottom'},
                {x: 4, y: 5, direction: 'left'}
            ]
        },

        // Maze 9: Circles at [2, 4] and [0, 1]
        MAZE_9: {
            id: 9, 
            circles: [[2, 4], [0, 1]],
            walls: [
                {x: 2, y: 0, direction: 'left'},
                {x: 4, y: 0, direction: 'left'},
                {x: 1, y: 1, direction: 'left'},
                {x: 2, y: 1, direction: 'left'},
                {x: 3, y: 1, direction: 'left'},
                {x: 5, y: 1, direction: 'left'},
                {x: 5, y: 1, direction: 'bottom'},
                {x: 1, y: 2, direction: 'left'},
                {x: 2, y: 2, direction: 'left'},
                {x: 4, y: 2, direction: 'left'},
                {x: 3, y: 2, direction: 'bottom'},
                {x: 4, y: 2, direction: 'bottom'},
                {x: 1, y: 3, direction: 'bottom'},
                {x: 2, y: 3, direction: 'bottom'},
                {x: 3, y: 3, direction: 'left'},
                {x: 4, y: 3, direction: 'bottom'},
                {x: 5, y: 3, direction: 'left'},
                {x: 1, y: 4, direction: 'left'},
                {x: 2, y: 4, direction: 'left'},
                {x: 3, y: 4, direction: 'bottom'},
                {x: 4, y: 4, direction: 'left'},
                {x: 5, y: 4, direction: 'left'},
                {x: 1, y: 5, direction: 'left'},
                {x: 2, y: 5, direction: 'bottom'},
                {x: 3, y: 5, direction: 'bottom'}
            ]
        }
    };
}

// Helper function to find maze by circular markings
function findMazeByCircles(circlePositions) {
    for (const mazeKey in window.MAZES) {
        const maze = window.MAZES[mazeKey];
        if (arraysEqual(maze.circles.sort(), circlePositions.sort())) {
            return maze;
        }
    }
    return null;
}

// Helper function to compare arrays
function arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i][0] !== b[i][0] || a[i][1] !== b[i][1]) return false;
    }
    return true;
}