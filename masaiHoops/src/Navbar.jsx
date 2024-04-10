import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import logo from './assets/logoOnly.png';
import sitename from './assets/name.png';
import { useSelector, useDispatch } from 'react-redux';
import { incrementByAmount, setUsername, setPassword, setEmail } from './slices/login_info';
import { IoIosLogIn } from "react-icons/io";
import { setActiveTab } from './slices/globalInfo';

function Intro() {
  const [incrementAmount, setIncrementAmount] = useState(2);
  const dispatch = useDispatch(); // Get the dispatch function

  var showModal = false;

  const setUserInfo = (new_user, new_pass, new_email) => {
    // Dispatch actions to update Redux state
    dispatch(incrementByAmount(2));
    dispatch(setUsername(new_user));
    dispatch(setPassword(new_pass));
    dispatch(setEmail(new_email));
  };
  

  // setUserInfo("Test", "Test_pw", "Test_email"); 

  const name = useSelector((state) => state.loginInfo.username);
  const pw = useSelector((state) => state.loginInfo.password);
  const email = useSelector((state) => state.loginInfo.email);


  const loginButton = () => {
    if (signedIn)
    {
      // take to user information
    }

    else 
    {
      showModal = true;
    }
  };

  const addUser = () => {

    // Make sure user and password are not empty
    // Make the POST request
    fetch('/api/addUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({"name": name, "pw": pw, "email": email})
    })
    .then(response => {
      if (response.ok) {
        // Handle successful response
        console.log('User added successfully.');
      } else {
        // Handle error response
        throw new Error('Failed to add user.');
      }
    })
    .catch(error => {
      console.error('Error adding user:', error);
    });
  }
  

  var signedIn = false;

  if (name != "" && pw != "" && email != "")
  {
    signedIn = true;
  }

  return (
    // bg-body-tertiary
    <Navbar expand="lg" className=" custom-nav-bg">
      <Container fluid className="d-flex">
        {/* Logo */}
        <Navbar.Brand href="#">
          <img src={logo} height="50" className="d-inline-block align-top" alt="Logo" />
        </Navbar.Brand>

        {/* Navbar toggler */}
        <Navbar.Toggle aria-controls="navbarScroll" />

        {/* Navbar links and form */}
        <Navbar.Collapse id="navbarScroll" className='justify-content-between'>
          <div>
            <Nav className="me-auto my-2 my-lg-0" navbarScroll>
              <Nav.Link active href="#action1">Home</Nav.Link>
              <Nav.Link href="#action4">About</Nav.Link>
              <Nav.Link href="#action2">Projections</Nav.Link>
              <Nav.Link href="#action3">Optimization</Nav.Link>
              <NavDropdown title="Trends" id="navbarScrollingDropdown">
                <NavDropdown.Item href="#action5">Overperformers</NavDropdown.Item>
                <NavDropdown.Item href="#action6">Underperformers</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </div>

          {/* Website name */}
          {/* <div className="justify-content-center websiteName">
            <Navbar.Text> <img src={sitename} height="40" className="d-inline-block align-top" alt="Logo" /> </Navbar.Text>
          </div> */}

          {/* Search form */}
          <Form className="d-flex justify-content-end text-end">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-success" className='me-2 navbutton'>Search</Button>
            <Button className='navbutton' onClick={addUser} variant="outline-success"> 
              {signedIn ? <div>{name}</div> : <div className='single-line'><IoIosLogIn className='login-icon'/> Login</div>}
            </Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Intro;
