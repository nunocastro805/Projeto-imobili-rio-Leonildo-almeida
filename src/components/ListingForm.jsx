import React, { useState } from 'react';
import { FaPlus, FaImage, FaVideo, FaMapMarkerAlt } from 'react-icons/fa';

export default function ListingForm({ onCreate }){
  const [title, setTitle] = useState('');
  const [type, setType] = useState('arrendar');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  function handleSubmit(e){
    e.preventDefault();
    const newListing = {
      id: Date.now(), title, type, price, description, location, images, videos
    };
    onCreate(newListing);
    setTitle(''); setPrice(''); setDescription(''); setLocation(''); setImages([]); setVideos([]); setImagePreviews([]);
  }

  function handleImageFiles(e){
    const files = Array.from(e.target.files);
    const promises = files.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then(urls => {
      setImages(urls);
      setImagePreviews(urls);
    });
  }

  function removeImage(index){
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
  }

  function handleVideoFiles(e){
    const files = Array.from(e.target.files);
    const promises = files.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then(urls => {
      setVideos(urls);
    });
  }

  return (
    <div style={{backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'}}>
      <h3 style={{fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem', display: 'flex', alignItems: 'center'}}>
        <FaPlus style={{marginRight: '0.5rem', color: '#2563eb'}} />
        Novo Imóvel
      </h3>
      <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={e=>setTitle(e.target.value)}
          required
          className="form-input"
        />
        <select
          value={type}
          onChange={e=>setType(e.target.value)}
          className="form-input"
        >
          <option value="arrendar">Arrendar</option>
          <option value="venda">Venda</option>
        </select>
        <input
          type="text"
          placeholder="Preço"
          value={price}
          onChange={e=>setPrice(e.target.value)}
          required
          className="form-input"
        />
        <textarea
          placeholder="Descrição"
          value={description}
          onChange={e=>setDescription(e.target.value)}
          className="form-input"
          style={{height: '6rem', resize: 'none'}}
        />
        <div>
          <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem', display: 'flex', alignItems: 'center'}}>
            <FaMapMarkerAlt style={{marginRight: '0.5rem', color: '#ef4444'}} />
            Localização
          </label>
          <input
            type="text"
            placeholder="Ex: Praia, Santiago - Cabo Verde"
            value={location}
            onChange={e=>setLocation(e.target.value)}
            className="form-input"
          />
        </div>
        <div>
          <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem', display: 'flex', alignItems: 'center'}}>
            <FaImage style={{marginRight: '0.5rem'}} />
            Fotos (jpg/png) - {imagePreviews.length} selecionadas
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageFiles}
            style={{width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem'}}
          />

          {imagePreviews.length > 0 && (
            <div style={{marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.5rem'}}>
              {imagePreviews.map((preview, index) => (
                <div key={index} style={{position: 'relative'}}>
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    style={{width: '100%', height: '80px', objectFit: 'cover', borderRadius: '0.375rem'}}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    style={{
                      position: 'absolute',
                      top: '-0.5rem',
                      right: '-0.5rem',
                      backgroundColor: '#dc2626',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '1.5rem',
                      height: '1.5rem',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem', display: 'flex', alignItems: 'center'}}>
            <FaVideo style={{marginRight: '0.5rem'}} />
            Vídeos (mp4)
          </label>
          <input
            type="file"
            accept="video/*"
            multiple
            onChange={handleVideoFiles}
            style={{width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem'}}
          />
        </div>
        <button type="submit" className="btn w-full">
          Criar Imóvel
        </button>
      </form>
    </div>
  );
}
