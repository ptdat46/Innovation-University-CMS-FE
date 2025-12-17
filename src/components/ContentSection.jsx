import { Link } from 'react-router-dom';

export default function ContentSection({ title, subtitle, linkPath = '#', posts = [], bgColor = 'bg-white', fallbackImage }) {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <section className={`${bgColor} py-14`}>
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold text-[#c9151b] uppercase">{subtitle}</p>
          <h3 className="text-3xl font-bold">{title}</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {posts.slice(0, 3).map((post) => (
            <Link
              to={`/${post.category}/post/${post.id}`}
              key={post.id}
              className="bg-white hover:shadow-xl transition overflow-hidden"
            >
              <div className="h-56 overflow-hidden">
                <img
                  src={post.featured_image || fallbackImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="py-4 space-y-2">
                <p className="text-sm text-[#6b7280]">
                  📅 {formatDate(post.post_day || post.created_at)}
                </p>
                <h4 className="text-lg font-semibold leading-snug line-clamp-2">{post.title}</h4>
              </div>
            </Link>
          ))}
          {posts.length === 0 && (
            <p className="text-[#4b5563] col-span-3">Chưa có bài viết.</p>
          )}
        </div>
      </div>
    </section>
  );
}
