import React from 'react';
import { Link } from 'react-router-dom';

const HorizontalPostCard = ({ post }) => {
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };

    const getPostUrl = () => {
        return `/${post.category}/${post.id}`;
    };

    return (
        <div className="flex flex-col md:flex-row bg-white shadow-md rounded-lg overflow-hidden mb-6 hover:shadow-lg transition-shadow duration-300">
            {/* Image Section */}
            <div className="md:w-1/3 h-48 md:h-auto relative">
                <img 
                    src={post.featured_image || 'https://via.placeholder.com/400x250'} 
                    alt={post.title} 
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded uppercase">
                    {post.category}
                </div>
            </div>

            {/* Content Section */}
            <div className="md:w-2/3 p-6 flex flex-col justify-between">
                <div>
                    <div className="flex items-center text-gray-500 text-sm mb-2">
                        <span className="mr-4">📅 {formatDate(post.post_day)}</span>
                        {post.views !== undefined && <span className="mr-4">👁️ {post.views}</span>}
                        {post.likes !== undefined && <span>❤️ {post.likes}</span>}
                    </div>
                    <Link to={getPostUrl()}>
                        <h3 className="text-xl font-bold text-gray-800 mb-2 hover:text-blue-600 transition-colors">
                            {post.title}
                        </h3>
                    </Link>
                    <p className="text-gray-600 line-clamp-3">
                        {post.excerpt}
                    </p>
                </div>
                
                <div className="mt-4 flex justify-end">
                    <Link 
                        to={getPostUrl()} 
                        className="text-blue-600 font-semibold hover:underline flex items-center"
                    >
                        Đọc thêm <span className="ml-1">→</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HorizontalPostCard;
