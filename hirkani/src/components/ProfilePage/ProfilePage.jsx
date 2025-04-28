import { useState, useEffect } from "react";
import { Container, Tabs, Tab, Card, Spinner, ListGroup, Button, Dropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import api from "../Auxiliary/ApiAxios";
const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");
  const navigate = useNavigate();
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
  const handleAccept = async (user) => {
    try{
      await api.post(`/accept-follow-request/${user}`);
      // Update profile state to reflect the accepted request
      setProfile((prevProfile) => ({...prevProfile,
        followers: {...prevProfile.followers,
          followers_requested: prevProfile.followers.followers_requested.filter((u) => u !== user),
          followers: [...prevProfile.followers.followers, user],
        },
      }));
    }
    catch (error) {
      console.error("Error following/unfollowing:", error);
      setError({ message: error.message, status: error.response ? error.response.status : "Unknown" });
    }
  };
  const handleReject = async (user) => {
    try{
      await api.delete(`/reject-follow-request/${user}`);
      setProfile((prevProfile) => ({...prevProfile,
        followers: {...prevProfile.followers,
          followers_requested: prevProfile.followers.followers_requested.filter((u) => u !== user),
        },
      }));
    }
    catch (error) {
      console.error("Error while rejecting:", error);
      setError({ message: error.message, status: error.response ? error.response.status : "Unknown" });
    }
  };

  const handleCancel = async (user) => {
    try{
      await api.delete(`/cancel-follow-request/${user}`);
      // Update profile state to reflect the canceled request
      setProfile((prevProfile) => ({...prevProfile,
        following: {...prevProfile.following,
          following_requested: prevProfile.following.following_requested.filter((u) => u !== user),
        },
      }));
    }
    catch (error) {
      console.error("Error while canceling:", error);
      setError({ message: error.message, status: error.response ? error.response.status : "Unknown" });
    }
  };

  const deletePost = async (postId) => {
    try{
      await api.delete(`/delete-post/${postId}`);
      setProfile((prevProfile) => ({...prevProfile,
        posts: prevProfile.posts.filter((post) => post.id !== postId),
      }));
    }
    catch (error) {
      console.error("Failed to delete post", error);
      setError({ message: error.message, status: error.response ? error.response.status : "Unknown" });
    }
    
  };

  const handleManageBusiness = async () => {
    try {
      const response = await api.get('/is_business_handler');
      const { business_id, answer } = response.data;
      console.log("answer", answer);
      if (answer) {
        navigate(`/business-profile?business_id=${business_id}`);
      } else {
        navigate('/claim-business');
      }
    } catch (error) {
      console.error("Error verifying business ownership:", error);
    }
  };

  return (
    <Container className="d-flex flex-column align-items-center mt-4">
      {/* Welcome Message */}
      <Card className="p-4 text-center shadow-sm" style={{ maxWidth: "500px", width: "100%" }}>
        <h2>Welcome, {profile.username}!</h2>
        <p className="text-muted">{profile.email}</p>
        {/* a button to manage my business here */}
        <Button variant="primary" className="mt-3" onClick={handleManageBusiness}>
        Manage My Business
        </Button>
        
      </Card>

      {/* Tabs for Posts, Following, and Followers */}
      <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mt-3" fill>
        <Tab eventKey="posts" title={`Posts [${profile.posts.length}]`}>
          <div className="p-3">
            {profile.posts.length > 0 ? (
              profile.posts.map((post) => (
                <Card key={post.id} className="mb-3 shadow-sm">
                  <Card.Body>
                    {/* Dropdown for Post Actions */}
                    <Dropdown className="position-absolute top-0 end-0 m-2">
                      <Dropdown.Toggle variant="light" size="sm" id={`dropdown-post-${post.id}`}>
                        &#x22EE; {/* Unicode for three vertical dots */}
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => deletePost(post.id)}>Delete Post</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>

                    <Card.Title>{post.title}</Card.Title>
                    <Card.Subtitle>{post.rating}/5</Card.Subtitle>
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

        <Tab eventKey="following" title={`Following [${profile.following.following.length}]`}>
        <ListGroup className="mt-3">

          {/* Approved Following */}
          {profile.following.following.length > 0 ? (
            profile.following.following.map((user) => (
              <ListGroup.Item key={user}>
                <Link to={`/get-profile?who=${user}`} className="text-decoration-none">
                  {user}
                </Link>
              </ListGroup.Item>
            ))
          ) : (
            <p className="mt-3 text-muted">People you follow will appear here.</p>
          )}

          {/* Pending Following Requests */}
          {profile.following.following_requested.length > 0 && (
            <>
              <hr />
              <h6 className="text-muted">Pending Requests</h6>
              {profile.following.following_requested.map((user) => (
                <ListGroup.Item key={user} className="d-flex justify-content-between align-items-center">
                  <span>{user}</span>
                  <Button size="sm" variant="outline-danger" onClick={() => handleCancel(user)}>
                    Cancel Request
                  </Button>
                </ListGroup.Item>
              ))}
            </>
          )}

        </ListGroup>
      </Tab>


        <Tab eventKey="followers" title={`Followers [${profile.followers.followers.length}]`}>
        <ListGroup className="mt-3">

          {/* Approved Followers */}
          {profile.followers.followers.length > 0 ? (
            profile.followers.followers.map((user) => (
              <ListGroup.Item key={user}>
                <Link to={`/get-profile?who=${user}`} className="text-decoration-none">
                  {user}
                </Link>
              </ListGroup.Item>
            ))
          ) : (
            <p className="mt-3 text-muted">People following you will appear here.</p>
          )}

          {/* Pending Follower Requests */}
          {profile.followers.followers_requested.length > 0 && (
            <>
              <hr />
              <h6 className="text-muted">Follower Requests</h6>
              {profile.followers.followers_requested.map((user) => (
                <ListGroup.Item key={user} className="d-flex justify-content-between align-items-center">
                  <span>{user}</span>
                  <div>
                    <Button size="sm" variant="success" className="me-2" onClick={() => handleAccept(user)}>
                      Accept
                    </Button>
                    <Button size="sm" variant="outline-danger" onClick={() => handleReject(user)}>
                      Reject
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </>
          )}

        </ListGroup>
      </Tab>

      <Tab eventKey="bussiness_following" title={`Businesses Followed [${profile.businesses_followed.length}]`}>
        <ListGroup className="mt-3">

          {/* Approved Following */}
          {profile.businesses_followed.length > 0 ? (
            profile.businesses_followed.map((business) => (
              <ListGroup.Item key={business}>
                {business}
              </ListGroup.Item>
            ))
          ) : (
            <p className="mt-3 text-muted">People you follow will appear here.</p>
          )}

        </ListGroup>
      </Tab>
      </Tabs>
    </Container>
  );
};

export default ProfilePage;
