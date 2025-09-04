"use client";

import { useState, useEffect, useRef } from "react";
import { X, ExternalLink } from "lucide-react";

interface TimelineItem {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string;
  highlights: string[];
  images?: string[];
  link?: string;
  side: 'left' | 'right';
}

interface TimelinePopupProps {
  item: TimelineItem | null;
  isOpen: boolean;
  onClose: () => void;
}

interface ImageModalProps {
  imageSrc: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const ImageModal = ({ imageSrc, isOpen, onClose }: ImageModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!imageSrc || !isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative max-w-4xl max-h-full">
        <img 
          src={imageSrc} 
          alt="Expanded view"
          className="max-w-full max-h-full object-contain rounded-lg"
          onClick={(e) => e.stopPropagation()}
        />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
        >
          <X className="h-8 w-8" />
        </button>
      </div>
    </div>
  );
};

const TimelinePopup = ({ item, isOpen, onClose }: TimelinePopupProps) => {
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (expandedImage) {
          setExpandedImage(null);
        } else {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setExpandedImage(null);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, expandedImage]);

  const handleBackdropClick = () => {
    setExpandedImage(null);
    onClose();
  };

  if (!item || !isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
        onClick={handleBackdropClick}
      >
        <div 
          className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{item.title}</h3>
                <p className="text-lg text-gray-600">{item.company}</p>
                <p className="text-sm text-gray-500">{item.period}</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {item.images && item.images.length > 0 && (
              <div className="mb-6">
                <img
                  src={item.images[0]}
                  alt={`${item.company}`}
                  className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setExpandedImage(item.images![0])}
                />
                <p className="text-xs text-gray-500 mt-2 text-center">Click image to expand</p>
              </div>
            )}

            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">{item.description}</p>
              
              {item.highlights && item.highlights.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Key Highlights:</h4>
                  <ul className="space-y-2">
                    {item.highlights.map((highlight, index) => (
                      <li key={index} className="text-gray-700 flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {item.link && (
                <div className="pt-4 border-t border-gray-200">
                  <a 
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Learn more
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ImageModal
        imageSrc={expandedImage}
        isOpen={!!expandedImage}
        onClose={() => setExpandedImage(null)}
      />
    </>
  );
};

const timelineData: TimelineItem[] = [
  {
    id: '2025',
    title: 'VP of Engineering',
    company: 'Elastio',
    period: '2025 - Present',
    description: 'Leading engineering teams in building next-generation data protection and recovery solutions for cloud-native applications.',
    highlights: [
      'Architecting scalable cloud infrastructure solutions',
      'Building resilient data protection systems',
      'Leading cross-functional engineering teams'
    ],
    link: 'https://elastio.com',
    side: 'right'
  },
  {
    id: '2024',
    title: 'Sr. Software Engineering Manager',
    company: 'Veeva',
    period: '2024 - 2025',
    description: 'Developed enterprise software solutions for life sciences industry, focusing on cloud-native applications and data management.',
    highlights: [
      'Built cloud-native enterprise solutions',
      'Implemented scalable data management systems',
      'Optimized performance for life sciences applications'
    ],
    link: 'https://veeva.com',
    side: 'left'
  },
  {
    id: '2017',
    title: 'Sr. Software Engineering Manager',
    company: 'Turbonomic, an IBM Company',
    period: '2017 - 2024',
    description: 'Worked on AI-powered application resource management platform, focusing on cloud optimization and distributed systems.',
    highlights: [
      'Developed AI-powered resource management solutions',
      'Worked on distributed systems and microservices',
      'Contributed to cloud infrastructure optimization',
      'Led performance optimization initiatives'
    ],
    images: ['/04.png'],
    link: 'https://www.ibm.com/products/turbonomic',
    side: 'right'
  },
  {
    id: '2016',
    title: 'Software Engineer',
    company: 'Trend Micro',
    period: '2016 - 2017',
    description: 'Developed cybersecurity solutions and cloud security products, focusing on threat detection and prevention systems.',
    highlights: [
      'Implemented cloud security solutions',
      'Developed threat detection algorithms',
      'Contributed to cybersecurity research initiatives'
    ],
    images: ['/03.png'],
    link: 'https://trendmicro.com',
    side: 'left'
  },
  {
    id: '2012',
    title: 'CTO & Co-Founder',
    company: 'Nearest',
    period: '2012 - 2014',
    description: 'Developed location-based mobile applications and services, working on geolocation algorithms and mobile app development.',
    highlights: [
      'Built location-based mobile applications',
      'Implemented geolocation algorithms',
      'Developed mobile app backend services'
    ],
    images: ['/02.png'],
    side: 'right'
  },
  {
    id: '2011',
    title: 'Ph.D. in Computer Engineering',
    company: 'Carleton University',
    period: '2011 - 2019',
    description: 'Conducted research in cloud middleware performance optimization using machine learning techniques. Dissertation focused on improving cloud system efficiency and scalability.',
    highlights: [
      'Researched cloud middleware performance optimization',
      'Applied machine learning to distributed systems',
      'Published papers on cloud computing efficiency',
      'Taught undergraduate computer science courses'
    ],
    images: ['/01.png'],
    link: 'https://carleton.ca',
    side: 'left'
  }
];

export const InteractiveTimeline = () => {
  const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null);
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set());
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const itemId = entry.target.getAttribute('data-timeline-id');
          if (itemId) {
            if (entry.isIntersecting) {
              setVisibleItems(prev => new Set([...prev, itemId]));
            } else {
              setVisibleItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(itemId);
                return newSet;
              });
            }
          }
        });
      },
      {
        threshold: 0.7,
        rootMargin: '-200px 0px -200px 0px'
      }
    );

    const timelineItems = document.querySelectorAll('[data-timeline-id]');
    timelineItems.forEach(item => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={timelineRef} className="relative">
        {/* Timeline Line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 bg-gray-300 h-full"></div>

        <div className="space-y-12">
          {timelineData.map((item) => (
            <div
              key={item.id}
              data-timeline-id={item.id}
              className={`relative flex ${item.side === 'left' ? 'justify-start' : 'justify-end'} items-center transition-all duration-700 ${
                visibleItems.has(item.id) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              {/* Timeline Dot */}
              <div className={`absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full border-4 border-white shadow-lg z-10 transition-all duration-700 ${
                visibleItems.has(item.id) 
                  ? 'bg-green-500 animate-pulse border-green-200' 
                  : 'bg-transparent border-gray-400'
              }`}>
                {visibleItems.has(item.id) && (
                  <div className="absolute -inset-1 rounded-full bg-green-400 animate-ping opacity-40"></div>
                )}
              </div>

              {/* Timeline Item */}
              <div
                className={`w-5/12 ${item.side === 'left' ? 'pr-8 text-right' : 'pl-8'} cursor-pointer group`}
                onClick={() => setSelectedItem(item)}
              >
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 group-hover:border-blue-300">
                  <div className={`${item.side === 'left' ? 'text-right' : 'text-left'}`}>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-lg text-gray-600 font-medium">
                      {item.company}
                    </p>
                    <p className="text-sm text-gray-500 mb-3">
                      {item.period}
                    </p>
                    <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                    <p className="text-blue-600 text-sm mt-2 group-hover:text-blue-800 transition-colors">
                      Click to learn more →
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <TimelinePopup
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </>
  );
};
