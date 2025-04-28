import { useState, useEffect } from "react";
import { Card, Container, Spinner, Tab, Tabs } from "react-bootstrap";
import api from "../Auxiliary/ApiAxios";

const Discover = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("list");

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await api.get("/listview");
        setBusinesses(response.data);
      } catch (error) {
        console.error("Error fetching businesses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  return (
    <Container className="py-4">
      <h2 className="mb-3">Discover</h2>
      <p className="text-muted">
        Here are the places your friends have visited. Anything that interests you?
      </p>

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
        fill
      >
        <Tab eventKey="list" title="List View">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" role="status" />
            </div>
          ) : businesses.length === 0 ? (
            <p>No recommendations available yet.</p>
          ) : (
            businesses.map((biz) => (
              <Card key={biz.business_id} className="mb-3 shadow-sm">
                <Card.Body>
                  <Card.Title>{biz.business_name}</Card.Title>
                  <Card.Text>{biz.business_address}</Card.Text>
                  <Card.Text>
                    <strong>Rating:</strong> {biz.business_rating.toFixed(1)} / 5 ({biz.ratings})
                  </Card.Text>
                </Card.Body>
              </Card>
            ))
          )}
        </Tab>

        <Tab eventKey="map" title="Map View">
          <div className="text-center py-5">
            <p>Map view coming soon! You'll be able to see friend-recommended places nearby here.</p>
          </div>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default Discover;
