import { useState, useEffect } from "react";
import "./../App.css";

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

function BlogIndex() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Create blog form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/blogs");
      const result = await response.json();
      
      if (result.success) {
        // Fetch comments for each blog
        const blogsWithData = await Promise.all(
          result.data.map(async (blog: Blog) => {
            const commentResponse = await fetch(`/api/blogs/${blog.id}`);
            const commentResult = await commentResponse.json();
            return commentResult.success ? commentResult.data : {...blog, comments: []};
          })
        );
        setBlogs(blogsWithData);
      } else {
        setError(result.error || "Failed to fetch blogs");
      }
    } catch (err) {
      setError("Failed to connect to the server");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      setCreateError("标题和内容是必填项");
      return;
    }
    
    try {
      setCreating(true);
      setCreateError(null);
      
      const response = await fetch("/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content, image: image || null }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Reset form
        setTitle("");
        setContent("");
        setImage("");
        // Refresh blogs
        fetchBlogs();
      } else {
        setCreateError(result.error || "创建博客失败");
      }
    } catch (err) {
      setCreateError("无法连接到服务器");
    } finally {
      setCreating(false);
    }
  };

  const handleAddComment = async (blogId: number, author: string, content: string) => {
    if (!author.trim() || !content.trim()) {
      alert("请填写所有字段");
      return;
    }
    
    try {
      const response = await fetch(`/api/blogs/${blogId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ author, content }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Refresh blogs to show new comment
        fetchBlogs();
      } else {
        alert(result.error || "Failed to add comment");
      }
    } catch (err) {
      alert("Failed to connect to the server");
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-content">
          <div className="logo">Instagram风格博客</div>
        </div>
      </nav>
      
      <div className="main-content">
        <div className="blog-container">
          <div className="home-header">
            <h1>欢迎来到我的博客</h1>
            <p>分享生活中的美好瞬间</p>
          </div>
          
          {loading ? (
            <div style={{ textAlign: "center", padding: "50px" }}>
              加载中...
            </div>
          ) : error ? (
            <div style={{ textAlign: "center", padding: "50px", color: "red" }}>
              错误: {error}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              {/* Create Blog Form */}
              <div className="create-blog-container" style={{ marginBottom: "40px", width: "100%" }}>
                <h2>创建新文章</h2>
                
                {createError && <div className="error-message">{createError}</div>}
                
                <form onSubmit={handleCreateBlog} className="create-blog-form">
                  <div className="form-group">
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="form-input"
                      placeholder="输入文章标题"
                    />
                  </div>
                  
                  <div className="form-group">
                    <input
                      type="text"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      className="form-input"
                      placeholder="图片URL (可选)"
                    />
                  </div>
                  
                  <div className="form-group">
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="form-textarea"
                      placeholder="写下您的文章内容..."
                      rows={4}
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={creating}
                    className="submit-button"
                  >
                    {creating ? "发布中..." : "发布文章"}
                  </button>
                </form>
              </div>
              
              {/* Blog List */}
              {blogs.length === 0 ? (
                <div className="no-blogs">
                  <p>还没有博客文章</p>
                </div>
              ) : (
                <div className="blog-list" style={{ width: "100%" }}>
                  {[...blogs].reverse().map((blog) => (
                    <div key={blog.id} className="blog-post" style={{ marginBottom: "30px", width: "100%" }}>
                      <h2 className="blog-post-title">{blog.title}</h2>
                      
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
                      
                      {/* Comments Section */}
                      <div className="comments-section" style={{ marginTop: "20px" }}>
                        <h3>评论 ({blog.comments.length})</h3>
                        
                        {/* Add Comment Form */}
                        <AddCommentForm 
                          blogId={blog.id} 
                          onAddComment={handleAddComment} 
                        />
                        
                        {/* Comments List */}
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
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Add Comment Form Component
function AddCommentForm({ blogId, onAddComment }: { blogId: number; onAddComment: (blogId: number, author: string, content: string) => void }) {
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !content.trim()) {
      alert("请填写所有字段");
      return;
    }
    
    setLoading(true);
    onAddComment(blogId, author, content);
    setAuthor("");
    setContent("");
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form">
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
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="form-textarea"
          rows={2}
        />
      </div>
      
      <button 
        type="submit" 
        disabled={loading}
        className="submit-button"
        style={{ padding: "6px 12px", fontSize: "14px" }}
      >
        {loading ? "发布中..." : "发布评论"}
      </button>
    </form>
  );
}

export default BlogIndex;