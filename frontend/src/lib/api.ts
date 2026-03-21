const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface Flashcard {
  id: string;
  rev: string;
  term: string;
  definition: string;
  image_url?: string | null;
}

export interface CreateFlashcardInput {
  term: string;
  definition: string;
  image_url?: string | null;
}

export interface UpdateFlashcardInput {
  term: string;
  definition: string;
  image_url?: string | null;
  rev: string;
}

export async function getFlashcards(): Promise<Flashcard[]> {
  const res = await fetch(`${API_BASE}/api/flashcards`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch flashcards');
  return res.json();
}

export async function getFlashcard(id: string): Promise<Flashcard> {
  const res = await fetch(`${API_BASE}/api/flashcards/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch flashcard');
  return res.json();
}

export async function createFlashcard(data: CreateFlashcardInput): Promise<Flashcard> {
  const res = await fetch(`${API_BASE}/api/flashcards`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create flashcard');
  return res.json();
}

export async function updateFlashcard(id: string, data: UpdateFlashcardInput): Promise<Flashcard> {
  const res = await fetch(`${API_BASE}/api/flashcards/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update flashcard');
  return res.json();
}

export async function deleteFlashcard(id: string, rev: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/flashcards/${id}?rev=${encodeURIComponent(rev)}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete flashcard');
}
