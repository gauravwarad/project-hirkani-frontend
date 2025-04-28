import { useState, useEffect } from "react";
import { Card, Container, Spinner, Button, Form } from "react-bootstrap";
import api from "../Auxiliary/ApiAxios";
import { useNavigate } from "react-router-dom";

const SearchBusiness = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [businesses, setBusinesses] = useState([]);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setBusinesses([]);
      return;
    }
    if (typingTimeout) clearTimeout(typingTimeout);
    const timeout = setTimeout(() => {
      fetchBusinesses();
    }, 500); // Delay to wait for typing to stop
    setTypingTimeout(timeout);
  }, [searchQuery]);

  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      const response = await api.post("/search_places", { textQuery: searchQuery });
      const data = await response.data;
      setBusinesses(data.places || []);
    } catch (error) {
      console.error("Error fetching places:", error);
    }
    setLoading(false);
  };

  const handleSelectBusiness = (business) => {
    setSelectedBusiness(business);
  };

  const handleSubmit = async () => {
    if (!selectedBusiness) return;
    setSubmitting(true);
    try {
      const bodyData = {
        google_id: selectedBusiness.id,
        name: selectedBusiness.name,
        address: selectedBusiness.address,
        }
      const response = await api.post(`/save-business`, bodyData);
      console.log("Business saved successfully:", response.data);
      const business_id  = response.data.business_id;
      console.log("Business ID:", business_id);
      navigate(`/business-profile?business_id=${business_id}`);
    //   alert("Business saved successfully!");
      setSelectedBusiness(null);
      setSearchQuery("");
      setBusinesses([]);
    } catch (error) {
      console.error("Error visiting business:", error);
      alert("Failed to visit business.");
    }
    setSubmitting(false);
    
  };

  return (
    <Container className="py-4">
      <h2 className="mb-3">Search Business</h2>
      <p className="text-muted">
        Search for Businesses and the hit submit...
      </p>

      <Form.Group className="mb-3" controlId="searchQuery">
        <Form.Control
          type="text"
          placeholder="Search businesses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Form.Group>

      {loading && <Spinner animation="border" />}

      <div className="d-flex flex-column">
        {businesses.map((business) => (
          <Card
            key={business.id}
            className={`mb-2 ${selectedBusiness?.id === business.id ? "border-primary" : ""}`}
            onClick={() => handleSelectBusiness(business)}
            style={{ cursor: "pointer" }}
          >
            <Card.Body>
              <Card.Title>{business.name}</Card.Title>
              <Card.Text>{business.address}</Card.Text>
            </Card.Body>
          </Card>
        ))}
      </div>

      <div className="mt-3">
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!selectedBusiness || submitting}
        >
          {submitting ? "Claiming..." : "Submit"}
        </Button>
      </div>
    </Container>
  );
};

export default SearchBusiness;
