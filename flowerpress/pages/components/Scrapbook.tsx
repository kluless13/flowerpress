import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Flower {
  id: number;
  image: string;
  name: string;
  description: string;
  uploadTime: Date;
}

const Scrapbook: React.FC = () => {
  const [flowers, setFlowers] = useState<Flower[]>([]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    const response = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {
      headers: {
        'X-Api-Key': process.env.NEXT_PUBLIC_REMOVE_BG_API_KEY || '',
        'Content-Type': 'multipart/form-data'
      }
    });

    const newFlower: Flower = {
      id: Date.now(),
      image: response.data.data.result_b64,
      name: '',
      description: '',
      uploadTime: new Date(),
    };

    setFlowers([...flowers, newFlower]);
  };

  const getPressingStyles = (uploadTime: Date) => {
    const now = new Date();
    const timeDiff = (now.getTime() - new Date(uploadTime).getTime()) / (1000 * 60 * 60 * 24);

    const flattening = Math.min(1, timeDiff / 7);
    const saturation = 1 - Math.min(0.35, 0.35 * timeDiff / 7);
    const opacity = 1 - Math.min(0.2, 0.2 * timeDiff / 7);

    return {
      transform: `scaleY(${1 - 0.2 * flattening})`,
      filter: `saturate(${saturation})`,
      opacity: opacity,
    };
  };

  return (
    <div>
      <h1>Your Scrapbook</h1>
      <input type="file" onChange={handleImageUpload} />
      <div>
        {flowers.map((flower) => (
          <div key={flower.id} style={getPressingStyles(flower.uploadTime)}>
            <img src={`data:image/png;base64,${flower.image}`} alt="flower" />
            <input
              type="text"
              placeholder="Name"
              value={flower.name}
              onChange={(e) => {
                const updatedFlowers = flowers.map(f =>
                  f.id === flower.id ? { ...f, name: e.target.value } : f
                );
                setFlowers(updatedFlowers);
              }}
            />
            <textarea
              placeholder="Description"
              value={flower.description}
              onChange={(e) => {
                const updatedFlowers = flowers.map(f =>
                  f.id === flower.id ? { ...f, description: e.target.value } : f
                );
                setFlowers(updatedFlowers);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Scrapbook;