import React, { useState } from 'react'
import { coverToList, checkIfVC, isKReachable } from './bruteForceUtil'
export const VertexCover = ({ matrix }) => {
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
        setProgress(oldProgress => oldProgress + 1)
        if (i == graph.length) {
            let coverResult = checkIfVC(graph, cover, k);
            if (coverResult) {
                throw coverResult;
            }
            return coverResult
        } else {
            if (isKReachable(cover, graph.length, k, i)) {
                cover[i] = false;
                BruteForceVC(graph, cover, k, i + 1);
            }
            cover[i] = true;
            BruteForceVC(graph, cover, k, i + 1);
        }
    }

    // BruteForce
    const BruteForce = (graph, targetSize) => {
        let cover = new Array(graph.length).fill(false)
        try {
            BruteForceVC(graph, cover, targetSize, 0)
        } catch (err) {
            setProgress(maxProgress)
            return coverToList(err)
        }
        return "Could not find a result"
    }

    const handleClick = (e) => {
        e.preventDefault();
        setProgress(0)
        setMaxProgress(2 ** matrix.length)
        const cover = BruteForce(matrix, coverSize)
        setOutputCover(cover.toString())
    }
    return (
        <>
            <label for="forminput">Vertex Cover Size</label> <br />
            <input type="number" class="forminput" min="0" max={matrix.length} onChange={(e) => setCoverSize(e.target.value)} /> <br />
            <button onClick={handleClick}>Calculate</button> <br />
            <label for="file">Progress:</label> <br />
            <progress id="file" value={progress} max={maxProgress}></progress>
            <h3>Output - {outputCover}</h3>
        </>
    );
}