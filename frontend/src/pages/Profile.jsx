import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axiosConfig";
import PostCard from "../components/PostCard";
import Loader from "../components/Loader";
import { UserContext } from "../context/UserContext";

export default function Profile() {
  const { userId } = useParams();
  const { user: currentUser } = useContext(UserContext);

  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await api.get(`/api/posts/user/${userId}`);
        if (!mounted) return;
        const data = Array.isArray(res.data) ? res.data : (res.data.posts || []);
        setPosts(data || []);

        if (data && data.length > 0) {
          const author = data[0].author;
          const derived = author && (author.username || author.name) || "";
          setUsername(derived);
        } else {
          // Best-effort: try to get user info from /api/users/:userId (optional backend)
          try {
            const ru = await api.get(`/api/users/${userId}`);
            if (!mounted) return;
            setUsername(ru.data?.username || ru.data?.name || "");
          } catch (e) {
            // ignore, username can remain blank
          }
        }
      } catch (err) {
        console.error(err);
        if (!mounted) return;
        setError("Failed to load posts. Please try again later.");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }

    load();
    return () => { mounted = false; };
  }, [userId]);

  // callback when a post is deleted inside PostCard
  const handleDeleted = (deletedId) => {
    setPosts((prev) => prev.filter(p => String(p._id) !== String(deletedId)));
  };

  const viewingOwnProfile = currentUser && (String(currentUser._id || currentUser.id) === String(userId));

  return (
    <main style={{ maxWidth: "1100px", margin: "28px auto", padding: "0 20px 60px" }}>
      <div style={{ marginBottom: 18 }}>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", marginBottom: 6 }}>
          {username ? `${username}'s posts` : "User posts"}
        </h1>
        <p className="kicker" style={{ marginTop: 4 }}>
          {viewingOwnProfile ? "Viewing your profile" : `Viewing posts by ${username || "this user"}`}
        </p>
      </div>

      {loading && <Loader />}

      {!loading && error && (
        <div className="center" style={{ padding: 20 }}>
          <p className="kicker">{error}</p>
        </div>
      )}

      {!loading && !error && posts.length === 0 && (
        <div className="center" style={{ padding: 20 }}>
          <p className="kicker">No posts found for this user.</p>
        </div>
      )}

      {!loading && !error && posts.length > 0 && (
        <section>
          <div className="posts-grid">
            {posts.map((p) => (
              <PostCard
                key={p._id}
                post={p}
                highlight={viewingOwnProfile}
                onDeleted={handleDeleted}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
