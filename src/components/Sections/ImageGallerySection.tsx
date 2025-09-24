import React, { useState, useEffect } from 'react';

interface ImageGalleryProps {
  data?: {
    images?: Array<{
      src: string;
      alt: string;
    }>;
  };
}

const ImageGallerySection: React.FC<ImageGalleryProps> = ({ data }) => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  const defaultImages = [
    { src: '/assets/main/images/360.png', alt: 'Gallery image 1' },
    { src: '/assets/main/images/mirror.jpg', alt: 'Gallery image 2' },
    { src: '/assets/main/images/heavysmoke.jpg', alt: 'Gallery image 3' },
    { src: '/assets/main/images/fountain.jpg', alt: 'Gallery image 4' },
    { src: '/assets/main/images/neons.jpg', alt: 'Gallery image 5' },
  ];

  const images = data?.images || defaultImages;
  const totalImages = images.length;

  const nextImage = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % totalImages);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const prevImage = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + totalImages) % totalImages);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const getImageIndex = (position: 'left' | 'center' | 'right') => {
    switch (position) {
      case 'left':
        return (currentIndex - 1 + totalImages) % totalImages;
      case 'center':
        return currentIndex;
      case 'right':
        return (currentIndex + 1) % totalImages;
      default:
        return currentIndex;
    }
  };

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        nextImage();
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [isAnimating]);

  return (
    <section
      className="image-gallery-section py-5"
      style={{ background: 'rgba(139, 75, 122, 0.1)' }}
    >
      <div className="container">
        <div className="text-center mb-5">
          <h3 style={{ color: '#2c2c2c' }}>
            Nasza <span style={{ color: '#801039' }}>galeria</span>
          </h3>
        </div>

        <div className="image-carousel-container">
          <button
            className="carousel-arrow carousel-arrow-left"
            aria-label="Poprzedni slajd"
            onClick={prevImage}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className="image-carousel">
            <div className="image-slide image-slide-left">
              <img
                src={images[getImageIndex('left')]?.src}
                alt={images[getImageIndex('left')]?.alt}
                loading="lazy"
                className="gallery-lazy"
              />
            </div>
            <div className="image-slide image-slide-center active">
              <img
                src={images[getImageIndex('center')]?.src}
                alt={images[getImageIndex('center')]?.alt}
                loading="lazy"
                className="gallery-lazy"
              />
            </div>
            <div className="image-slide image-slide-right">
              <img
                src={images[getImageIndex('right')]?.src}
                alt={images[getImageIndex('right')]?.alt}
                loading="lazy"
                className="gallery-lazy"
              />
            </div>
          </div>

          <button
            className="carousel-arrow carousel-arrow-right"
            aria-label="Następny slajd"
            onClick={nextImage}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ImageGallerySection;