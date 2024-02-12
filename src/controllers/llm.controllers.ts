import { RetrievalQAChain, LLMChain, StuffDocumentsChain } from "langchain/chains";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";

import { Ollama } from "langchain/llms/ollama";
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OllamaEmbeddings } from "langchain/embeddings/ollama";
import { Request, Response } from 'express';
import { VectorStoreRetriever } from "langchain/vectorstores/base";

// import { createStuffDocumentsChain } from "langchain/chains/combine_documents";

const MODEL = new ChatOllama({
  baseUrl: "http://localhost:11434", // Default value
  model: "llama2",
});

let RETRIEVER: any = null;

async function prepareData(): Promise<VectorStoreRetriever<MemoryVectorStore>> {
  const loader = new PDFLoader("./data/understanding-nlp.pdf", { splitPages: true });
  const docs = await loader.load();

  const splitter = new RecursiveCharacterTextSplitter();
  const splitDocs = await splitter.splitDocuments(docs);
  const vectorStore = await MemoryVectorStore.fromDocuments(splitDocs, new OllamaEmbeddings());

  const retriever = vectorStore.asRetriever();

  return retriever;
}

export const loadData = async () => {
  console.log('PREPPING DATA...');

  RETRIEVER = await prepareData();

  console.log('DATA PREPPED!');
};

export const findResult = async (req: Request, res: Response) => {
  try {
    console.log('req :>> ', req);

    const { prompt } = req.body;

    if (!prompt || prompt.length === 0) {
      return res.status(400).json({ message: "Missing prompt" });
    }

    console.log('prompt :>> ', prompt);

    const chain = RetrievalQAChain.fromLLM(MODEL, RETRIEVER);
    const result = await chain.invoke({query: prompt});

    console.log('result :>> ', result)
    res.send(result);
  } catch (error: any) {
    console.error(error.message);

    res.status(500).json({ message: "Internal server error" });
  }
};