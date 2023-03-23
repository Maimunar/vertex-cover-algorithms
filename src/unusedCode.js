    // This method looks for a vertex cover with a specific length
    // const getCoverWithLength = (edges, k) => {
    //     for(let i=0; i< edges.length; i++){
    //         // First increase the progress of the progressbar
    //         setProgress(prev => prev + 1)
    //         // Then look for a vertex cover
    //         let vertexCover = getVertexCover([...edges], i, k)
    //         if (vertexCover.length == k){
    //             // If found, return it and set the progress to complete
    //             setProgress(maxProgress)
    //             return vertexCover;
    //         }
    //     }
    //     return `Could not find a vertex cover with size ${k}.`
    // }

    
    // Frontend method
    // const handleClick = (e) => {
    //     e.preventDefault();
    //     // Get the list of edges
    //     let edges = getEdges(matrix)
    //     // Adjust Progressbar
    //     setProgress(0)
    //     setMaxProgress(edges.length)
    //     // Get the vertex cover and set it as output
    //     const cover = getCoverWithLength(edges, coverSize)
    //     setOutputCover(cover.toString())
    // }