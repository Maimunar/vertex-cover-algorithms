import './App.css';
import React, { useState, useEffect } from 'react'
import { VertexCover } from './FullAppComponents/VertexCover';
import { PendantsTops } from './FullAppComponents/PendantsTops';
import { OptimizedVertexCover } from './FullAppComponents/OptimizedVertexCover';
import { ImportExport } from './FullAppComponents/ImportExport';
import { KernelizationGraph } from './FullAppComponents/KernelizationGraph';
import { getIsolatedVertices, getPendantVertices, getTopsVertices } from './FullAppComponents/util';
import {EdgeVertexCover} from './FullAppComponents/EdgeVertexCover';
export const FullApp = () => {
    // Cover size - used for user input
    const [coverSize, setCoverSize] = useState(0);
    const [number, setNumber] = useState(0)
    const [probability, setProbability] = useState(0.0)
    // Matrix state used for graphs and displaying it
    const [matrix, setMatrix] = useState([])

    const [isolatedVertices, setIsolatedVertices] = useState([])
    const [topsVertices, setTopsVertices] = useState([])
    const [pendantVertices, setPendantVertices] = useState([])
    //Handles generation of graph given the user input
    const handleSubmit = (e) => {
        e.preventDefault()
        let n = parseInt(number)
        let p = parseFloat(probability)
        if (n < 0 && p < 0 && p > 1) {
            return
        }

        // Create a 2-Dimensional array of 0's
        let adjMatrix = Array.from(Array(n), _ => Array(n).fill(0));
        // Iterates through columns
        for (let i = 0; i < n; i++) {
            // Iterates through rows
            // j starts at i, so we take a look at 1 half of the matrix to avoid overlapping edges
            // i+1 to avoid diagonals
            for (let j = i + 1; j < n; j++) {
                // Inverting probability, so 0 can be lowest probability and 1 - highest
                if (Math.random() >= (1 - p)) {
                    // Getting the edge on both sides
                    adjMatrix[i][j] = 1;
                    adjMatrix[j][i] = 1;
                }
            }
        }
        setMatrix(adjMatrix)
    }

    //Prints the matrix in a proper format
    const printMatrix = (matrix) => {
        let output = ``
        for (let i = 0; i < matrix.length; i++) {
            output += `[ `
            for (let j = 0; j < matrix.length; j++) {
                output += `${matrix[i][j]}, `
            }
            output += `], \n`
        }
        return output
    }

    // Gets the main tree using bfs
    // A main tree is the tree that starts at index 0
    const getMainTree = (startLocation) => {
        // Very standard BFS implementation accustomed to a 2-D List
        let visited = new Array(matrix.length).fill(false);
        let mainTree = []
        let queue = [startLocation]

        visited[startLocation] = true

        while (queue.length > 0) {
            //Takes the first element of the queue and adds it to the main tree
            let current = queue[0]
            mainTree.push(current)
            queue.shift()

            for (let i = 0; i < matrix.length; i++) {
                // If any other item shares an edge with that item and is not visited, add to queue and visited
                if (matrix[current][i] === 1 && !visited[i]) {
                    queue.push(i)
                    visited[i] = true
                }
            }
        }
        return mainTree
    }

    // Handles connecting all the disconnected subgraphs
    const handleConnect = (e) => {
        e.preventDefault()
        //Adds the first main tree
        let mainTree = getMainTree(0)
        //While graphs are not connected (the tree that starts at 0 is shorter than the matrix)
        while (mainTree.length < matrix.length) {
            for (let i = 0; i <= matrix.length; i++) {
                //If you find an index in the matrix that is not in the main tree
                if (!mainTree.includes(i)) {
                    //Add an edge to the matrix and break out of the cycle to avoid extra edges
                    let tempMatrix = [...matrix]
                    tempMatrix[i][mainTree[0]] = 1
                    tempMatrix[mainTree[0]][i] = 1
                    setMatrix(tempMatrix)
                    break;
                }
            }
            // Reset main tree before while loop
            mainTree = getMainTree(0)
        }
    }

    useEffect(()=> {
        let isolated = getIsolatedVertices(matrix);
        let tops = getTopsVertices(matrix, coverSize);
        let pendants = getPendantVertices(matrix);
        setIsolatedVertices(isolated);
        setTopsVertices(tops);
        setPendantVertices(pendants);
    }, [matrix, coverSize])

    return (
        <>
            <h1>Vertex Cover</h1>
            <h2>Aleksandar, Martin</h2>
            <form>
                <p>Number of vertices</p>
                <input type="text" class="forminput" id="n" onChange={(e) => setNumber(e.target.value)}></input>
                <p>Graph density (edge probability)</p>
                <input type="text" class="forminput" id="prob" onChange={(e) => setProbability(e.target.value)}></input>
                <br />
                <button onClick={handleSubmit}>Generate Graph</button>
                {matrix.length > 0 ? <button onClick={handleConnect}>Connect Graph</button> : ''}
            </form>
            <ImportExport matrix={matrix} setMatrix={setMatrix}/> <br/> <hr/>
            <label for="forminput">Vertex Cover Size</label> <br />
            <input type="number" class="forminput" min="0" max={matrix.length} onChange={(e) => setCoverSize(e.target.value)} /> <br />
            <div className="calculators">
                <VertexCover matrix={matrix} coverSize={coverSize}/>
                <OptimizedVertexCover matrix={matrix} coverSize={coverSize} />
            </div>
            <EdgeVertexCover matrix={matrix} coverSize={coverSize} />
            <PendantsTops matrix={matrix} setMatrix={setMatrix} coverSize={coverSize}/>

            <KernelizationGraph matrix={matrix}  id="paper" isolatedVertices={isolatedVertices} 
            topsVertices={topsVertices} pendantVertices={pendantVertices}/>
            <h3>Adjacency Matrix:</h3>
            <div class="matrix">{matrix.length > 0 ? printMatrix(matrix).split('\n').map(line => <p className="matrix-p">{line}</p>) : ''}</div>            



        </>
    );
}