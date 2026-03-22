'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RichTextEditor from './RichTextEditor';
import { createFlashcard, updateFlashcard } from '@/lib/api';

interface FlashcardFormProps {
  mode: 'create' | 'edit';
  initialData?: {
    id?: string;
    rev?: string;
    term?: string;
    definition?: string;
    image_url?: string | null;
  };
}

export default function FlashcardForm({ mode, initialData }: FlashcardFormProps) {
  const router = useRouter();
  const [term, setTerm] = useState(initialData?.term || '');
  const [definition, setDefinition] = useState(initialData?.definition || '');
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!term.trim()) {
      setError('Term is required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      if (mode === 'create') {
        await createFlashcard({
          term: term.trim(),
          definition,
          image_url: imageUrl.trim() || null,
        });
      } else if (mode === 'edit' && initialData?.id && initialData?.rev) {
        await updateFlashcard(initialData.id, {
          term: term.trim(),
          definition,
          image_url: imageUrl.trim() || null,
          rev: initialData.rev,
        });
      }
      router.push('/');
      router.refresh();
    } catch {
      setError('Failed to save flashcard. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem 1rem',
    backgroundColor: '#212534',
    border: '2px solid transparent',
    borderRadius: '12px',
    color: '#e2e4f9',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    fontFamily: 'Manrope, sans-serif',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: 600,
    color: '#9b9ec8',
    fontSize: '0.875rem',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {error && (
        <div style={{ backgroundColor: 'rgba(255, 108, 149, 0.1)', border: '1px solid rgba(255, 108, 149, 0.3)', borderRadius: '12px', padding: '0.75rem 1rem', color: '#ff6c95' }}>
          {error}
        </div>
      )}

      <div>
        <label style={labelStyle}>Term</label>
        <input
          type="text"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Enter the term or question"
          style={inputStyle}
          onFocus={(e) => { e.target.style.borderColor = '#ff6c95'; e.target.style.boxShadow = '0 0 0 3px rgba(255, 108, 149, 0.15)'; }}
          onBlur={(e) => { e.target.style.borderColor = 'transparent'; e.target.style.boxShadow = 'none'; }}
          required
        />
      </div>

      <div>
        <label style={labelStyle}>Definition</label>
        <RichTextEditor
          content={definition}
          onChange={setDefinition}
          placeholder="Enter the definition or answer..."
        />
      </div>

      <div>
        <label style={labelStyle}>Image URL <span style={{ color: '#9b9ec8', fontWeight: 400, textTransform: 'none', letterSpacing: 'normal' }}>(optional)</span></label>
        <input
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://example.com/image.png"
          style={inputStyle}
          onFocus={(e) => { e.target.style.borderColor = '#ff6c95'; e.target.style.boxShadow = '0 0 0 3px rgba(255, 108, 149, 0.15)'; }}
          onBlur={(e) => { e.target.style.borderColor = 'transparent'; e.target.style.boxShadow = 'none'; }}
        />
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
        <button
          type="button"
          onClick={() => router.back()}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#2a2d3e',
            color: '#9b9ec8',
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
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '0.75rem 2rem',
            background: loading ? '#2a2d3e' : 'linear-gradient(135deg, #ff6c95, #fd3e80)',
            color: loading ? '#9b9ec8' : '#ffffff',
            border: 'none',
            borderRadius: '9999px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 700,
            fontSize: '0.95rem',
            transition: 'opacity 0.2s',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Saving...' : mode === 'create' ? 'Create Flashcard' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
