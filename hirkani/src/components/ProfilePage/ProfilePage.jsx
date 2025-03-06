import { useState, useEffect } from "react";
import { Container, Tabs, Tab, Card, Spinner } from "react-bootstrap";
import api from "../Auxiliary/ApiAxios";
const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");

  useEffect(() => {
    const fetchProfile = async () => {
      // commenting below because axios instance is handling it now.
      // const token = localStorage.getItem("access_token");
      // if (!token) {
      //   console.error("No access token found!");
      //   navigate("/login")
      //   return;
      // }
      // using axios instance in api instead of fetch
      try {
        const response = await api.get(`/profile`);
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }

      // try {
      //   const response = await fetch("http://localhost:8000/profile", {
      //     method: "GET",
      //     headers: {
      //       Authorization: `Bearer ${token}`, // Send token in Authorization header
      //       "Content-Type": "application/json",
      //     },
      //   });
      //   if (!response.ok) throw new Error("Failed to fetch profile");
      //   const data = await response.json();
      //   setProfile(data);
      // } catch (error) {
      //   console.error(error);
      // }
    };

    fetchProfile();
  }, []);

  if (!profile) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="d-flex flex-column align-items-center mt-4">
      {/* Welcome Message */}
      <Card className="p-4 text-center shadow-sm" style={{ maxWidth: "500px", width: "100%" }}>
        <h2>Welcome, {profile.username}!</h2>
        <p className="text-muted">{profile.email}</p>
      </Card>

      {/* Tabs for Posts, Following, and Followers */}
      <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mt-3" fill>
        <Tab eventKey="posts" title={`Posts [${profile.posts.length}]`}>
          <div className="p-3">
            {profile.posts.length > 0 ? (
              profile.posts.map((post) => (
                <Card key={post.id} className="mb-3 shadow-sm">
                  <Card.Body>
                    <Card.Title>{post.title}</Card.Title>
                    <Card.Text>{post.content}</Card.Text>
                    <small className="text-muted">Posted on {new Date(post.created_at).toLocaleDateString()}</small>
                  </Card.Body>
                </Card>
              ))
            ) : (
              <p className="text-center">No posts yet.</p>
            )}
          </div>
        </Tab>

        <Tab eventKey="following" title={`Following [10]`}>
          <div className="p-3 text-center">Following list coming soon...</div>
        </Tab>

        <Tab eventKey="followers" title={`Followers [15]`}>
          <div className="p-3 text-center">Followers list coming soon...</div>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default ProfilePage;
