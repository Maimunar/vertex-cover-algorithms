const getDegrees = (matrix, vertex) => matrix[vertex].reduce((sum, currentValue) => sum + currentValue, 0)
    
// If a vertex's degrees is 0, add to isolatedVertices
exports.getIsolatedVertices = (matrix) => {
    let isolatedVertices = [];
    for (let i = 0; i < matrix.length; i++) {
        if (getDegrees(matrix, i) == 0)
            isolatedVertices.push(i)
    }
    return isolatedVertices
}

// If a vertex's degrees is >k, add to topsVertices
exports.getTopsVertices = (matrix, k) => {
    let topsVertices = [];
    for (let i = 0; i < matrix.length; i++) {
        if (getDegrees(matrix, i) > k)
            topsVertices.push(i)
    }
    return topsVertices
}

exports.getEdges = (matrix) => {
    let edges = [];
    for (let i = 0; i < matrix.length; i++) {
        for (let j = i + 1; j < matrix.length; j++) {
            if (matrix[i][j] === 1)
                edges.push([i, j])
        }
      }
    return edges
}
// If a vertex's degrees is 1, add to pendantVertices
exports.getPendantVertices = (matrix) => {
    let pendantVertices = [];
    for (let i = 0; i < matrix.length; i++) {
        if (getDegrees(matrix, i) == 1)
            pendantVertices.push(i)
    }
    return pendantVertices
}