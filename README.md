# SLM (Small Language Model) POC

## DESCRIPTION
Proof-of-concept to show what can be done with a simplistic model and some prompt engineering

## BREAKDOWN ON HOW IT WORKS
It is a RAG (Retrieval Augmented Generation) SLM application that reads the content of all PDFs loaded in a central diretory.
Splits it into chunks, create embeddings and saves the context to a InMemorty vector store. 
It was done using primarily **TypeScript**, **LangChain** and a *llama2* model pulled using **Ollama**. 

## ARCHITECTURE
![](/public/Component_Diagram.png)

### 1. SOURCE
This refers to the raw files that needs to be loaded as the references to what the questions need to be validated against. <br>
At the moment it is set to only look at PDFs.

### 2. LOAD
Load data from the PDF documents within the directory or any location as specified.

### 3. SPLIT / TRANSFORM
A key part of retrieval is fetching only the relevant parts of documents. <br>
One of the primary transformation steps is splitting (or chunking) a large document into smaller chunks. <br>

### 4. EMBEDDING
Embeddings capture the semantic meaning of text, allowing you to quickly and efficiently find other pieces of text that are similar.

### 5. STORE
With the rise of embeddings, there has emerged a need for databases to support efficient storage and searching of these embeddings. <br>
This require a vectorstore where the embedding information can be stored, for this project a InMemory store is being used. <br>

### 6. RETRIEVAL
Once the data is in the database, you still need to retrieve it. <br>
The retriever is then used within the prompting call to know where and how the relevant information needs to be retrieved.

### 7. QUESTION / PROMT
Using the retriever multiple prompts can now be made to query the base data. <br>
A template is used to combine a System Prompt and the User Prompt. <br>
The System Prompt is used to guide the model to only respond in a very specific manner.

## INSTALLING AND RUNNING
1. Make sure you have Ollama running locally. <br>
You can download it from https://ollama.com/ and pull the llama2 model.

2. Add a directory call `data/` and add the source PDFs in it. <br>
This will be used as the base on which the model will run to retrieve the specific information.

3. Make a copy of the `.env_base` file and rename it to `.env` <br>
The PORT number is retreived from here where the application will run on. 

4. Run the following within the root folder to install all the dependancy packages
```bash
$ npm install
```

5. Once successfully completed, run the following to start the application and prep the data
```bash
$ npm start
```