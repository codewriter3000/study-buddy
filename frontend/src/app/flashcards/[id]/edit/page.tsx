'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import FlashcardForm from '@/components/FlashcardForm';
import { getFlashcard, Flashcard } from '@/lib/api';

export default function EditFlashcardPage() {
  const params = useParams();
  const id = params.id as string;
  const [flashcard, setFlashcard] = useState<Flashcard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFlashcard(id);
        setFlashcard(data);
      } catch {
        setError('Failed to load flashcard.');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  if (loading) {
    return (
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        <div style={{ textAlign: 'center', paddingTop: '4rem', color: '#9b9ec8' }}>
          Loading...
        </div>
      </div>
    );
  }

  if (error || !flashcard) {
    return (
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        <div style={{ backgroundColor: 'rgba(255, 108, 149, 0.1)', border: '1px solid rgba(255, 108, 149, 0.3)', borderRadius: '12px', padding: '1rem 1.25rem', color: '#ff6c95' }}>
          {error || 'Flashcard not found.'}
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, color: '#e2e4f9', margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Edit Flashcard
        </h1>
        <p style={{ color: '#9b9ec8', marginTop: '0.5rem', fontSize: '0.95rem' }}>
          Update your flashcard
        </p>
      </div>

      <div style={{ backgroundColor: '#1c1f2c', borderRadius: '20px', padding: '2rem' }}>
        <FlashcardForm
          mode="edit"
          initialData={{
            id: flashcard.id,
            rev: flashcard.rev,
            term: flashcard.term,
            definition: flashcard.definition,
            image_url: flashcard.image_url,
          }}
        />
      </div>
    </div>
  );
}
