import { useState } from "react";
import { Container, Tabs, Tab } from "react-bootstrap";
import HomePage from "./HomePage";
import BusinessHomePage from "./BusinessFeed";

const HomeTabs = () => {
  const [key, setKey] = useState("home");

  return (
    <Container className="py-4" style={{ maxWidth: "900px" }}>
      <Tabs
        id="home-business-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3"
        justify
      >
        <Tab eventKey="home" title="Home">
          <HomePage />
        </Tab>
        <Tab eventKey="business" title="Business Feed">
          <BusinessHomePage />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default HomeTabs;
