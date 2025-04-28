import { useState, useEffect, useRef } from "react";
import { Card, Spinner, Container } from "react-bootstrap";
import api from "../Auxiliary/ApiAxios";

const BusinessHomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef(null);

  const limit = 10; // Number of posts per page

  const fetchPosts = async () => {
    if (!hasMore || loading) return;
    setLoading(true);
    const bodydata = { skip, limit };
    console.log("Fetching business posts with body data:", bodydata);
    try {
      const response = await api.post("/business_home", bodydata);
      const data = await response.data;
      setPosts((prevPosts) => {
        const existingIds = new Set(prevPosts.map(post => post.id));
        const uniqueNewPosts = data.filter(post => !existingIds.has(post.id));
        return [...prevPosts, ...uniqueNewPosts];
      });
      setHasMore(data.length === limit);
    } catch (error) {
      console.error("Error fetching business posts:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, [skip]);

  const lastPostRef = useRef(null);
  useEffect(() => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setSkip((prev) => prev + limit);
      }
    });
    if (lastPostRef.current) {
      observer.current.observe(lastPostRef.current);
    }
  }, [loading, hasMore]);

  return (
    <Container className="py-4" style={{ maxWidth: "800px" }}>
      {posts.length > 0 ? (
        posts.map((post, index) => (
          <Card key={post.id} className="mb-3 shadow-sm">
            <Card.Body>
              <Card.Subtitle>{post.username} posted - </Card.Subtitle>
              <Card.Title>{post.title}</Card.Title>
              <Card.Text>{post.content}</Card.Text>

              <small className="text-muted">
                Posted on {new Date(post.created_at).toLocaleDateString()}
              </small>

              {index === posts.length - 1 && <div ref={lastPostRef}></div>}
            </Card.Body>
          </Card>
        ))
      ) : (
        <p className="text-center">No posts available.</p>
      )}
      {loading && (
        <div className="text-center mt-3">
          <Spinner animation="border" />
        </div>
      )}
    </Container>
  );
};

export default BusinessHomePage;
