'use client';

import Link from 'next/link';
import { Flashcard } from '@/lib/api';

interface FlashcardCardProps {
  flashcard: Flashcard;
  onDelete: (id: string, rev: string) => void;
}

export default function FlashcardCard({ flashcard, onDelete }: FlashcardCardProps) {
  const stripHtml = (html: string) => {
    // Use a regex-based approach to avoid DOM manipulation during render
    return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  };

  const truncate = (text: string, max: number) =>
    text.length > max ? text.slice(0, max) + '…' : text;

  const getDefinitionPreview = () => {
    const plain = stripHtml(flashcard.definition);
    return truncate(plain, 120);
  };

  return (
    <div
      style={{
        backgroundColor: '#1c1f2c',
        borderRadius: '16px',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(255, 108, 149, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div>
        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9b9ec8', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Term
        </p>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#e2e4f9', margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.4 }}>
          {flashcard.term}
        </h3>
      </div>

      {flashcard.image_url && (
        <img
          src={flashcard.image_url}
          alt={flashcard.term}
          style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px' }}
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      )}

      <p style={{ fontSize: '0.875rem', color: '#9b9ec8', margin: 0, lineHeight: 1.5, flexGrow: 1 }}>
        {getDefinitionPreview()}
      </p>

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
        <Link
          href={`/flashcards/${flashcard.id}/edit`}
          style={{
            flex: 1,
            padding: '0.5rem',
            backgroundColor: '#2a2d3e',
            color: '#9b9ec8',
            borderRadius: '9999px',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '0.85rem',
            textAlign: 'center',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#212534'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#2a2d3e'; }}
        >
          Edit
        </Link>
        <button
          onClick={() => onDelete(flashcard.id, flashcard.rev)}
          style={{
            flex: 1,
            padding: '0.5rem',
            backgroundColor: 'rgba(255, 108, 149, 0.1)',
            color: '#ff6c95',
            border: 'none',
            borderRadius: '9999px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.85rem',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 108, 149, 0.2)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 108, 149, 0.1)'; }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
