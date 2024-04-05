import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import Navbar from './Navbar'
import './assets/styles.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap';
import store from './store'
import { Provider } from 'react-redux'
import Hero from './Hero'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
        
      <Navbar />
      <Hero />
      <App />

    </Provider>

  </React.StrictMode>,
)
