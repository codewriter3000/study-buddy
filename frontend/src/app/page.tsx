'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import FlashcardCard from '@/components/FlashcardCard';
import { getFlashcards, deleteFlashcard, Flashcard } from '@/lib/api';

export default function Home() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchFlashcards = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getFlashcards();
      setFlashcards(data);
    } catch {
      setError('Failed to load flashcards. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFlashcards();
  }, [fetchFlashcards]);

  const handleDelete = async (id: string, rev: string) => {
    if (!confirm('Delete this flashcard?')) return;
    try {
      await deleteFlashcard(id, rev);
      setFlashcards((prev) => prev.filter((f) => f.id !== id));
    } catch {
      alert('Failed to delete flashcard.');
    }
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 1.5rem', minHeight: 'calc(100vh - 64px)', position: 'relative' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: '#e2e4f9', margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Your Flashcards
        </h1>
        <p style={{ color: '#9b9ec8', marginTop: '0.5rem', fontSize: '1rem' }}>
          {loading ? 'Loading...' : `${flashcards.length} card${flashcards.length !== 1 ? 's' : ''} in your deck`}
        </p>
      </div>

      {error && (
        <div style={{ backgroundColor: 'rgba(255, 108, 149, 0.1)', border: '1px solid rgba(255, 108, 149, 0.3)', borderRadius: '12px', padding: '1rem 1.25rem', color: '#ff6c95', marginBottom: '2rem' }}>
          {error}
        </div>
      )}

      {!loading && flashcards.length === 0 && !error && (
        <div style={{ textAlign: 'center', paddingTop: '5rem', paddingBottom: '5rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📚</div>
          <h2 style={{ color: '#9b9ec8', fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: '0.5rem' }}>No flashcards yet</h2>
          <p style={{ color: '#9b9ec8', fontSize: '0.95rem' }}>Create your first flashcard to get started!</p>
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {flashcards.map((card) => (
          <FlashcardCard key={card.id} flashcard={card} onDelete={handleDelete} />
        ))}
      </div>

      {/* FAB */}
      <Link href="/flashcards/new">
        <button
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            width: '56px',
            height: '56px',
            borderRadius: '9999px',
            background: 'linear-gradient(135deg, #ff6c95, #fd3e80)',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.75rem',
            color: '#ffffff',
            boxShadow: '0 8px 32px rgba(255, 108, 149, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.2s, box-shadow 0.2s',
            zIndex: 40,
          }}
          title="New Flashcard"
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(255, 108, 149, 0.5)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(255, 108, 149, 0.4)'; }}
        >
          +
        </button>
      </Link>
    </div>
  );
}
