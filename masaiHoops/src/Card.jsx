import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Card() {
  return (
    <div className='d-flex justify-content-center'>
      <div className="card w-100">
        <div className="card-body text-center">
          <h5 className="card-title">Championships are built through proper management</h5>
          <p className="card-text">And proper management requires cutting edge tools</p>
          <a href="#" className="btn btn-primary">About masAI</a>
        </div>
      </div>
    </div>
  );
}

export default Card;
