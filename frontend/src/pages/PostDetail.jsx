import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { UserContext } from "../context/UserContext";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api.get(`/api/posts/${id}`)
      .then((res) => {
        if (!mounted) return;
        setPost(res.data);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to load post.");
      })
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [id]);

  // Helper: determine if logged-in user can delete
  const canDelete = (() => {
    if (!user || !post) return false;
    const author = post.author;
    const userId = user._id || user.id || null;
    const authorId = (author && (author._id || author.id)) || author || null;
    const isAuthor = userId && authorId && (String(userId) === String(authorId));
    const isAdmin = user.role === "admin";
    return isAuthor || isAdmin;
  })();

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) return;
    try {
      setDeleting(true);
      await api.delete(`/api/posts/${id}`); // axios instance attaches token
      alert("Post deleted successfully.");
      navigate("/");
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || err.message || "Failed to delete post.";
      alert(`Error: ${msg}`);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div className="container"><p>Loading post...</p></div>;
  if (!post) return <div className="container"><p>Post not found.</p></div>;

  return (
    <div className="container">
      <div className="post-detail">
        <div style={{display:'flex', alignItems:'flex-start', gap:12, justifyContent:'space-between'}}>
          <div style={{flex:1}}>
            <h2>{post.title}</h2>
            <p className="meta">By {post.author?.username || "Unknown"} • {new Date(post.createdAt).toLocaleString()}</p>
          </div>

          {canDelete && (
            <div>
              <button
                onClick={handleDelete}
                className="btn"
                style={{background: 'linear-gradient(90deg, #FF6F00, #FFB74D)'}}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete Post"}
              </button>
            </div>
          )}
        </div>

        <div className="post-content" style={{marginTop:14}}>
          {post.content}
        </div>
      </div>
    </div>
  );
}
