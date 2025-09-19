import React, { useState } from 'react';
import { FaMapMarkerAlt, FaEuroSign, FaPlay, FaHeart, FaTimes, FaChevronLeft, FaChevronRight, FaImage } from 'react-icons/fa';
import InterestForm from './InterestForm';

export default function ListingCard({ listing, onInterestSubmit }){
  const [showInterestForm, setShowInterestForm] = useState(false);

  // Media viewer state
  const [showMediaViewer, setShowMediaViewer] = useState(false);
  const [currentMedia, setCurrentMedia] = useState([]);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [mediaType, setMediaType] = useState('image'); // 'image' or 'video'

  // Media viewer functions
  const openImageViewer = (images, startIndex = 0) => {
    setCurrentMedia(images);
    setCurrentMediaIndex(startIndex);
    setMediaType('image');
    setShowMediaViewer(true);
  };

  const openVideoViewer = (videos, startIndex = 0) => {
    setCurrentMedia(videos);
    setCurrentMediaIndex(startIndex);
    setMediaType('video');
    setShowMediaViewer(true);
  };

  const closeMediaViewer = () => {
    setShowMediaViewer(false);
    setCurrentMedia([]);
    setCurrentMediaIndex(0);
  };

  const nextMedia = () => {
    setCurrentMediaIndex((prev) => (prev + 1) % currentMedia.length);
  };

  const prevMedia = () => {
    setCurrentMediaIndex((prev) => (prev - 1 + currentMedia.length) % currentMedia.length);
  };

  return (
    <>
      <div className="card group cursor-pointer">
        <div className="relative overflow-hidden rounded-t-xl">
          {listing.images && listing.images.length > 0 ? (
            <img
              src={listing.images[0]}
              alt="foto"
              className="w-full h-48 object-cover group-hover-scale-110 transition-all cursor-pointer"
              onClick={() => openImageViewer(listing.images, 0)}
              title="Clique para ver imagem ampliada"
            />
          ) : (
            <div className="w-full h-48 rounded-t-xl flex items-center justify-center" style={{background: 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)', color: '#6b7280'}}>
              <FaMapMarkerAlt className="text-2xl mr-2" />
              Sem foto
            </div>
          )}
          <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold shadow-lg" style={{background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', color: 'white'}}>
            {listing.type === 'arrendar' ? 'Para Arrendar' : 'Para Vender'}
          </div>
          <div className="absolute inset-0 group-hover-bg-opacity-20 transition-all"></div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold mb-3 group-hover-text-purple-600 transition-all" style={{color: '#1f2937'}}>{listing.title}</h3>
          {listing.location && (
            <div className="flex items-center mb-2" style={{color: '#ef4444', fontSize: '0.875rem'}}>
              <FaMapMarkerAlt className="mr-1" />
              <span>{listing.location}</span>
            </div>
          )}
          <p className="text-sm mb-4" style={{color: '#4b5563', lineHeight: '1.5rem'}}>{listing.description}</p>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center font-bold text-lg" style={{color: '#16a34a'}}>
              <FaEuroSign className="mr-1" />
              <span>{listing.price}</span>
            </div>
            <div className="flex items-center gap-2">
              {listing.images && listing.images.length > 1 && (
                <div
                  className="flex items-center px-2 py-1 rounded-full cursor-pointer"
                  style={{backgroundColor: '#e0f2fe'}}
                  onClick={() => openImageViewer(listing.images, 0)}
                  title="Clique para ver fotos"
                >
                  <FaImage className="mr-1" style={{color: '#0369a1'}} />
                  <span className="text-sm font-medium" style={{color: '#0369a1'}}>Fotos</span>
                </div>
              )}
              {listing.videos && listing.videos.length > 0 && (
                <div
                  className="flex items-center px-2 py-1 rounded-full cursor-pointer"
                  style={{backgroundColor: '#faf5ff'}}
                  onClick={() => openVideoViewer(listing.videos, 0)}
                  title="Clique para ver vídeo"
                >
                  <FaPlay className="mr-1" style={{color: '#8b5cf6'}} />
                  <span className="text-sm font-medium" style={{color: '#8b5cf6'}}>Vídeo</span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => setShowInterestForm(true)}
            className="btn w-full"
            style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'}}
          >
            <FaHeart />
            Tenho Interesse
          </button>
        </div>
      </div>

      {showInterestForm && (
        <InterestForm
          listing={listing}
          onSubmit={onInterestSubmit}
          onClose={() => setShowInterestForm(false)}
        />
      )}

      {/* Media Viewer Modal */}
      {showMediaViewer && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '2rem'
        }}>
          <div style={{
            position: 'relative',
            maxWidth: '90vw',
            maxHeight: '90vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Close button */}
            <button
              onClick={closeMediaViewer}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                color: 'white',
                fontSize: '2rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                zIndex: 1001
              }}
              title="Fechar"
            >
              <FaTimes />
            </button>

            {/* Navigation buttons */}
            {currentMedia.length > 1 && (
              <>
                <button
                  onClick={prevMedia}
                  style={{
                    position: 'absolute',
                    left: '-60px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'white',
                    fontSize: '2rem',
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1001
                  }}
                  title="Anterior"
                >
                  <FaChevronLeft />
                </button>
                <button
                  onClick={nextMedia}
                  style={{
                    position: 'absolute',
                    right: '-60px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'white',
                    fontSize: '2rem',
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1001
                  }}
                  title="Próximo"
                >
                  <FaChevronRight />
                </button>
              </>
            )}

            {/* Media display */}
            {mediaType === 'image' ? (
              <img
                src={currentMedia[currentMediaIndex]}
                alt={`Imagem ${currentMediaIndex + 1}`}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  borderRadius: '0.5rem'
                }}
              />
            ) : (
              <video
                src={currentMedia[currentMediaIndex]}
                controls
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  borderRadius: '0.5rem'
                }}
                autoPlay
              />
            )}

            {/* Media counter */}
            {currentMedia.length > 1 && (
              <div style={{
                position: 'absolute',
                bottom: '-40px',
                left: '50%',
                transform: 'translateX(-50%)',
                color: 'white',
                fontSize: '0.875rem',
                background: 'rgba(0, 0, 0, 0.7)',
                padding: '0.5rem 1rem',
                borderRadius: '1rem'
              }}>
                {currentMediaIndex + 1} de {currentMedia.length}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
