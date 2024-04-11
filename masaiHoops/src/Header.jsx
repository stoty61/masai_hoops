import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Header({ title }) {
  return (
    <div>
      <h1>{title}</h1>
      <hr style={{ width: '100%', border: '1px solid black' }} />
    </div>
  );
}

export default Header;
