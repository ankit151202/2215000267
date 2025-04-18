import { useState, useEffect } from "react";
import axios from "axios";

// Function to get a random image for each post
const getRandomImage = () => {
  const id = Math.floor(Math.random() * 1000);
  return `https://picsum.photos/seed/${id}/500/300`;
};

function App() {
  // State variables
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [posts, setPosts] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState("");
  const [comments, setComments] = useState([]);

  // 1. Get users when the app loads
  useEffect(() => {
    axios
      .get("http://20.244.56.144/evaluation-services/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  // 2. Get posts when a user is selected
  useEffect(() => {
    if (!selectedUserId) return;

    axios
      .get(`http://20.244.56.144/evaluation-services/users/${selectedUserId}/posts`)
      .then((res) => setPosts(res.data))
      .catch((err) => console.error("Error fetching posts:", err));
  }, [selectedUserId]);

  // 3. Get comments when a post is selected
  useEffect(() => {
    if (!selectedPostId) return;

    axios
      .get(`http://20.244.56.144/evaluation-services/users/${selectedPostId}/comments`)
      .then((res) => setComments(res.data))
      .catch((err) => console.error("Error fetching comments:", err));
  }, [selectedPostId]);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>📊 Social Media Analytics</h1>

      {/* User selection */}
      <div style={{ margin: "20px 0" }}>
        <label><strong>Select a User:</strong></label><br />
        <select
          value={selectedUserId}
          onChange={(e) => {
            setSelectedUserId(e.target.value);
            setPosts([]);
            setComments([]);
            setSelectedPostId("");
          }}
          style={{ padding: "10px", marginTop: "10px", width: "250px" }}
        >
          <option value="">-- Choose a User --</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name} (@{user.username})
            </option>
          ))}
        </select>
      </div>

      {/* Show posts */}
      {posts.length > 0 && (
        <div>
          <h2>📝 Posts by User</h2>
          {posts.map((post) => (
            <div key={post.id} style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "20px",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9"
            }}>
              <img
                src={getRandomImage()}
                alt="Post"
                style={{ width: "100%", borderRadius: "5px" }}
              />
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <button
                onClick={() => {
                  setSelectedPostId(post.id);
                  setComments([]);
                }}
                style={{ marginTop: "10px", cursor: "pointer" }}
              >
                View Comments
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Show comments */}
      {comments.length > 0 && (
        <div>
          <h2>💬 Comments for Selected Post</h2>
          {comments.map((comment) => (
            <div key={comment.id} style={{
              padding: "10px",
              marginBottom: "10px",
              backgroundColor: "#e7f3ff",
              borderRadius: "5px"
            }}>
              <p>{comment.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
