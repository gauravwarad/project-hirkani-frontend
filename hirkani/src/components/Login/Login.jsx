import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom"; 
import React from 'react'
// import "./Login.css"
const Login = () => {
    return (
        <Container className="d-flex justify-content-center">
          <Row className="w-100">
            <Col xs={12} sm={8} md={6} lg={4}> {/* Adjust width on different screens */}
              <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control type="email" placeholder="Enter email" />
                  <Form.Text className="text-muted">
                    Enter the email you used to sign up.
                  </Form.Text>
                </Form.Group>
    
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="Password" />
                </Form.Group>
    
                <Button variant="primary" type="submit">
                  Submit
                </Button>

                <div className="text-center mt-3">
              <span>Don't have an account? </span>
              <Link to="/signup">Sign Up</Link>
            </div>
              </Form>
            </Col>
          </Row>
        </Container>
      );
}

export default Login
