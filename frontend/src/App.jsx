import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function App() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch(`${API_URL}/posts`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return;

    try {
      const res = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      });

      if (res.ok) {
        const newPost = await res.json();
        setPosts([newPost, ...posts]);
        setTitle('');
        setContent('');
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      const res = await fetch(`${API_URL}/posts/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setPosts(posts.filter((post) => post.id !== id));
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col text-gray-900 font-sans">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-600 tracking-tight">AWS Blog App</h1>
        </div>
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-10 space-y-12">
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-6">Create a New Post</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                placeholder="My awesome post..."
                required
              />
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="5"
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow resize-y"
                placeholder="Write your content here..."
                required
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition-colors"
            >
              Publish Post
            </button>
          </form>
        </section>

        <section>
          <h2 className="text-3xl font-extrabold mb-8 tracking-tight">Latest Posts</h2>
          {loading ? (
            <p className="text-gray-500 text-center py-10">Loading posts...</p>
          ) : posts.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-10 text-center shadow-sm">
              <p className="text-gray-500">No posts found. Create your first post above!</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {posts.map((post) => (
                <article key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 flex flex-col relative overflow-hidden group">
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-red-500 hover:text-red-700 p-2 rounded-md hover:bg-red-50 transition-colors"
                      title="Delete post"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 pr-10">{post.title}</h3>
                  <div className="text-sm text-gray-500 mb-4">
                    {new Date(post.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{post.content}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} AWS Blog App. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;
