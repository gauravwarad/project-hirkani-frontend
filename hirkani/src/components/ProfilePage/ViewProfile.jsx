import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Container, Tabs, Tab, Card, Spinner, Alert } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import api from "../Auxiliary/ApiAxios";

const ViewProfile = () => {
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");
  const [following, setFollowing] = useState(false);
  const [error, setError] = useState(null); 

  const location = useLocation();
  const username = new URLSearchParams(location.search).get("who");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!username) return; // if there's no username
      try {
        // const response = await api.get(`/profile`);
        const response = await api.get("/get-profile", { params: {who: username} } );
        setProfile(response.data);
        setFollowing(response.data.following); 
        setError(null);
      } catch (err) {
        // console.error("Error fetching profile:", error);
        // setError({ message: error.message, status: error.response ? error.response.status : "Unknown" });
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
    };

    fetchProfile();
  }, [username]);

  const handleFollow = async () => {
    try {
      if (following) {
        // Unfollow user
        await api.delete(`/unfollow/${username}`);
        setFollowing(false);
      } else {
        // Follow user
        await api.post(`/follow/${username}`);
        setFollowing(true);
      }
      setError(null); 
    } catch (error) {
      console.error("Error following/unfollowing:", error);
      setError({ message: error.message, status: error.response ? error.response.status : "Unknown" });
    }
  };

  if (!profile && !error) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="d-flex flex-column align-items-center mt-4">
    {/* Error Message */}
        {error && (
            
        <Alert variant="danger">
          <strong>Error:</strong> {error} 
        </Alert>
      )}
        
      {/* Welcome Message */}
      {profile && (
        <Card className="p-4 text-center shadow-sm" style={{ maxWidth: "500px", width: "100%" }}>
          <h2> {profile.username} </h2>
          {/* Follow Button */}
          <Button
            variant={following ? "outline-primary" : "primary"}
            onClick={handleFollow}
            title={following ? "Unfollow" : "Follow"}
          >
            {following ? "Following" : "Follow"}
          </Button>
        </Card>
      )}

      {/* Tabs for Posts, Following, and Followers */}
      {profile && (
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

          <Tab eventKey="following" title={``}>
            <div className="p-3 text-center">Oops that's private...</div>
          </Tab>

          <Tab eventKey="followers" title={``}>
            <div className="p-3 text-center">Oops that's private...</div>
          </Tab>
        </Tabs>
      )}
    </Container>
  );
};

export default ViewProfile;
