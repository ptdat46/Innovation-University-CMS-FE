export default function ContentSection({ title, icon, linkPath = '#', posts = [] }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="py-8">
      <div className="max-w-[1200px] mx-auto px-5">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-10">
          {icon && <span className="text-4xl">{icon}</span>}
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
        </div>

        {/* Divider Line */}
        <div className="h-1 w-24 bg-blue-800 mb-10"></div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-2">
          {posts.slice(0, 4).map((post) => (
            <div key={post.id} className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              {/* Image */}
              <div className="w-full h-48 overflow-hidden">
                {post.featured_image ? (
                  <img 
                    src={post.featured_image} 
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div 
                    className="w-full h-full"
                    style={{ background: `linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)` }}
                  ></div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{formatDate(post.created_at)}</span>
                  <span className="text-gray-400">{post.views} lượt xem</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More Link */}
        <div className="flex justify-end">
          <a 
            href={linkPath}
            className="text-blue-700 hover:text-blue-800 font-semibold text-lg transition-colors"
          >
            Xem thêm
          </a>
        </div>
      </div>
    </div>
  );
}
