import React from 'react'

export const ImportExport = ({ matrix, setMatrix }) => {

    const export2txt = (e) => {
        e.preventDefault()
        const jsonObject = {
            adjacencyMatrix: matrix
        }
      
        const a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([JSON.stringify(jsonObject, null, 2)], {
          type: "text/json"
        }));
        a.setAttribute("download", "matrix.json");
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }

      const handleImport = (e) => {
        e.preventDefault()
        var reader = new FileReader();
        reader.onload = onReaderLoad;
        reader.readAsText(e.target.files[0]);  
    }
    
    const onReaderLoad= (e) => {
        let obj = JSON.parse(e.target.result);
        if (obj)
            setMatrix(obj.adjacencyMatrix)
    }
    return (
        <>
            <button onClick={export2txt}>Export to JSON</button> <br/>
            <label for="file">Import JSON</label> <br/>
            <input type="file" id="file" onChange={handleImport}/>
        </>
    );
}