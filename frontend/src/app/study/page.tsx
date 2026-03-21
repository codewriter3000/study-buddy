'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StudyCard from '@/components/StudyCard';
import { getFlashcards, Flashcard } from '@/lib/api';

export default function StudyPage() {
  const router = useRouter();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFlashcards();
        setFlashcards(data);
      } catch {
        setError('Failed to load flashcards.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#9b9ec8', fontSize: '1.1rem' }}>Loading flashcards...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
        <div style={{ backgroundColor: 'rgba(255, 108, 149, 0.1)', border: '1px solid rgba(255, 108, 149, 0.3)', borderRadius: '12px', padding: '1rem 1.25rem', color: '#ff6c95', maxWidth: '400px', textAlign: 'center' }}>
          {error}
        </div>
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', padding: '1.5rem' }}>
        <div style={{ fontSize: '4rem' }}>📭</div>
        <h2 style={{ color: '#e2e4f9', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, margin: 0 }}>No cards to study</h2>
        <p style={{ color: '#9b9ec8', margin: 0 }}>Create some flashcards first!</p>
        <button
          onClick={() => router.push('/')}
          style={{ padding: '0.75rem 2rem', background: 'linear-gradient(135deg, #ff6c95, #fd3e80)', color: '#fff', border: 'none', borderRadius: '9999px', cursor: 'pointer', fontWeight: 700, fontSize: '0.95rem' }}
        >
          Go to Home
        </button>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];
  const isLast = currentIndex === flashcards.length - 1;

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem', gap: '2.5rem' }}>
      {/* Progress */}
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#4ecdc4', fontWeight: 700, fontSize: '1rem', fontFamily: "'Plus Jakarta Sans', sans-serif", margin: 0 }}>
          Card {currentIndex + 1} of {flashcards.length}
        </p>
        <div style={{ width: '200px', height: '4px', backgroundColor: '#1c1f2c', borderRadius: '9999px', marginTop: '0.75rem', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              borderRadius: '9999px',
              background: 'linear-gradient(90deg, #4ecdc4, #2a4a47)',
              width: `${((currentIndex + 1) / flashcards.length) * 100}%`,
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </div>

      {/* Card */}
      <StudyCard flashcard={currentCard} />

      {/* Navigation */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          disabled={currentIndex === 0}
          style={{
            padding: '0.75rem 1.75rem',
            backgroundColor: currentIndex === 0 ? '#161923' : '#2a2d3e',
            color: currentIndex === 0 ? '#9b9ec8' : '#e2e4f9',
            border: 'none',
            borderRadius: '9999px',
            cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
            fontWeight: 600,
            fontSize: '0.95rem',
            opacity: currentIndex === 0 ? 0.5 : 1,
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => { if (currentIndex > 0) e.currentTarget.style.backgroundColor = '#212534'; }}
          onMouseLeave={(e) => { if (currentIndex > 0) e.currentTarget.style.backgroundColor = '#2a2d3e'; }}
        >
          ← Previous
        </button>

        {isLast ? (
          <button
            onClick={() => router.push('/')}
            style={{
              padding: '0.75rem 2rem',
              background: 'linear-gradient(135deg, #ff6c95, #fd3e80)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '9999px',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.95rem',
              boxShadow: '0 4px 16px rgba(255, 108, 149, 0.3)',
            }}
          >
            Done 🎉
          </button>
        ) : (
          <button
            onClick={() => setCurrentIndex((i) => Math.min(flashcards.length - 1, i + 1))}
            style={{
              padding: '0.75rem 1.75rem',
              backgroundColor: '#2a2d3e',
              color: '#e2e4f9',
              border: 'none',
              borderRadius: '9999px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.95rem',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#212534'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#2a2d3e'; }}
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
}
