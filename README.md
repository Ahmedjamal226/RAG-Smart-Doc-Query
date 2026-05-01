# RAG-Smart-Doc-Query
An advanced Retrieval-Augmented Generation (RAG) system using Gemini 3 Flash, LangChain, and Pinecone to chat with PDF documents through semantic vector search.
RAG Smart Doc Query
An advanced Retrieval-Augmented Generation (RAG) system that allows users to have natural language conversations with PDF documents. Built with Gemini 3 Flash, LangChain, and Pinecone.

Features
Semantic Search: Uses vector embeddings to find relevant information within large PDFs.

Contextual Accuracy: Answers are derived strictly from the provided document to prevent AI hallucinations.

Efficient Chunking: Implements Recursive Character Text Splitting for optimized context retention.

Cloud-Scale Memory: Integrated with Pinecone DB for high-performance vector retrieval.

Tech Stack
LLM: Google Gemini 3 Flash

Orchestration: LangChain

Vector Database: Pinecone

Embeddings: HuggingFace Transformers (all-MiniLM-L6-v2)

Runtime: Node.js

Getting Started
Prerequisites
Node.js installed

A Gemini API Key

A Pinecone API Key and Index

Installation
Clone the repository:
git clone https://github.com/Ahmedjamal226/RAG-Smart-Doc-Query.git

Install dependencies:
npm install

Set up environment variables:
Create a .env file in the root directory and add:
GEMINI_API_KEY=your_actual_key_here
PINECONE_API_KEY=your_actual_key_here
PINECONE_INDEX_NAME=your_index_name

Usage
Index the Document: Run node index.js to process the PDF and store embeddings in Pinecone.

Chat: Run node query.js to start asking questions about your document.

Project Structure
index.js: Handles PDF loading, chunking, and uploading vectors to Pinecone.

query.js: Handles user input, similarity search, and generating answers via Gemini.

.gitignore: Keeps sensitive API keys and heavy node_modules out of the repository.

License
Distributed under the MIT License.
