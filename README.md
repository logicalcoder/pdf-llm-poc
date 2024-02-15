# SLM (Small Language Model) POC

## DESCRIPTION
Proof-of-concept to show what can be done with a simplistic model and some prompt engineering

## BREAKDOWN ON HOW IT WORKS
It is a RAG (Retrieval Augmented Generation) SLM application that reads the content of all PDFs loaded in a central diretory.
Splits it into chunks, create embeddings and saves the context to a InMemorty vector store. 
It was done using primarily **TypeScript**, **LangChain** and a *llama2* model pulled using **Ollama**. 

## ARCHITECTURE


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