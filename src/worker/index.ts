import { Hono } from "hono";

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

// 初始化数据库表
app.get("/api/setup", async (c) => {
  try {
    await c.env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS blogs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        image TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    await c.env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        blog_id INTEGER NOT NULL,
        author TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (blog_id) REFERENCES blogs (id) ON DELETE CASCADE
      )
    `).run();

    return c.json({ 
      success: true, 
      message: "Database tables created successfully" 
    });
  } catch (error: any) {
    return c.json({ 
      success: false, 
      error: error.message 
    }, 500);
  }
});

// 获取所有博客文章
app.get("/api/blogs", async (c) => {
  try {
    const { results } = await c.env.DB.prepare(`
      SELECT * FROM blogs ORDER BY created_at DESC
    `).all();
    
    return c.json({
      success: true,
      data: results
    });
  } catch (error: any) {
    return c.json({ 
      success: false, 
      error: error.message 
    }, 500);
  }
});

// 获取单个博客文章及其评论
app.get("/api/blogs/:id", async (c) => {
  const id = c.req.param("id");
  
  try {
    // 获取博客文章
    const blog = await c.env.DB.prepare(`
      SELECT * FROM blogs WHERE id = ?
    `).bind(id).first();
    
    if (!blog) {
      return c.json({ 
        success: false, 
        error: "Blog not found" 
      }, 404);
    }
    
    // 获取评论
    const { results: comments } = await c.env.DB.prepare(`
      SELECT * FROM comments WHERE blog_id = ? ORDER BY created_at ASC
    `).bind(id).all();
    
    return c.json({
      success: true,
      data: {
        ...blog,
        comments
      }
    });
  } catch (error: any) {
    return c.json({ 
      success: false, 
      error: error.message 
    }, 500);
  }
});

// 创建新博客文章
app.post("/api/blogs", async (c) => {
  const { title, content, image } = await c.req.json();
  
  if (!title || !content) {
    return c.json({ 
      success: false, 
      error: "Title and content are required" 
    }, 400);
  }
  
  try {
    const result = await c.env.DB.prepare(`
      INSERT INTO blogs (title, content, image) VALUES (?, ?, ?)
    `).bind(title, content, image || null).run();
    
    const newBlog = await c.env.DB.prepare(`
      SELECT * FROM blogs WHERE id = ?
    `).bind(result.meta.last_row_id).first();
    
    return c.json({
      success: true,
      data: newBlog
    }, 201);
  } catch (error: any) {
    return c.json({ 
      success: false, 
      error: error.message 
    }, 500);
  }
});

// 添加评论
app.post("/api/blogs/:id/comments", async (c) => {
  const blogId = c.req.param("id");
  const { author, content } = await c.req.json();
  
  if (!author || !content) {
    return c.json({ 
      success: false, 
      error: "Author and content are required" 
    }, 400);
  }
  
  try {
    // 检查博客是否存在
    const blog = await c.env.DB.prepare(`
      SELECT id FROM blogs WHERE id = ?
    `).bind(blogId).first();
    
    if (!blog) {
      return c.json({ 
        success: false, 
        error: "Blog not found" 
      }, 404);
    }
    
    // 插入评论
    const result = await c.env.DB.prepare(`
      INSERT INTO comments (blog_id, author, content) VALUES (?, ?, ?)
    `).bind(blogId, author, content).run();
    
    const newComment = await c.env.DB.prepare(`
      SELECT * FROM comments WHERE id = ?
    `).bind(result.meta.last_row_id).first();
    
    return c.json({
      success: true,
      data: newComment
    }, 201);
  } catch (error: any) {
    return c.json({ 
      success: false, 
      error: error.message 
    }, 500);
  }
});

export default app;