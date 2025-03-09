import { useState, useEffect } from "react";
import { Container, Form, ListGroup, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import api from "../Auxiliary/ApiAxios";
const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceTimeout) clearTimeout(debounceTimeout); // Clear previous timeout

    if (value.length > 0) {
      setDebounceTimeout(
        setTimeout(() => fetchUsers(value), 500) // Call API after 500ms delay
      );
    } else {
      setUsers([]); // Clear results if input is empty
    }
  };

  const fetchUsers = async (searchQuery) => {
    setLoading(true);
    try {
    //   const token = localStorage.getItem("access_token");
    //   const response = await fetch(`http://localhost:8000/search?query=${searchQuery}`, {
    //     headers: { Authorization: `Bearer ${token}` },
    //   });
    //   if (!response.ok) throw new Error("Failed to fetch users");
    // commenting above and using axios instance
      const response = await api.get("/search", { params: { query: searchQuery } });
      const data = await response.data;
      setUsers(data);
      
    } catch (error) {
      console.error("Error searching users:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <h3>Search Users</h3>
      <Form.Control
        type="text"
        placeholder="Search by username..."
        value={query}
        onChange={handleSearch}
      />

      {loading && <Spinner animation="border" className="mt-3" />}

      <ListGroup className="mt-3">
        {users.length > 0 ? (
          users.map((user) => (
            <ListGroup.Item key={user.username}>
              <Link to={`/get-profile?who=${user.username}`} className="text-decoration-none">
                {user.username}
              </Link>
              {/* <small className="text-muted d-block">{user.email}</small> */}
            </ListGroup.Item>
          ))
        ) : (
          query.length > 0 && !loading && <p className="mt-3 text-muted">No users found.</p>
        )}
      </ListGroup>
    </Container>
  );
};

export default SearchPage;
