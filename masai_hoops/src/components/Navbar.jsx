import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto">
        <ul className="flex justify-between">
          <li>
            <a href="/" className="text-white text-lg font-bold">Home</a>
          </li>
          <li>
            <a href="/about" className="text-white text-lg font-bold">About</a>
          </li>
          <li>
            <a href="/predictions" className="text-white text-lg font-bold">Predictions</a>
          </li>
          <li>
            <a href="/customize" className="text-white text-lg font-bold">Customize</a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
