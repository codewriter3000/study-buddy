import os
from contextlib import asynccontextmanager
from typing import Optional
import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

COUCHDB_URL = os.getenv("COUCHDB_URL", "http://admin:password@localhost:5984")
DB_NAME = "flashcards"


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with httpx.AsyncClient() as client:
        response = await client.put(f"{COUCHDB_URL}/{DB_NAME}")
        if response.status_code not in (201, 412):
            raise RuntimeError(f"Failed to create database: {response.text}")
    yield


app = FastAPI(title="Study Buddy API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Flashcard(BaseModel):
    term: str
    definition: str
    image_url: Optional[str] = None


class FlashcardResponse(BaseModel):
    id: str
    rev: str
    term: str
    definition: str
    image_url: Optional[str] = None


class FlashcardUpdate(BaseModel):
    term: str
    definition: str
    image_url: Optional[str] = None
    rev: str


@app.get("/api/health")
async def health():
    return {"status": "ok"}


@app.get("/api/flashcards", response_model=list[FlashcardResponse])
async def list_flashcards():
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{COUCHDB_URL}/{DB_NAME}/_all_docs",
            params={"include_docs": "true"},
        )
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Failed to fetch flashcards")
        data = response.json()
        flashcards = []
        for row in data.get("rows", []):
            doc = row.get("doc", {})
            if doc.get("_id", "").startswith("_"):
                continue
            flashcards.append(
                FlashcardResponse(
                    id=doc["_id"],
                    rev=doc["_rev"],
                    term=doc.get("term", ""),
                    definition=doc.get("definition", ""),
                    image_url=doc.get("image_url"),
                )
            )
        return flashcards


@app.post("/api/flashcards", response_model=FlashcardResponse, status_code=201)
async def create_flashcard(flashcard: Flashcard):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{COUCHDB_URL}/{DB_NAME}",
            json=flashcard.model_dump(),
        )
        if response.status_code != 201:
            raise HTTPException(status_code=500, detail="Failed to create flashcard")
        data = response.json()
        return FlashcardResponse(
            id=data["id"],
            rev=data["rev"],
            term=flashcard.term,
            definition=flashcard.definition,
            image_url=flashcard.image_url,
        )


@app.get("/api/flashcards/{doc_id}", response_model=FlashcardResponse)
async def get_flashcard(doc_id: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{COUCHDB_URL}/{DB_NAME}/{doc_id}")
        if response.status_code == 404:
            raise HTTPException(status_code=404, detail="Flashcard not found")
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Failed to fetch flashcard")
        doc = response.json()
        return FlashcardResponse(
            id=doc["_id"],
            rev=doc["_rev"],
            term=doc.get("term", ""),
            definition=doc.get("definition", ""),
            image_url=doc.get("image_url"),
        )


@app.put("/api/flashcards/{doc_id}", response_model=FlashcardResponse)
async def update_flashcard(doc_id: str, flashcard: FlashcardUpdate):
    async with httpx.AsyncClient() as client:
        payload = {
            "_rev": flashcard.rev,
            "term": flashcard.term,
            "definition": flashcard.definition,
            "image_url": flashcard.image_url,
        }
        response = await client.put(
            f"{COUCHDB_URL}/{DB_NAME}/{doc_id}",
            json=payload,
        )
        if response.status_code == 404:
            raise HTTPException(status_code=404, detail="Flashcard not found")
        if response.status_code == 409:
            raise HTTPException(status_code=409, detail="Revision conflict")
        if response.status_code != 201:
            raise HTTPException(status_code=500, detail="Failed to update flashcard")
        data = response.json()
        return FlashcardResponse(
            id=data["id"],
            rev=data["rev"],
            term=flashcard.term,
            definition=flashcard.definition,
            image_url=flashcard.image_url,
        )


@app.delete("/api/flashcards/{doc_id}", status_code=204)
async def delete_flashcard(doc_id: str, rev: str):
    async with httpx.AsyncClient() as client:
        response = await client.delete(
            f"{COUCHDB_URL}/{DB_NAME}/{doc_id}",
            params={"rev": rev},
        )
        if response.status_code == 404:
            raise HTTPException(status_code=404, detail="Flashcard not found")
        if response.status_code == 409:
            raise HTTPException(status_code=409, detail="Revision conflict")
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Failed to delete flashcard")
