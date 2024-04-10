import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import Navbar from './Navbar';
import './assets/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap';
import store from './store';
import { Provider } from 'react-redux';
import Hero from './Hero';
import { Leva } from 'leva';
import { useSelector } from 'react-redux';
import Router from './Router';
import Footer from './Footer';

const rootElement = document.getElementById('root');


ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <Navbar />
      <Router />
      {/* <Footer /> */}
    </Provider>
  </React.StrictMode>
);
