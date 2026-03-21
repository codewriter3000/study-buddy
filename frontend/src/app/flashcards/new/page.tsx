import FlashcardForm from '@/components/FlashcardForm';

export default function NewFlashcardPage() {
  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, color: '#e2e4f9', margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          New Flashcard
        </h1>
        <p style={{ color: '#9b9ec8', marginTop: '0.5rem', fontSize: '0.95rem' }}>
          Add a new card to your deck
        </p>
      </div>

      <div style={{ backgroundColor: '#1c1f2c', borderRadius: '20px', padding: '2rem' }}>
        <FlashcardForm mode="create" />
      </div>
    </div>
  );
}
