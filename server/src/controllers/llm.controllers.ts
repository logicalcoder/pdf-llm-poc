import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";

import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate, } from "@langchain/core/prompts";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OllamaEmbeddings } from "langchain/embeddings/ollama";
import { Request, Response } from 'express';
import { VectorStoreRetriever } from "langchain/vectorstores/base";
import { RunnablePassthrough, RunnableSequence } from "@langchain/core/runnables";
import { formatDocumentsAsString } from "langchain/util/document";

const MODEL = new ChatOllama({
  baseUrl: "http://localhost:11434", // Default value
  model: "llama2",
});

let RETRIEVER: any = null;
let DATA_PREPPED: boolean = false;

// Create a system prompt header as a guide for the chat model
// const SYSTEM_TEMPLATE: string = `Use the following pieces of context to only answer the question at the end and 
//     you are not allowed to make up any responses not related to the given context. 
//     You are also not allowed to go beyond your boundaries or get information from the internet.
//     If you don't know the answer, just say that you don't know, don't try to make up an answer.
//     ----------------  
//     {context}`;

const SYSTEM_TEMPLATE: string = `You are cryptography and tasked with validating the compliancy of the quesitons being asked 
    against the context given. Only use the following cryptography context to answer the question at the end. 
    You are not allowed to make up any responses not related to the given context.
    Refrain from stating that you are just an AI and don't have access to the specific context you provided.
    Do not mention the word context, rather refer to it as the standard. 
    Answer the question in a professional human-like manner, only stating the facts.
    If you don't know the answer, just say that you don't know, don't try to make up an answer.
    ----------------  
    {context}`;

async function prepareData(): Promise<VectorStoreRetriever<MemoryVectorStore>> {
  try {
    /* Load all PDFs within the specified directory */
    const directoryLoader = new DirectoryLoader(
      // "./nlp_data/",
      "./data/",
      {
        ".pdf": (path: string) => new PDFLoader(path),
      }
    );

    const docs = await directoryLoader.load();

    /* Split text into chunks with any TextSplitter. 
    You can then use it as context or save it to memory afterwards. */
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const splitDocs = await textSplitter.splitDocuments(docs);

    // const docs = await directoryLoader.load();

    // const loader = new PDFLoader("./data/understanding-nlp.pdf", { splitPages: true });
    // const docs = await loader.load();

    // const splitter = new RecursiveCharacterTextSplitter();
    // const splitDocs = await splitter.splitDocuments(docs);
    const vectorStore = await MemoryVectorStore.fromDocuments(splitDocs, new OllamaEmbeddings());

    const retriever = vectorStore.asRetriever();

    return retriever;
  } catch (error: any) {
    console.error(error.message);

    throw new Error("Internal server error");
  }
}

export const loadData = async () => {
  console.log({ 'PREPPING_DATA': 'STARTED...' });

  RETRIEVER = await prepareData();

  DATA_PREPPED = true;

  console.log({ 'PREPPING_DATA': 'COMPLETE!' });
};

export const findResult = async (req: Request, res: Response) => {
  try {
    const { query } = req.body;

    if (!query || query.length === 0) {
      return res.status(400).json({ message: "Missing query" });
    }

    if (!RETRIEVER || !DATA_PREPPED) {
      return res.status(500).json({ message: "Model not ready yet, data still being ingested" });
    }

    const messages = [
      SystemMessagePromptTemplate.fromTemplate(SYSTEM_TEMPLATE),
      HumanMessagePromptTemplate.fromTemplate("{question}"),
    ];
    const prompt = ChatPromptTemplate.fromMessages(messages);

    const chain = RunnableSequence.from([
      {
        context: RETRIEVER.pipe(formatDocumentsAsString),
        question: new RunnablePassthrough(),
      },
      prompt,
      MODEL,
      new StringOutputParser(),
    ]);

    const answer = await chain.invoke(
      query
    );
    res.send({ answer });
  } catch (error: any) {
    console.error(error.message);

    res.status(500).json({ message: "Internal server error" });
  }
};