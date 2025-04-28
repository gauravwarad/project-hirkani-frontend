import React, { useState, useEffect } from "react";
import { Form, Button, Dropdown, DropdownButton } from "react-bootstrap";
import api from "../Auxiliary/ApiAxios";

const AddPost = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  // cosnt [selectedBusinessName, setSelectedBusinessName] = useState(null);
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState("");
  const [text, setText] = useState("");
  const [typingTimeout, setTypingTimeout] = useState(null);

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
    try {
      const response = await api.post("/search_places",  { textQuery: searchQuery });
      const data = await response.data;
      setBusinesses(data.places || []);
    } catch (error) {
      console.error("Error fetching places:", error);
    }
  };

//   const handleSearch = async () => {
//     try {
//       const response = await api.post("/search_places",  { textQuery: searchQuery });
//       const data = await response.data;
//       setBusinesses(data.places || []);
//     } catch (error) {
//       console.error("Error fetching places:", error);
//     }
//   };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBusiness) {
      alert("Please select a business before submitting.");
      return;
    }
    const postData = {
      business_id: selectedBusiness.id,
      business_name: selectedBusiness.name,
      business_address: selectedBusiness.address,
      title,
      rating,
      text,
    };
    console.log("Submitting post:", postData);
    try {
      const response = await api.post("/post",  postData);
      alert("Post submitted successfully!");
      // Reset form fields
      setTitle("");
      setRating("");
      setText("");
      setSelectedBusiness(null);
    } catch (error) {
      console.error("Error fetching places:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Create New Post</h2>
      <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
          <Form.Label>Search Business</Form.Label>
          <Dropdown className="w-100">
            <Dropdown.Toggle className="w-100" variant="light">
              {selectedBusiness ? `${selectedBusiness.name} - ${selectedBusiness.address}` : "Search for a business"}
            </Dropdown.Toggle>
            <Dropdown.Menu className="w-100 p-2">
              <Form.Control
                type="text"
                placeholder="Enter business name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {businesses.length > 0 && businesses.map((biz) => (
                <Dropdown.Item key={biz.id} onClick={() => setSelectedBusiness(biz)}>
                  {biz.name} - {biz.address}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Form.Group>



        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Rating</Form.Label>
          <Form.Control
            type="number"
            min="1"
            max="5"
            placeholder="Rate from 1 to 5"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Review</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Write your review"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </Form.Group>

        <Button type="submit">Submit</Button>
      </Form>
    </div>
  );
};

export default AddPost;
