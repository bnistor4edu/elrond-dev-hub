import React from "react";
import Image from "next/image";
import {
  FiExternalLink,
  FiCalendar,
  FiTrendingUp,
} from "react-icons/fi";

interface NewsItem {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  link_url: string;
  date: string;
  category?: string;
}

const News = () => {
  // Sample news data - in a real app, this would come from an API or database
  const newsItems: NewsItem[] = [
    {
      id: "1",
      title: "AI MegaWave Hackathon 2025",
      description: "Join the AI MegaWave Hackathon and win up to $150,000 in prizes. Feb 12 - Mar 7, 2025.",
      image_url: "/banner/top-banner.png",
      link_url: "https://multiversx.com/ai-megawave",
      date: "2025-01-15",
      category: "Hackathon"
    },
    {
      id: "2",
      title: "MultiversX SDK Updates",
      description: "New features and improvements in the latest SDK release for better developer experience.",
      image_url: "/multiversx/x-mint.png",
      link_url: "https://docs.multiversx.com",
      date: "2025-01-10",
      category: "Development"
    },
    {
      id: "3",
      title: "xDevHub Community Growth",
      description: "The developer community continues to grow with new tools and resources being added regularly.",
      link_url: "https://github.com/multiversx",
      date: "2025-01-05",
      category: "Community"
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="rounded-lg border border-theme-border dark:border-theme-border-dark bg-white dark:bg-secondary-dark shadow-sm">
      {/* Header */}
      <div className="px-4 py-3 border-b border-theme-border dark:border-theme-border-dark flex items-center justify-between">
        <h3 className="text-base font-semibold text-theme-title dark:text-theme-title-dark flex items-center">
          <FiTrendingUp className="w-4 h-4 mr-2 text-blue-500" />
          Latest News
        </h3>
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="space-y-4">
          {newsItems.map((item) => (
            <div key={item.id} className="group">
              <a
                href={item.link_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg p-3 -m-3 transition-colors duration-200"
              >
                <div className="flex items-start space-x-3">
                  {/* Image */}
                  {item.image_url && (
                    <div className="flex-shrink-0">
                      <Image
                        src={item.image_url}
                        alt={item.title}
                        width={64}
                        height={48}
                        className="w-16 h-12 object-cover rounded-md"
                      />
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-theme-title dark:text-theme-title-dark group-hover:text-primary dark:group-hover:text-primary-dark transition-colors duration-200 truncate">
                        {item.title}
                      </h4>
                      <FiExternalLink className="w-3 h-3 text-gray-400 dark:text-gray-500 flex-shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </div>
                    
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                      {item.description}
                    </p>
                    
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-500">
                      <FiCalendar className="w-3 h-3 mr-1" />
                      <span>{formatDate(item.date)}</span>
                      {item.category && (
                        <>
                          <span className="mx-2">•</span>
                          <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                            {item.category}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default News; 