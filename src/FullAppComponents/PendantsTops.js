import React, { useState } from 'react'
import { getEdges } from '../util'

export const PendantsTops = ({ matrix, coverSize, setMatrix }) => {

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
        setMatrix(matrixCopy)
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
        setMatrix(matrixCopy)
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
        setMatrix(matrixCopy)
    }

    // Assume you get a pendant vertex and turn it to non-pendant by adding 1 edge to it
    const turnNonPendant = (matrix, vertex) => {
        let matrixCopy = [...matrix]
        for (let j = 0; j < matrixCopy.length; j++) {
            if (matrixCopy[vertex][j] == 0) {
                matrixCopy[vertex][j] = 1;
                matrixCopy[j][vertex] = 1;
                setMatrix(matrixCopy)
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
        if (coverSize < 0 || coverSize > matrix.length)
            return;

            for (let i = 0; i < matrix.length; i++) {
                if (isTops(matrix, i, coverSize)) {
                    turnNonTops(matrix, i, coverSize)
                    break;
                }
            }

    }

    // Button handler - if a non-tops is found, do action and break loop; also checks k
    const handleTup = (e) => {
        e.preventDefault()
        if (coverSize < 0 || coverSize > matrix.length)
            return;
        
        for (let i = 0; i < matrix.length; i++) {
            if (!isTops(matrix, i, coverSize)) {

                turnTops(matrix, i, coverSize)
                break;
            }
        }
    }

    return (
        <>
            <h2>Pendants and Tops</h2>
            <button onClick={handlePdown} >P--</button>
            <button onClick={handlePup} >P++</button>
            <br />
            <button onClick={handleTdown} >T--</button>
            <button onClick={handleTup} >T++</button>
        </>
    );
}