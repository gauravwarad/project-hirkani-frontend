import { useState, useEffect, useRef } from "react";
import { Button, Card, Spinner, Container } from "react-bootstrap";
import api from "../Auxiliary/ApiAxios";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef(null);
  const [hoveredPostId, setHoveredPostId] = useState(null);

  const limit = 10; // Number of posts per page

  const fetchPosts = async () => {
    if (!hasMore || loading) return;
    setLoading(true);
    const bodydata = { skip, limit };
    console.log("Fetching posts with body data:", bodydata);
    try {
      const response = await api.post("/home", bodydata);
      const data = await response.data;
      // setPosts(data);
      // setPosts((prevPosts) => [...prevPosts, ...data]);
      // Avoid duplicate posts by ensuring unique IDs (because initial call is being made twice...)
      setPosts((prevPosts) => {
        const existingIds = new Set(prevPosts.map(post => post.id));
        const uniqueNewPosts = data.filter(post => !existingIds.has(post.id));
        return [...prevPosts, ...uniqueNewPosts];
      });
      setHasMore(data.length === limit); // If we received less than limit, no more posts
    } catch (error) {
      console.error("Error fetching places:", error);
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
  
  const handleLikeToggle = async (postId, isLiked) => {
    try {
      if (isLiked) {
        await api.post(`/unlike/${postId}`);
      } else {
        await api.post(`/like/${postId}`);
      }
  
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                is_liked: !post.is_liked,
                likes: post.likes + (post.is_liked ? -1 : 1),
              }
            : post
        )
      );
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };
  
  return (
    <Container className="py-4" style={{ maxWidth: "800px" }}>
      {posts.length > 0 ? (
        posts.map((post, index) => (
          <Card key={post.id} className="mb-3 shadow-sm">
            {/* <Card.Body>
              <Card.Subtitle>{post.username} posted - </Card.Subtitle>
              <Card.Title>{post.title}</Card.Title>
              <Card.Subtitle>{post.rating}/5</Card.Subtitle>
              <Card.Text>{post.content}</Card.Text>
              <small className="text-muted">
                Posted on {new Date(post.created_at).toLocaleDateString()}
              </small>
              {index === posts.length - 1 && <div ref={lastPostRef}></div>}
            </Card.Body> */}
            <Card.Body>
            <Card.Subtitle>{post.username} posted - </Card.Subtitle>
            <Card.Title>{post.title}</Card.Title>
            <Card.Subtitle>{post.rating}/5</Card.Subtitle>
            <Card.Text>{post.content}</Card.Text>
            
            <div className="d-flex align-items-center gap-2 mt-2">
              <Button
                variant={post.is_liked ? "danger" : "outline-primary"}
                size="sm"
                onClick={() => handleLikeToggle(post.id, post.is_liked)}
                onMouseEnter={() => setHoveredPostId(post.id)}
                onMouseLeave={() => setHoveredPostId(null)}
              >
                {post.is_liked && hoveredPostId === post.id
                  ? "Unlike"
                  : post.is_liked
                  ? "Liked"
                  : "Like"}
              </Button>
              <small className="text-muted">{post.likes} likes</small>
            </div>

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

export default HomePage;
