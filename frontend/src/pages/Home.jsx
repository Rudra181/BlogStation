import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosConfig";
import PostCard from "../components/PostCard";
import Loader from "../components/Loader";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/posts")
      .then((res) => setPosts(res.data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Callback for when a post is deleted
  const handlePostDeleted = (deletedId) => {
    setPosts((prevPosts) => prevPosts.filter((p) => p._id !== deletedId));
  };

  return (
    <main>
      <div className="hero">
        <div>
          <h1>Share your ideas on BlogStation</h1>
          <p>Publish articles, tutorials, and stories — modern, clean, and fast.</p>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <Link to="/write" className="btn">Write a Post</Link>
        </div>
      </div>

      <section>
        <h2 style={{ marginBottom: 12 }}>Latest posts</h2>
        {loading ? <Loader /> : null}
        <div className="posts-grid">
          {!loading && posts.map((p) => (
            <PostCard key={p._id} post={p} onDeleted={handlePostDeleted} />
          ))}
          {!loading && posts.length === 0 ? <p className="center kicker">No posts yet.</p> : null}
        </div>
      </section>
    </main>
  );
}
