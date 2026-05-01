import * as dotenv from "dotenv"; //Loads your .env file (API keys etc.)
dotenv.config();

import readlineSync from "readline-sync";//takes input from terminal (like prompt())
import { Pinecone } from "@pinecone-database/pinecone";//
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/huggingface_transformers";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ //Creates connection to Gemini
  apiKey: process.env.GEMINI_API_KEY,
});
const History = []
//User → question, AI → answer , User → next question



async function chatting(question) {
  // ✅ SAME embeddings as indexing
  const embeddings = new HuggingFaceTransformersEmbeddings({ //Loads a model that converts text → vector
    modelName: "Xenova/all-MiniLM-L6-v2",
  });

  console.log("🔍 Creating query embedding...");

  const queryVector = await embeddings.embedQuery(question);//"linked list" into something like: [0.23, -0.11, 0.98, ...] (384 numbers)

  // ✅ Pinecone connection
  const pinecone = new Pinecone({ //Connect to vector database
    apiKey: process.env.PINECONE_API_KEY,
  });

  const index = pinecone.Index(process.env.PINECONE_INDEX_NAME); //Select your stored data

  console.log("🔎 Searching...");

  const results = await index.query({
    topK: 5,
    vector: queryVector,
    includeMetadata: true,
    //Finds top 5 similar chunks .Example: User: linked list .Pinecone returns:- definition- insertion- diagrams
  });

  console.log("\n📄 Top Results:\n");

  let context = "";

results.matches.forEach((match, i) => {
  console.log(`Result ${i + 1}:`);
  console.log(match.metadata.text);
  console.log("------------\n");

  context += match.metadata.text + "\n";
});

  History.push({
    role:'user',
    parts:[{text:question}]
    })              



    const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: History,
    config: {
      systemInstruction: `You have to behave like a Data Structure and Algorithm Expert.
    You will be given a context of relevant information and a user question.
    Your task is to answer the user's question based ONLY on the provided context.
    If the answer is not in the context, you must say "I could not find the answer in the provided document."
    Keep your answers clear, concise, and educational.
      
      Context: ${context}
      `,
    },
   });


   History.push({
    role:'model',
    parts:[{text:response.text}]
  })

  console.log("\n");
  console.log(response.text);
}

async function main() {
  while (true) {
    const userProblem = readlineSync.question("Ask me anything --> ");
    await chatting(userProblem);
  }
}

main();

