import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/styles.css'; // Add your custom CSS for styling

function Card({ title, text, right }) {
  return (
    <div className="row ms-1 me-1">
      {right && (
        <div className="col-md-6 border-only-right-side p-3">
          <div className="d-flex justify-content-center align-items-center h-100 ">
          
          </div>
        </div>
      )}
      <div className={`col-md-6 ${right ? `` : `border-only-right-side`}`}>
        <div className="card h-100">
          <div className="card-body">
            <h5 className="card-title">{title}</h5>
            <p className="card-text">{text}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
