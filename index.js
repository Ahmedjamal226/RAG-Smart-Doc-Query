import * as dotenv from "dotenv";
dotenv.config();

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/huggingface_transformers";import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";

async function indexDocument() {
  try {
    // Load PDF and Defining the Path
    //This simply tells the program where your file is located. In this case, it’s looking for a file named Core-java-material.pdf in the same folder where your code is running (./).
    const loader = new PDFLoader("./Dsa.pdf");
    //Think of the PDFLoader as a "specialized translator." Computers see PDFs as complex layers of binary code, fonts, and images. The PDFLoader is a class from the LangChain library designed specifically to open that PDF and extract the readable text while ignoring the "noise."
    const rawDocs = await loader.load();
    //.load(): This method executes the extraction. It returns an Array of Document Objects.
    console.log("PDF loaded:", rawDocs.length);

    // Chunking
    const splitter = new RecursiveCharacterTextSplitter({ //Class used: RecursiveCharacterTextSplitter (from LangChain)
     //This class is designed to break large text into smaller chunks while trying to keep related pieces of text together (like sentences or paragraphs).
        chunkSize: 1000, //Defines the maximum number of characters allowed in one chunk.
      chunkOverlap: 200,//Keeps 200 characters from the end of one chunk at the beginning of the next to maintain context
    });

    const chunkedDocs = await splitter.splitDocuments(rawDocs);

    const filteredDocs = chunkedDocs.filter(
      (doc) => doc.pageContent.trim().length > 0
    );

    console.log("Chunks:", filteredDocs.length);

    // Embeddings (LOCAL ✅)
    const embeddings = new HuggingFaceTransformersEmbeddings({ //This is the "Translator" that converts human language into mathematical vectors.
      modelName: "Xenova/all-MiniLM-L6-v2",
    });

    console.log("Embeddings ready");

    // Pinecone Connects your application to your specific cloud vector database.
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,//Initializes the Pinecone client using your secure API key.
    });

    const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);//Points the code to the specific "table" in your database (in your case, the one named ahmedjamal)

    // Store
    await PineconeStore.fromDocuments(filteredDocs, embeddings, {
        //his is a high-level helper function that performs three tasks at once: Sends the filteredDocs to the embeddings model to get vectors. Pairs each vector with its original text and metadata. Uploads everything to the pineconeIndex.
      pineconeIndex: index,
    });

    console.log("🎉 SUCCESS: Data stored!");
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

indexDocument();