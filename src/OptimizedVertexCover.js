import React, { useState } from 'react'
import { coverToListEnhanced, checkIfVCEnhanced, isKReachableEnhanced } from './bruteForceUtil'
import { getIsolatedVertices, getPendantAdjacent, getTopVertex, getPendantVertex } from './util'

export const OptimizedVertexCover = ({ matrix }) => {
    // Cover size - used for user input
    const [coverSize, setCoverSize] = useState();
    // Max progress for the progress bar
    const [maxProgress, setMaxProgress] = useState(100);
    // Current progress for the progress bar
    const [progress, setProgress] = useState(0);
    // Output for the final result
    const [outputCover, setOutputCover] = useState("");

    // Recursive method to bruteforce vertex cover
    const BruteForceVC = (graph, cover, k, i) => {
        // Add to progress on every iteration
        setProgress(oldProgress => oldProgress + 1)
        if (i == graph.length) {
            // If VC is found, throw it to get out of the recursion stack
            let coverResult = checkIfVCEnhanced(graph, cover, k);
            if (coverResult) {
                throw coverResult;
            }
            return coverResult
            // Special case if the value is already predetermined
        } else if (cover[i] == 2 || cover[i] == -1) {
            BruteForceVC(graph, cover, k, i + 1)
        }
        else {
            if (isKReachableEnhanced(cover, graph.length, k, i)) {
                cover[i] = 0;
                BruteForceVC(graph, cover, k, i + 1);
            }
            cover[i] = 1;
            BruteForceVC(graph, cover, k, i + 1);
        }
    }

    // BruteForce
    const BruteForce = (graph, targetSize) => {
        let result = preProcessingBruteForce(graph, targetSize)
        // Result can either be an object with a cover and a graph, or a string saying there is no solution
        if (result instanceof Object) {
            try {
                BruteForceVC(result.graphCopy, result.cover, targetSize, 0)
            } catch (err) {
                setProgress(maxProgress)
                console.log(err)
                return coverToListEnhanced(err)
            }
        }
        return "Could not find a result"
    }

    const preProcessingBruteForce = (graph, targetSize) => {
        // Instead of false, fill cover with 0's
        let cover = new Array(graph.length).fill(0)
        // A function to copy 2-D Arrays
        var graphCopy = graph.map(function (arr) {
            return arr.slice();
        });
        //Preprocess Tops
        // Get top vertices to the cover and remove their edges from the graph until there are no more top vertices
        let top = getTopVertex(graphCopy, targetSize)
        while (top) {
            cover[top] = 2
            for (let i = 0; i < graphCopy.length; i++) {
                graphCopy[top][i] = 0
                graphCopy[i][top] = 0
            }
            top = getTopVertex(graphCopy, targetSize)
        }

        // Preprocess Pendants
        // Add their adjacent to the cover and make them isolated
        let pendant = getPendantVertex(graphCopy)
        while (pendant) {
            let pAdjacent = getPendantAdjacent(graphCopy, pendant)
            cover[pAdjacent] = 2
            for (let i = 0; i < graphCopy.length; i++) {
                graphCopy[pAdjacent][i] = 0
                graphCopy[i][pAdjacent] = 0
            }
            pendant = getPendantVertex(graphCopy)
        }

        // Preprossess Isolated
        // Make all isolated vertices in the graph null
        // At this moment all vertices that used to be pendants or tops are allready isolated, so we won't take them into account in the algorithm
        let isolated = getIsolatedVertices(graphCopy)

        isolated.forEach(isol => {
            for (let i = 0; i < graphCopy.length; i++) {
                if (cover[isol] != 2) cover[isol] = -1
                graphCopy[isol][i] = null
                graphCopy[i][isol] = null
            }
        })
        // Check if we can still find a solution
        // If our coversize is already bigger than k, we won't get a solution
        let coverSize = cover.reduce((sum, current) => {
            if (current == 2) return sum + 1
            else return sum
        }, 0)
        if (coverSize > targetSize) {
            console.log("Vertex Cover not available")
            return "Vertex Cover not Available"
        }
        return { cover, graphCopy: graphCopy }
    }

    const handleClick = (e) => {
        e.preventDefault();
        setProgress(0)
        setMaxProgress(2 ** matrix.length)
        const cover = BruteForce([...matrix], coverSize)
        setOutputCover(cover.toString())
    }
    return (
        <>
            <label for="forminput">Vertex Cover Size</label> <br />
            <input type="number" class="forminput" min="0" max={matrix.length} onChange={(e) => setCoverSize(e.target.value)} /> <br />
            <button onClick={handleClick}>Calculate</button> <br />
            <label for="optimizedFile">Progress:</label> <br />
            <progress id="optimizedFile" value={progress} max={maxProgress}></progress>
            <h3>Output - {outputCover}</h3>
        </>
    );
}