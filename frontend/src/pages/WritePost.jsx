import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axiosConfig";
import { UserContext } from "../context/UserContext";

export default function WritePost() {
  const { user, isAuthenticated } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Read ?postId= query param for editing
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("postId");
  const isEdit = Boolean(id);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");
  const [unauthorized, setUnauthorized] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated()) navigate("/login");
  }, [isAuthenticated, navigate]);

  // Fetch post data if editing
  useEffect(() => {
    if (!isEdit) return;
    let mounted = true;
    const fetchPost = async () => {
      setFetching(true);
      setError("");
      try {
        const res = await api.get(`/api/posts/${id}`);
        if (!mounted) return;
        const post = res.data;
        setTitle(post.title || "");
        setContent(post.content || "");

        // Authorization check
        const author = post.author || {};
        const authorId = author._id || author.id || author;
        const currentUserId = user ? (user._id || user.id) : null;
        const isAuthor = currentUserId && authorId && String(currentUserId) === String(authorId);
        const isAdmin = user && user.role === "admin";

        if (!isAuthor && !isAdmin) {
          setUnauthorized(true);
        }
      } catch (err) {
        console.error("Failed to fetch post:", err);
        setError("Failed to load post for editing.");
      } finally {
        if (mounted) setFetching(false);
      }
    };

    fetchPost();
    return () => { mounted = false; };
  }, [id, isEdit, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (unauthorized) {
      alert("You are not authorized to edit this post.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      if (isEdit) {
        await api.put(`/api/posts/${id}`, { title, content });
        alert("Post updated.");
        navigate(`/post/${id}`);
      } else {
        const res = await api.post("/api/posts", { title, content });
        const newId = res.data._id || res.data.id || res.data?.post?._id;
        alert("Post created.");
        navigate(`/post/${newId}`);
      }
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || err.message || "Failed to save post.";
      setError(msg);
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="container"><p>Loading post...</p></div>;

  return (
    <div className="container">
      <h2>{isEdit ? "Edit Post" : "Write a new post"}</h2>

      {unauthorized && (
        <div className="form" style={{marginBottom:12}}>
          <p style={{color:'crimson', margin:0}}>
            You are not authorized to edit this post.
          </p>
        </div>
      )}

      <form className="form" onSubmit={handleSubmit} style={{display:'flex', flexDirection:'column', gap:12}}>
        <label>Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={unauthorized}
          style={{padding:'8px', fontSize:'1rem', width:'100%'}}
          placeholder="Enter post title"
        />

        <label>Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="14"
          required
          disabled={unauthorized}
          style={{padding:'8px', fontSize:'1rem', width:'100%'}}
          placeholder="Write your post content here..."
        />

        {error && <p style={{color:'crimson'}}>{error}</p>}

        <div style={{display:'flex', gap:8, marginTop:6}}>
          <button type="submit" className="btn" disabled={loading || unauthorized}>
            {loading ? (isEdit ? "Updating..." : "Publishing...") : (isEdit ? "Update Post" : "Publish")}
          </button>

          <button
            type="button"
            className="btn ghost"
            onClick={() => navigate(isEdit ? `/post/${id}` : "/")}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
