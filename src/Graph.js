import { render } from '@testing-library/react';
import React, { useEffect } from 'react'

export const Graph = ({ matrix, id }) => {
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
            graph.addNode(i.toString())
        }
        for (let i = 0; i < matrix.length; i++) {
            // Iterates through rows
            // j starts at i, so we take a look at 1 half of the matrix to avoid overlapping edges
            // i+1 to avoid diagonals
            for (let j = i + 1; j < matrix.length; j++) {
              // Inverting probability, so 0 can be lowest probability and 1 - highest
              if (matrix[i][j] === 1) {
                // Getting the edge on both sides
                graph.addEdge(i.toString(),j.toString())
            }
            }
          }

        //renders all items on the div with id paper
        var layout = new Layout(graph)
        var renderer = new Renderer(`#${id}`, graph, 1000, 800)

        renderer.draw()
    }, [matrix])

    return (
        <div id={id}></div>
    );
}