import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css"; 
import "ag-grid-community/styles/ag-theme-quartz.css"; 
import Header from './Header';

function Projections() {
  const [rowData, setRowData] = useState([
    { make: "Tesla", model: "Model Y", price: 64950, electric: true },
    { make: "Ford", model: "F-Series", price: 33850, electric: false },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false },
  ]);

  // Column Definitions: Defines the columns to be displayed.
  const [colDefs, setColDefs] = useState([
    { field: "make" },
    { field: "model" },
    { field: "price" },
    { field: "electric" }
  ]);

  const [allProjections, setProjections] = useState({});
  const [allColumns, setProjectionColumns] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false); // New state variable

  useEffect(() => {
    fetch('/api/projections') 
      .then(response => response.json())
      .then(data => {
        setProjectionColumns(data.column_names.map(str => ({ field: str, filter: true})));
        setProjections(
          data.rows.map(innerArray => {
            let obj = {};
            innerArray.forEach((value, index) => {
              obj[data.column_names[index]] = value;
            }); // Close forEach loop here
            return obj;
          })
        );
        setDataLoaded(true); // Set dataLoaded to true after fetching data
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);
  
  return (
    // wrapping container with theme & size
    <div className='p-3 m-3'>
      <Header title="Projections"/>

      <div
      className="ag-theme-quartz" // applying the grid theme
      style={{ height: 500 }} // the grid will fill the size of the parent container
      >
        {dataLoaded && ( // Conditionally render AgGridReact only when data is loaded
          <AgGridReact
            rowData={allProjections}
            columnDefs={allColumns}
          />
        )}
      </div>
    </div>
   )
}

export default Projections;
