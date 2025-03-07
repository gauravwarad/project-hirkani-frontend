import React, { useState, useContext } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom"; 
import { useNavigate } from "react-router-dom";
import api from '../Auxiliary/ApiAxios';
import { AuthContext } from '../Auxiliary/AuthContext';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("")
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async(e) =>    {
      e.preventDefault();
      setError("");
      // console.log("inside handlesumbit in login")

      try{
          const formData = new FormData();
          formData.append("username", email);
          formData.append("password", password);
          const response = await api.post('http://127.0.0.1:8000/auth/jwt/login',
            formData, 
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
          );
          // console.log(response.data);
          const token = response.data.access_token;
          login(token);
          // localStorage.setItem('access_token', token);
          navigate("/home")
      }
      catch (err) {
          // setError(err.message);
          if (err.response) {
            console.error("Error Response:", err.response.data); // Log full error details
            setError(err.response.data.detail || JSON.stringify(err.response.data)); // Display error details
        } else if (err.request) {
            console.error("No response received:", err.request);
            setError("No response from server");
        } else {
            console.error("Error setting up request:", err.message);
            setError(err.message);
        }
      }
      
  }
    return (
        <Container className="d-flex justify-content-md-center">
          <Row className="w-100 justify-content-md-center">
            <Col xs={12} sm={8} md={6} lg={4}> {/* Adjust width on different screens */}
              <br/>
              <p>Welcome back! Login to you account :)</p>
              <br/>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                  <Form.Text className="text-muted">
                    Enter the email you used to sign up.
                  </Form.Text>
                </Form.Group>
    
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                </Form.Group>
                {error && <p className='text-danger'>{error}</p>}
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
