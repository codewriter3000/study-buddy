'use client';

import { useState } from 'react';
import { Flashcard } from '@/lib/api';

interface StudyCardProps {
  flashcard: Flashcard;
}

export default function StudyCard({ flashcard }: StudyCardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      onClick={() => setFlipped(!flipped)}
      style={{
        width: '100%',
        maxWidth: '640px',
        height: '360px',
        perspective: '1200px',
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front - Term */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            backgroundColor: '#1c1f2c',
            borderRadius: '24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2.5rem',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
          }}
        >
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#ff6c95', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Term
          </p>
          <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 800, color: '#e2e4f9', textAlign: 'center', margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.3 }}>
            {flashcard.term}
          </h2>
          <p style={{ marginTop: '2rem', fontSize: '0.85rem', color: '#9b9ec8' }}>
            Click to reveal definition
          </p>
        </div>

        {/* Back - Definition */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            backgroundColor: '#161923',
            borderRadius: '24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2.5rem',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
            overflowY: 'auto',
          }}
        >
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#4ecdc4', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Definition
          </p>
          <div
            style={{ color: '#e2e4f9', fontSize: '1rem', lineHeight: 1.7, textAlign: 'center', maxWidth: '100%', fontFamily: 'Manrope, sans-serif' }}
            dangerouslySetInnerHTML={{ __html: flashcard.definition }}
          />
          {flashcard.image_url && (
            <img
              src={flashcard.image_url}
              alt={flashcard.term}
              style={{ marginTop: '1.5rem', maxWidth: '100%', maxHeight: '120px', objectFit: 'contain', borderRadius: '8px' }}
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
