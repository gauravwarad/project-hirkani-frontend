import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import './Footer.css'
const Footer = () => {
    return (
        <footer className="bg-dark text-white py-3">
            <Container>
                <Row className="justify-content-center">
                    <Col className="text-center">
                        <p className="mb-0">
                            Made with 💙 by <a href="https://www.gauravwarad.github.io" target="_blank" rel="noopener noreferrer" className="text-info">Gaurav</a>
                        </p>
                    </Col>
                </Row>
            </Container>
        </footer>
    )
}
export default Footer