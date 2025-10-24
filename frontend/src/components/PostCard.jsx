import React, { useRef, useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import api from "../api/axiosConfig";
import CalendarIcon from "./icons/CalendarIcon";
import UserIcon from "./icons/UserIcon";

export default function PostCard({ post, highlight = false, onDeleted }) {
  const ref = useRef();
  const [visible, setVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((ent) => {
          if (ent.isIntersecting) {
            setVisible(true);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const excerpt = post.content
    ? post.content.slice(0, 140) + (post.content.length > 140 ? "..." : "")
    : "";
  const cover = post.cover || post.image || null; // backend optional

  // resolve author id and username safely
  const authorObj = post.author || {};
  const authorId = (authorObj._id || authorObj.id || authorObj) || null;
  const authorName =
    (authorObj.username || authorObj.name) || String(authorObj) || "Unknown";

  // permission: user is author or admin
  const currentUserId = user ? (user._id || user.id) : null;
  const isAuthor =
    currentUserId &&
    authorId &&
    (String(currentUserId) === String(authorId));
  const isAdmin = user && user.role === "admin";
  const canModify = isAuthor || isAdmin;

  const handleEdit = () => {
    // navigate to write page with query param for editing; WritePost should read query to edit
    navigate(`/write?postId=${post._id}`);
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this post? This action cannot be undone."))
      return;
    try {
      setDeleting(true);
      await api.delete(`/api/posts/${post._id}`);
      alert("Post deleted.");
      if (typeof onDeleted === "function") onDeleted(post._id);
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message || err.message || "Failed to delete post.";
      alert(`Error: ${msg}`);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <article
      ref={ref}
      className={`post-card ${visible ? "visible" : ""} ${
        highlight ? "highlight" : ""
      }`}
    >
      {cover ? (
        <div
          className="cover"
          style={{ backgroundImage: `url(${cover})` }}
        />
      ) : null}
      <div className="content">
        <h3>{post.title}</h3>
        <div
          className="meta"
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            to={`/profile/${authorId}`}
            style={{
              display: "inline-flex",
              gap: 8,
              alignItems: "center",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                color: "#6b6b6b",
              }}
            >
              <UserIcon fill="#6b6b6b" />{" "}
              <span style={{ fontWeight: 500 }}>{authorName}</span>
            </span>
          </Link>

          <span
            style={{
              display: "inline-flex",
              gap: 6,
              alignItems: "center",
              color: "#6b6b6b",
            }}
          >
            <CalendarIcon fill="#6b6b6b" />{" "}
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>

        <p>{excerpt}</p>

        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            marginTop: 8,
          }}
        >
          <Link to={`/post/${post._id}`} className="read-more">
            Read more
          </Link>

          {canModify && (
            <>
              <button
                onClick={handleEdit}
                className="btn ghost"
                style={{ padding: "6px 10px" }}
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="btn"
                style={{ padding: "6px 10px" }}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
