import React, { useState } from 'react'
import { getEdges } from 'util'
import { Graph } from './Graph'

export const PendantsTops = ({ matrix }) => {
    // K used for Tops
    const [k, setK] = useState(0)
    const [kMatrix, setKMatrix] = useState(matrix)

    // Get the ammount of edges attached to a vertex
    const getDegrees = (matrix, vertex) => matrix[vertex].reduce((sum, currentValue) => sum + currentValue, 0)

    const isPendant = (matrix, vertex) => getDegrees(matrix, vertex) == 1

    const isTops = (matrix, vertex, k) => getDegrees(matrix, vertex) > k

    // Assume you get an non-tops vertex and turn it tops by adding edges until the degree > k
    const turnTops = (matrix, vertex, k) => {
        let i = 0;
        let matrixCopy = [...matrix]
        while (!isTops(matrixCopy, vertex, k)) {
            if (matrixCopy[vertex][i] == 0) {
                matrixCopy[vertex][i] = 1;
                matrixCopy[i][vertex] = 1;
            }
            i++;
        }
        setKMatrix(matrixCopy)
    }

    // Assume you get a tops vertex and turn it non-tops by removing edges until degree <= k
    const turnNonTops = (matrix, vertex, k) => {
        let i = 0;
        let matrixCopy = [...matrix]
        while (isTops(matrixCopy, vertex, k)) {
            if (matrixCopy[vertex][i] == 1) {
                matrixCopy[vertex][i] = 0;
                matrixCopy[i][vertex] = 0;
            }
            i++;
        }
        setKMatrix(matrixCopy)
    }

    // Assume you get a non-pendant vertex and turn it to pendant by removing edges until degree == 1
    const turnPendant = (matrix, vertex) => {
        let i = 0;
        let matrixCopy = [...matrix]
        while (getDegrees(matrixCopy, vertex) > 1) {
            if (matrixCopy[vertex][i] == 1) {
                matrixCopy[vertex][i] = 0;
                matrixCopy[i][vertex] = 0;
            }
            i++;
        }
        setKMatrix(matrixCopy)
    }

    // Assume you get a pendant vertex and turn it to non-pendant by adding 1 edge to it
    const turnNonPendant = (matrix, vertex) => {
        let matrixCopy = [...matrix]
        for (let j = 0; j < matrixCopy.length; j++) {
            if (matrixCopy[vertex][j] == 0) {
                matrixCopy[vertex][j] = 1;
                matrixCopy[j][vertex] = 1;
                setKMatrix(matrixCopy)
                break;
            }
        }
    }
    // Button handler - if a non-pendant is found, do action and break loop
    const handlePup = (e) => {
        e.preventDefault()
        for (let i = 0; i < matrix.length; i++) {
            if (!isPendant(matrix, i)) {
                turnPendant(matrix, i);
                break;
            }
        }
    }
    // Button handler - if a pendant is found, do action and break loop
    const handlePdown = (e) => {
        e.preventDefault()
        for (let i = 0; i < matrix.length; i++) {
            if (isPendant(matrix, i)) {
                turnNonPendant(matrix, i)
                break;
            }
        }

    }

    // Button handler - if a tops is found, do action and break loop; also checks k
    const handleTdown = (e) => {
        e.preventDefault()
        if (k < 0 || k > matrix.length)
            return;

            for (let i = 0; i < matrix.length; i++) {
                if (isTops(matrix, i, k)) {
                    turnNonTops(matrix, i, k)
                    break;
                }
            }

    }

    // Button handler - if a non-tops is found, do action and break loop; also checks k
    const handleTup = (e) => {
        e.preventDefault()
        if (k < 0 || k > matrix.length)
            return;
        
        for (let i = 0; i < matrix.length; i++) {
            if (!isTops(matrix, i, k)) {

                turnTops(matrix, i, k)
                break;
            }
        }
    }

    return (
        <>
            <h2>Pendants and Tops</h2>
            <button onClick={handlePdown} >P--</button>
            <button onClick={handlePup} >P++</button>
            <br /><label>Input K: </label>
            <input type="number" min="0" max={matrix.length} onChange={(e) => setK(e.target.value)}></input>
            <br />
            <button onClick={handleTdown} >T--</button>
            <button onClick={handleTup} >T++</button>
            <Graph matrix={kMatrix} id="PendantsTopsPaper" />
        </>
    );
}