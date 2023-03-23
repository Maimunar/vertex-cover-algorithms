// This function takes an adjacency matrix and returns a list of all edges in the graph
// Used for easier data representation
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

// This function returns the ammount of edges a vertex has incidental to him
// Used to make sure we don't add any branch nodes when it's not necessary
const getVertexConnections = (allEdges, targetVertex) => allEdges.reduce((sum, currentEdge) => {
    if (currentEdge.includes(targetVertex))
        sum += 1;
    return sum
}, 0)

// Takes an input of edges and returns all unique vertices in it
// Used to break earlier in the for loop when there are not enough vertices to reach k
const getUniqueVertices = edges => [].concat(...edges).filter((item, i, ar) => ar.indexOf(item) === i)

// Main method for vertex cover
exports.getVertexCover = (edges, k) => {
    // First copies all edges to a read-only variable
    const allEdges = [...edges]
    let visited = []

    // While edge is not empty
    while (edges.length > 0) {
        // Break if we have more vertices than k or there aren't enough vertices to reach k
        if (visited.length > k || getUniqueVertices(edges).length < (k - visited.length))
            return "Could not find an answer"
        // Get the appropriate edge
        let edge = null;
        edge = edges.shift()

        // Connections Trigger is to make sure we add atleast one of the vertices
        let connectionsTrigger = false
        for (let i = 0; i < edge.length; i++) {
            // Only add to visited if the vertex isn't a leaf or we haven't added the first one
            if (getVertexConnections(allEdges, edge[i]) > 1 || connectionsTrigger)
                visited.push(edge[i]);
            else
                connectionsTrigger = true;
        }
        // Filter edges that include one of the vertices
        edges = edges.filter(currentEdge => !currentEdge.includes(edge[0]) && !currentEdge.includes(edge[1]))
    }
    return visited
}

const preprocessVisited = (edges, k) => {
    // Tops
    let vertices = getUniqueVertices(edges)
    let tops = vertices.filter(vertex => getVertexConnections(edges, vertex) > k)
    let newEdges = [...edges]
    tops.forEach(top => {
        newEdges.filter(edge => !edge.includes(top))
    })
    return {
        tops,
        edges: newEdges
    }
}

const getDegrees = (matrix, vertex) => matrix[vertex].reduce((sum, currentValue) => sum + currentValue, 0)

exports.disableVertex = (graph, vertex) => {
    for (let i = 0; i < graph.length; i++) {
        graph[i][vertex] = null
        graph[vertex][i] = null
    }
    return graph
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
// If a vertex's degrees is 1, add to pendantVertices
exports.getPendantVertices = (matrix) => {
    let pendantVertices = [];
    for (let i = 0; i < matrix.length; i++) {
        if (getDegrees(matrix, i) == 1)
            pendantVertices.push(i)
    }
    return pendantVertices
}

// If a vertex's degrees is 0, add to isolatedVertices
exports.getIsolatedVertices = (matrix) => {
    let isolatedVertices = [];
    for (let i = 0; i < matrix.length; i++) {
        if (getDegrees(matrix, i) == 0)
            isolatedVertices.push(i)
    }
    return isolatedVertices
}

// If a vertex's degrees is >k, return it (only one)
exports.getTopVertex = (matrix, k) => {
    for (let i = 0; i < matrix.length; i++) {
        if (getDegrees(matrix, i) > k)
            return i
    }
    return null
}

// If a vertex's degree is 1, return it (only one)
exports.getPendantVertex = (matrix) => {
    for (let i = 0; i < matrix.length; i++) {
        if (getDegrees(matrix, i) == 1)
            return i
    }
    return null
}

// Get a pendant's adjacent vertex
// 1. Get all edges
// 2. Filter all that don't include the edge (you will have only 1 edge at that point as it is a pendant)
// Ex. [[0,1]]
// 3. Take the item at index 0 - [0,1]
// 4. Filter all that are == the pendant - Ex. [1]
// 5. Return item at index 0
exports.getPendantAdjacent = (matrix, pendantVertex) => getEdges(matrix).filter(edge => edge.includes(pendantVertex))[0]
    .filter(x => x != pendantVertex)[0]