import React, {useState} from 'react'
import {getVertexCover, getEdges} from '../util';
export const EdgeVertexCover = ({ matrix, coverSize }) => {
    // Max progress for the progress bar
    const [maxProgress, setMaxProgress] = useState(100);
    // Current progress for the progress bar
    const [progress, setProgress] = useState(0);
    // Output for the final result
    const [outputCover, setOutputCover] = useState("");
    // This method looks for a vertex cover with a specific length
    const getCoverWithLength = (edges, k) => {
        let vertexCover;
        for(let i=0; i< edges.length; i++){
            // First increase the progress of the progressbar
            setProgress(prev => prev + 1)
            // Then look for a vertex cover
            vertexCover = getVertexCover([...edges], i, k)
            if (vertexCover.length == k){
                // If found, return it and set the progress to complete
                setProgress(maxProgress)
                return vertexCover;
            }
        }
        return `Could not find a vertex cover with size ${k}.`
    }

    
    // Frontend method
    const handleClick = (e) => {
        e.preventDefault();
        // Get the list of edges
        let edges = getEdges(matrix)
        // Adjust Progressbar
        setProgress(0)
        setMaxProgress(edges.length)
        // Get the vertex cover and set it as output
        const cover = getCoverWithLength(edges, coverSize)
        setOutputCover(cover.toString())
    }

    return (
        <>
            <div >
                <hr class="rounded"></hr>
                <button onClick={handleClick}>Calculate Own Edge-Based Brute Force</button> <br />
                <label for="optimizedFile">Progress:</label> <br />
                <progress id="optimizedFile" value={progress} max={maxProgress}></progress>
                <h3>Output - {outputCover}</h3>
            </div>
        </>
    );
}