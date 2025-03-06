
// import './App.css'
import Header from './components/Header/Header'
import Login from './components/Login/Login'
import Footer from './components/Footer/Footer'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from './components/Signup/Signup';
import { Container, Row, Col } from 'react-bootstrap';
import ProtectedLayout from './components/Auxiliary/ProtectedLayout';
import ProfilePage from './components/ProfilePage/ProfilePage';
import HomePage from './components/HomePage/HomePage';
import SearchPage from './components/Search/Search';

function App() {
  
  return (
    <Router>
      <Container fluid className="d-flex flex-column min-vh-100">
        <Header />
        <Row className="flex-grow-1">
          <Col>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Login />} /> 
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                <Route element={<ProtectedLayout />}>
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/search" element={<SearchPage />} />
                </Route>
            </Routes>
          </Col>
        </Row>
        <Footer />
      </Container>
    </Router>
  );
}

export default App
