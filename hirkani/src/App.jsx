
// import './App.css'
import Header from './components/Header/Header'
import Login from './components/Login/Login'
import Footer from './components/Footer/Footer'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from './components/Signup/Signup';
import { Container, Row, Col } from 'react-bootstrap';

function App() {
  
  return (
    <Router>
      <Container fluid className="d-flex flex-column min-vh-100">
        <Header />
        <Row className="flex-grow-1">
          <Col>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </Col>
        </Row>
        <Footer />
      </Container>
    </Router>
  );
}

export default App
