import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateBlog() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      setError("标题和内容是必填项");
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch("/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content, image: image || null }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        navigate(`/blog/${result.data.id}`);
      } else {
        setError(result.error || "创建博客失败");
      }
    } catch (err) {
      setError("无法连接到服务器");
    } finally {
      setLoading(false);
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
          <div className="create-blog-container">
            <h1>创建新文章</h1>
            
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit} className="create-blog-form">
              <div className="form-group">
                <label htmlFor="title">标题</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="form-input"
                  placeholder="输入文章标题"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="image">图片URL (可选)</label>
                <input
                  type="text"
                  id="image"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="form-input"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="content">内容</label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="form-textarea"
                  placeholder="写下您的文章内容..."
                  rows={8}
                />
              </div>
              
              <div className="form-actions">
                <button 
                  type="button" 
                  onClick={() => navigate("/")}
                  className="cancel-button"
                >
                  取消
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="submit-button"
                >
                  {loading ? "发布中..." : "发布文章"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateBlog;