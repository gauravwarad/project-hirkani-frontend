import { useState, useEffect } from "react";
import { Card, Container, Spinner, Alert, Button, ListGroup, Modal, Form } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import api from "../Auxiliary/ApiAxios";

const BusinessProfile = () => {
  const location = useLocation();
  const business_id = new URLSearchParams(location.search).get("business_id");

  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [followLoading, setFollowLoading] = useState(false);

  const [showPostModal, setShowPostModal] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [postSubmitting, setPostSubmitting] = useState(false);

  useEffect(() => {
    const fetchBusinessProfile = async () => {
      try {
        const response = await api.get(`/business_profile/${business_id}`);
        setBusiness(response.data);
      } catch (err) {
        setError("Failed to fetch business profile.");
      } finally {
        setLoading(false);
      }
    };

    if (business_id) {
      fetchBusinessProfile();
    }
  }, [business_id]);

  const handleFollowToggle = async () => {
    if (!business) return;
    setFollowLoading(true);
    try {
      const endpoint = business.is_followed
        ? `/unfollow_business/${business_id}`
        : `/follow_business/${business_id}`;
      
      await api.post(endpoint);
  
      setBusiness((prev) => ({
        ...prev,
        is_followed: !prev.is_followed,
        followers_count: prev.is_followed
          ? prev.followers_count - 1
          : prev.followers_count + 1,
      }));
    } catch (err) {
      console.error("Failed to toggle follow status", err);
    }
    setFollowLoading(false);
  };
  

  const handleNewPost = () => {
    setShowPostModal(true);
  };

  const handlePostSubmit = async () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    setPostSubmitting(true);
    try {
      await api.post("/post_business", {
        business_id,
        title: newPostTitle,
        content: newPostContent,
      });

      setBusiness((prev) => ({
        ...prev,
        posts: [
          ...prev.posts,
          {
            id: Date.now(), // Temporary ID, assuming API returns real ID on next fetch
            title: newPostTitle,
            content: newPostContent,
          },
        ],
      }));

      setShowPostModal(false);
      setNewPostTitle("");
      setNewPostContent("");
    } catch (err) {
      console.error("Failed to submit new post.");
    }
    setPostSubmitting(false);
  };

  return (
    <Container className="py-4">
      <h2 className="mb-3">Business Profile</h2>
      <p className="text-muted">
        Here are the places your friends have visited. Anything that interests you?
      </p>

      {loading ? (
        <div className="d-flex justify-content-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : error ? (
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      ) : (
        business && (
          <Card className="p-4 shadow-sm mt-4">
            <h4>{business.name}</h4>
            <p className="text-muted">{business.address}</p>

            <div className="d-flex flex-wrap align-items-center mt-2 mb-3">
              <div className="me-4 text-muted" style={{ fontSize: "0.9rem" }}>
                Rating: {business.average_rating.toFixed(1)} ({business.num_ratings} ratings)
              </div>
              <div className="me-4 text-muted" style={{ fontSize: "0.9rem" }}>
                Followers: {business.followers_count}
              </div>
            </div>

            <div className="mt-3 mb-4">
              {business.is_handler ? (
                <Button variant="success" onClick={handleNewPost}>
                  New Post
                </Button>
              ) : (
                <Button
                  variant={business.is_followed ? "outline-primary" : "primary"}
                  onClick={handleFollowToggle}
                  disabled={followLoading}
                >
                  {followLoading
                    ? "Loading..."
                    : business.is_followed
                    ? "Following"
                    : "Follow"}
                </Button>
              )}
            </div>

            <hr />

            <h5 className="mt-4">Posts</h5>
            {business.posts.length === 0 ? (
              <p className="text-muted">No posts available.</p>
            ) : (
              <ListGroup variant="flush">
                {business.posts.map((post) => (
                  <ListGroup.Item key={post.id}>
                    <h6>{post.title}</h6>
                    <p style={{ fontSize: "0.9rem" }}>{post.content}</p>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Card>
        )
      )}

      {/* Modal for New Post */}
      <Modal show={showPostModal} onHide={() => setShowPostModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="postTitle" className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="postContent" className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Enter content"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPostModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handlePostSubmit}
            disabled={postSubmitting}
          >
            {postSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default BusinessProfile;
