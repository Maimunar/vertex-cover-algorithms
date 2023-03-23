import React, { useEffect, useState } from 'react'
import { KernelizationGraph } from './KernelizationGraph'
// import {getEdges} from 'util'

export const Kernelization = ({matrix}) => {
    const [isolatedVertices, setIsolatedVertices] = useState([])
    const [topsVertices, setTopsVertices] = useState([])
    const [pendantVertices, setPendantVertices] = useState([])
    const [pendantAdjacent, setPendantAdjacent] = useState([])
    const [k, setK] = useState()
    const getDegrees = (matrix, vertex) => matrix[vertex].reduce((sum, currentValue) => sum + currentValue, 0)
    
    // If a vertex's degrees is 0, add to isolatedVertices
    const getIsolatedVertices = () => {
        let isolatedVertices = [];
        for (let i = 0; i < matrix.length; i++) {
            if (getDegrees(matrix, i) == 0)
                isolatedVertices.push(i)
        }
        setIsolatedVertices(isolatedVertices)
    }
    
    // If a vertex's degrees is >k, add to topsVertices
    const getTopsVertices = () => {
        let topsVertices = [];
        for (let i = 0; i < matrix.length; i++) {
            if (getDegrees(matrix, i) > k)
                topsVertices.push(i)
        }
        setTopsVertices(topsVertices)
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
    const getPendantVertices = () => {
        let pendantVertices = [];
        for (let i = 0; i < matrix.length; i++) {
            if (getDegrees(matrix, i) == 1)
                pendantVertices.push(i)
        }
        setPendantVertices(pendantVertices)

        let pendantAdjacent = getEdges(matrix)
            .filter(edge => pendantVertices.includes(edge[0]) || pendantVertices.includes(edge[1]))
            .reduce((pendantAdjList, currentEdge) => {
                if (!pendantAdjList.includes(currentEdge[0]))
                    pendantAdjList.push(currentEdge[0])
                if (!pendantAdjList.includes(currentEdge[1]))
                    pendantAdjList.push(currentEdge[1])
                return pendantAdjList
            }, [])
        setPendantAdjacent(pendantAdjacent)
    }

    //Get new pendant, tops and isolated vertices on every matrix and k change
    useEffect(()=> {
        getIsolatedVertices();
        getTopsVertices();
        getPendantVertices();
    }, [matrix, k])

    return (
            <>
            <h2>Kernelization</h2>
            <label>K: </label>
            <input type="number" min="1" max={matrix.length} onChange={(e) => setK(e.target.value)}></input>
            <p>Pendant Vertices: {pendantVertices.toString()}</p>
            <p>Pendant + Pendant Adjacent Vertices: {pendantAdjacent.toString()}</p>
            <p>Tops Vertices: {topsVertices.toString()}</p>
            <p>Isolated Vertices: {isolatedVertices.toString()}</p>
            <KernelizationGraph matrix={matrix} id="KernelizationPaper" isolatedVertices={isolatedVertices} pendantVertices={pendantVertices} topsVertices={topsVertices}/>
            </>
            );
}