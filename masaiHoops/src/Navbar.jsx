import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import logo from './assets/logoOnly.png';
import name from './assets/name.png';
import { useSelector, useDispatch } from 'react-redux';
import { incrementByAmount, setUsername, setPassword, setEmail } from './slices/login_info';

function Intro() {
  const [incrementAmount, setIncrementAmount] = useState(2);
  const dispatch = useDispatch(); // Get the dispatch function

  const handleClick = () => {
    // Dispatch actions to update Redux state
    dispatch(incrementByAmount(2));
    dispatch(setUsername('username test'));
    dispatch(setPassword('password test'));
    dispatch(setEmail('email test'));
  };

  const user = useSelector((state) => state.loginInfo.username);
  const pass = useSelector((state) => state.loginInfo.password);
  const email = useSelector((state) => state.loginInfo.email);

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
          <div className="justify-content-center websiteName">
            <Navbar.Text> <img src={name} height="40" className="d-inline-block align-top" alt="Logo" /> </Navbar.Text>
          </div>

          {/* Search form */}
          <Form className="d-flex justify-content-end text-end">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-success" className='me-2'>Search</Button>
            <Button onClick={handleClick} variant="outline-success"> TEST <span>{user}</span> | <span>{pass}</span>  | <span>{email}</span>  </Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Intro;
