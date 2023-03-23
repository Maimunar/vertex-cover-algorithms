import React, { useEffect } from 'react'

export const KernelizationGraph = ({ matrix, id, isolatedVertices, pendantVertices, topsVertices}) => {
    useEffect(() => {
        // Clearing any previous graphs
        var paper = document.getElementById(id)
        paper.innerHTML = ''

        // Library specific code
        var Dracula = require('graphdracula')
        var Graph = Dracula.Graph
        var Renderer = Dracula.Renderer.Raphael
        var Layout = Dracula.Layout.Spring
        var graph = new Graph()
        
        //Add all nodes first
        for (let i = 0; i < matrix.length; i++) {
            // If isolated, add label accordingly
            if (isolatedVertices.includes(i)) {
                graph.addNode(i.toString(), {
                    label: `${i} - Isolated`,
                })
            // If tops, add label accordingly
            } else if (topsVertices.includes(i)) {
                graph.addNode(i.toString(), {
                    label: `${i} - Tops`,
                })
            // Add all other edges
            } else {
                graph.addNode(i.toString())
            }
        }
        for (let i = 0; i < matrix.length; i++) {
            // Iterates through rows
            // j starts at i, so we take a look at 1 half of the matrix to avoid overlapping edges
            // i+1 to avoid diagonals
            for (let j = i + 1; j < matrix.length; j++) {
                // Inverting probability, so 0 can be lowest probability and 1 - highest
                if (matrix[i][j] === 1) {
                    // If one of the edges is a pendant, add a specific style and lable to it
                    if (pendantVertices.includes(i) || pendantVertices.includes(j)){
                        graph.addEdge(i.toString(), j.toString(), {
                            style: {
                              stroke: '#bfa',
                              fill: '#56f',
                              label: 'Pendant'
                            }
                          })                        
                    }
                    else {
                        // If it isn't a pendant, add it normally
                        graph.addEdge(i.toString(), j.toString())
                    }
                }
            }
        }

        var layout = new Layout(graph)
        var renderer = new Renderer(`#${id}`, graph, 1000, 800)

        renderer.draw()
    }, [matrix, isolatedVertices, topsVertices, pendantVertices])

    return (
        <div id={id}></div>
    );
}