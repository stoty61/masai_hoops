import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';

function Footer() {
  return (
    <footer className="mt-5">
      <Container>
        <Row>
          <Col>
            <h5>Footer Content</h5>
            <p>This is a basic footer example using React Bootstrap.</p>
          </Col>
        </Row>
        <Row>
          <Col>
            <p>&copy; {new Date().getFullYear()} Your Website</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
