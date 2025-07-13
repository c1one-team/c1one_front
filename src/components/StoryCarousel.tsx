
import React from 'react';

const stories = [
  { id: 1, username: 'uk_dubi', image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=100&h=100&fit=crop&crop=face' },
  { id: 2, username: '_may.e', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&h=100&fit=crop&crop=face' },
  { id: 3, username: 'fight_miz', image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=100&h=100&fit=crop&crop=face' },
  { id: 4, username: 'nar106', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&h=100&fit=crop&crop=face' },
  { id: 5, username: 'xx0000xx', image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=100&h=100&fit=crop&crop=face' },
  { id: 6, username: 'heeeeeeee', image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=100&h=100&fit=crop&crop=face' },
  { id: 7, username: 'healthy____', image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=100&h=100&fit=crop&crop=face' },
  { id: 8, username: 'yoursha', image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=100&h=100&fit=crop&crop=face' },
];

// 하드코딩된 스토리 데이터 사용 알림
console.log('🧪 HARDCODED: stories 변수에 하드코딩된 스토리 데이터 설정:', stories);

export const StoryCarousel = () => {
  return (
    <div className="bg-instagram-dark border border-instagram-border rounded-lg p-4">
      <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
        {stories.map((story) => (
          <div key={story.id} className="flex flex-col items-center space-y-1 cursor-pointer group">
            <div className="w-16 h-16 p-0.5 story-ring rounded-full">
              <div className="w-full h-full bg-instagram-dark rounded-full p-0.5">
                <img
                  src={story.image}
                  alt={story.username}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
            <span className="text-xs text-instagram-muted group-hover:text-instagram-text transition-colors">
              {story.username.length > 8 ? `${story.username.slice(0, 8)}...` : story.username}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
