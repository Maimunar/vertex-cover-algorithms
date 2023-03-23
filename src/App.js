import './App.css';
import React, { useState } from 'react'
import { Graph } from './Graph';
import { VertexCover } from './VertexCover';
import { PendantsTops } from './PendantsTops';
import { Kernelization } from './Kernelization';
import { OptimizedVertexCover } from './OptimizedVertexCover';

const App = () => {

  const [number, setNumber] = useState(0)
  const [probability, setProbability] = useState(0.0)
  // Matrix state used for graphs and displaying it
  const [matrix, setMatrix] = useState([])

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
    for(let i=0; i<matrix.length; i++){
      output += `[ `
      for(let j=0; j<matrix.length; j++){
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

    while (queue.length > 0){
      //Takes the first element of the queue and adds it to the main tree
      let current = queue[0]
      mainTree.push(current)
      queue.shift()

      for(let i=0; i<matrix.length; i++){
        // If any other item shares an edge with that item and is not visited, add to queue and visited
        if (matrix[current][i] === 1 && !visited[i]){
          queue.push(i)
          visited[i]=true
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
    while(mainTree.length < matrix.length){
      for(let i=0; i<=matrix.length; i++){
        //If you find an index in the matrix that is not in the main tree
        if(!mainTree.includes(i)){
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

  //Rendering of the whole application
  return (
    <>
      <h1>Week 1 Alg 2</h1>
      <h3>Aleksandar, Martin</h3>
      <form>
        <p>Number of vertices</p>
        <input type="text" class="forminput" id="n" onChange={(e) => setNumber(e.target.value)}></input>
        <p>Graph density (edge probability)</p>
        <input type="text" class="forminput" id="prob" onChange={(e) => setProbability(e.target.value)}></input>
        <br />
        <button onClick={handleSubmit}>Generate Graph</button>
        {matrix.length>0 ? <button onClick={handleConnect}>Connect Graph</button> : ''}
      </form>
      <div class="matrix">{matrix.length>0 ? printMatrix(matrix).split('\n').map(line => <p className="matrix-p">{line}</p>): ''}</div>
      <h2>Week 1</h2>
      <Graph matrix={matrix} id="paper" />
      <h2>Week 2</h2>
      <VertexCover matrix={matrix} />
      <h2>Week 3</h2>
      <PendantsTops matrix={matrix}/>
      <Kernelization matrix={matrix} />
      <h2>Week 4</h2>
      <OptimizedVertexCover matrix={matrix} />
    </>
  )

}

export default App;
