import React from 'react';

const EditorJsRenderer = ({ data }) => {
    if (!data || !data.blocks) {
        return <p className="text-gray-500">Nội dung không khả dụng.</p>;
    }

    const renderBlock = (block) => {
        switch (block.type) {
            case 'header':
                const HeaderTag = `h${block.data.level}`;
                const headerClasses = {
                    1: 'text-4xl font-bold mb-4 text-gray-900',
                    2: 'text-3xl font-bold mb-3 text-gray-800',
                    3: 'text-2xl font-semibold mb-3 text-gray-800',
                    4: 'text-xl font-semibold mb-2 text-gray-700',
                    5: 'text-lg font-semibold mb-2 text-gray-700',
                    6: 'text-base font-semibold mb-2 text-gray-700'
                };
                return React.createElement(
                    HeaderTag,
                    { className: headerClasses[block.data.level] || headerClasses[3] },
                    block.data.text
                );

            case 'paragraph':
                return (
                    <p className="text-gray-700 mb-4 leading-relaxed" 
                       dangerouslySetInnerHTML={{ __html: block.data.text }} />
                );

            case 'list':
                const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul';
                const listClass = block.data.style === 'ordered' 
                    ? 'list-decimal list-inside mb-4 space-y-2 text-gray-700'
                    : 'list-disc list-inside mb-4 space-y-2 text-gray-700';
                return (
                    <ListTag className={listClass}>
                        {block.data.items.map((item, idx) => (
                            <li key={idx} dangerouslySetInnerHTML={{ __html: item }} />
                        ))}
                    </ListTag>
                );

            case 'quote':
                return (
                    <blockquote className="border-l-4 border-[#c9151b] pl-4 italic text-gray-700 mb-4 bg-[#fde9e9] py-3">
                        <p dangerouslySetInnerHTML={{ __html: block.data.text }} />
                        {block.data.caption && (
                            <cite className="block mt-2 text-sm text-gray-600">
                                — {block.data.caption}
                            </cite>
                        )}
                    </blockquote>
                );

            case 'code':
                return (
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
                        <code>{block.data.code}</code>
                    </pre>
                );

            case 'delimiter':
                return <hr className="my-6 border-t-2 border-gray-300" />;

            case 'image':
                return (
                    <figure className="mb-6">
                        <img 
                            src={block.data.file?.url || block.data.url} 
                            alt={block.data.caption || 'Image'} 
                            className="w-full rounded-lg shadow-md"
                        />
                        {block.data.caption && (
                            <figcaption className="text-center text-sm text-gray-600 mt-2">
                                {block.data.caption}
                            </figcaption>
                        )}
                    </figure>
                );

            case 'table':
                return (
                    <div className="overflow-x-auto mb-4">
                        <table className="min-w-full border border-gray-300">
                            <tbody>
                                {block.data.content.map((row, rowIdx) => (
                                    <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                        {row.map((cell, cellIdx) => (
                                            <td 
                                                key={cellIdx} 
                                                className="border border-gray-300 px-4 py-2 text-gray-700"
                                                dangerouslySetInnerHTML={{ __html: cell }}
                                            />
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );

            case 'warning':
                return (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                        <p className="font-semibold text-yellow-800">{block.data.title}</p>
                        <p className="text-yellow-700 mt-1">{block.data.message}</p>
                    </div>
                );

            default:
                return (
                    <div className="bg-gray-100 p-3 rounded mb-4 text-gray-500 text-sm">
                        Unsupported block type: {block.type}
                    </div>
                );
        }
    };

    return (
        <div className="prose prose-lg max-w-none">
            {data.blocks.map((block, index) => (
                <div key={index}>{renderBlock(block)}</div>
            ))}
        </div>
    );
};

export default EditorJsRenderer;
