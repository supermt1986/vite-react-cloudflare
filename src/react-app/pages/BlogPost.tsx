import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

interface Comment {
  id: number;
  blog_id: number;
  author: string;
  content: string;
  created_at: string;
}

interface Blog {
  id: number;
  title: string;
  content: string;
  image?: string;
  created_at: string;
  comments: Comment[];
}

function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Comment form state
  const [author, setAuthor] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  
  // Refresh trigger for comments
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    if (id) {
      fetchBlog();
    }
  }, [id, refresh]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/blogs/${id}`);
      const result = await response.json();
      
      if (result.success) {
        setBlog(result.data);
      } else {
        setError(result.error || "Failed to fetch blog");
      }
    } catch (err) {
      setError("Failed to connect to the server");
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!author.trim() || !commentContent.trim()) {
      alert("请填写所有字段");
      return;
    }
    
    try {
      setCommentLoading(true);
      const response = await fetch(`/api/blogs/${id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ author, content: commentContent }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Reset form
        setAuthor("");
        setCommentContent("");
        // Trigger refresh to show new comment
        setRefresh(prev => prev + 1);
      } else {
        alert(result.error || "Failed to add comment");
      }
    } catch (err) {
      alert("Failed to connect to the server");
    } finally {
      setCommentLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <nav className="navbar">
          <div className="navbar-content">
            <div className="logo">Instagram风格博客</div>
          </div>
        </nav>
        <div className="main-content">
          <div className="blog-container">
            <div style={{ textAlign: "center", padding: "50px" }}>
              加载中...
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <nav className="navbar">
          <div className="navbar-content">
            <div className="logo">Instagram风格博客</div>
          </div>
        </nav>
        <div className="main-content">
          <div className="blog-container">
            <div style={{ textAlign: "center", padding: "50px", color: "red" }}>
              错误: {error}
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!blog) {
    return (
      <>
        <nav className="navbar">
          <div className="navbar-content">
            <div className="logo">Instagram风格博客</div>
          </div>
        </nav>
        <div className="main-content">
          <div className="blog-container">
            <div style={{ textAlign: "center", padding: "50px" }}>
              <p>未找到博客文章</p>
              <Link to="/" className="create-button">
                返回首页
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <nav className="navbar">
        <div className="navbar-content">
          <div className="logo">Instagram风格博客</div>
        </div>
      </nav>
      
      <div className="main-content">
        <div className="blog-container">
          <div className="blog-post-header">
            <Link to="/" className="back-link">← 返回首页</Link>
          </div>
          
          <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
            <article className="blog-post" style={{ flex: "1", minWidth: "300px" }}>
              <h1 className="blog-post-title">{blog.title}</h1>
              
              <div className="blog-post-meta">
                <div className="author">作者: 匿名用户</div>
                <p className="blog-date">
                  {new Date(blog.created_at).toLocaleDateString("zh-CN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              
              {blog.image ? (
                <div className="blog-post-image">
                  <img src={blog.image} alt={blog.title} />
                </div>
              ) : null}
              
              <div className="blog-post-content">
                <p>{blog.content}</p>
              </div>
            </article>
            
            <section className="comments-section" style={{ flex: "1", minWidth: "300px" }}>
              <h2>评论 ({blog.comments.length})</h2>
              
              <form onSubmit={handleAddComment} className="comment-form">
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="您的名字"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <textarea
                    placeholder="添加评论..."
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    className="form-textarea"
                    rows={3}
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={commentLoading}
                  className="submit-button"
                >
                  {commentLoading ? "发布中..." : "发布评论"}
                </button>
              </form>
              
              <div className="comments-list">
                {blog.comments.length === 0 ? (
                  <p className="no-comments">还没有评论，成为第一个评论的人吧！</p>
                ) : (
                  [...blog.comments].reverse().map((comment) => (
                    <div key={comment.id} className="comment">
                      <div className="comment-header">
                        <span className="comment-author">{comment.author}</span>
                        <span className="comment-date">
                          {new Date(comment.created_at).toLocaleDateString("zh-CN", {
                            month: "short",
                            day: "numeric"
                          })}
                        </span>
                      </div>
                      <p className="comment-content">{comment.content}</p>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

export default BlogPost;