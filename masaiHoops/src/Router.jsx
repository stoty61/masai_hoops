import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import './index.css';
import './assets/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap';
import Hero from './Hero';
import { Leva } from 'leva';
import { useSelector } from 'react-redux';

function Router() {
  const activeTab = useSelector((state) => state.globalInfo.activeTab);

  const render = () =>
  {
    switch(activeTab){
      case "home":
        return(
          <>
            <Hero />
            <Leva />
            <App />
          </>
        )

      case "test":
        return(
          <>
          </>
        )
    } 

  } 


  return (
    <>
      {render()}
    </>
  );
}

export default Router;
