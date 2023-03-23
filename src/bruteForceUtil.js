// Converts boolean list of all vertices to a list of the vertex coves's indices
exports.coverToList = (cover) => cover.map((x,index) => x == true ? index : false).filter(x => x !== false)

// Get all adjes from an adjacency matrix
const getEdges = (matrix) => {
    let edges = [];
    for (let i = 0; i < matrix.length; i++) {
        for (let j = i + 1; j < matrix.length; j++) {
            if (matrix[i][j] === 1)
                edges.push([i, j])
        }
      }
    return edges
}

// Checks if the proposed cover is a vertex cover and has enough vertices
exports.checkIfVC = (graph, cover, k) => {
    let edges = getEdges(graph);
    let vertexCount = 0;
    for (let i = 0; i < cover.length; i++) {
        if (cover[i]) {
            vertexCount++;
            edges = edges.filter(currentEdge => !currentEdge.includes(i))
        }
    }
    if (edges.length > 0 || vertexCount != k) 
        return false;
    else {
        
        return cover
        
    }
}
// Used to make sure we don't evaluate options where we can't reach K
exports.isKReachable = (cover, matrixLength, k, i) => {
    let onesUntilI = 0;
    for (let coverI = 0; coverI <= i; coverI++) {
        if (cover[coverI])
            onesUntilI++;
    }
    let restOfCover = (matrixLength - 1) - i;

    return onesUntilI + restOfCover >= k;
}

// Checks if the proposed cover is a vertex cover and has enough vertices
exports.checkIfVCEnhanced = (graph, cover, k) => {
    let edges = getEdges(graph);
    let vertexCount = 0;
    for (let i = 0; i < cover.length; i++) {
        if (cover[i] > 0) {
            vertexCount++;
            edges = edges.filter(currentEdge => !currentEdge.includes(i))
        }
    }
    if (edges.length > 0 || vertexCount != k) 
        return false;
    else {
        
        return cover
        
    }
}
// Used to make sure we don't evaluate options where we can't reach K
exports.isKReachableEnhanced = (cover, matrixLength, k, i) => {
    let onesUntilI = 0;
    for (let coverI = 0; coverI <= i; coverI++) {
        if (cover[coverI] > 0)
            onesUntilI++;
    }
    let restOfCover = (matrixLength - 1) - i;

    return onesUntilI + restOfCover >= k;
}
// Converts boolean list of all vertices to a list of the vertex coves's indices
exports.coverToListEnhanced = (cover) => cover.map((x,index) => x > 0 ? index : false).filter(x => x !== false)
