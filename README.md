# SLM (Small Language Model) POC

## DESCRIPTION
Proof-of-concept to show what can be done with a small language model and some prompt engineering. <br><br> This readme refers to the whole application and consists of 2 parts.<br>
Namely both a server and client applications running each on their own ports. 

## BREAKDOWN ON HOW IT WORKS

### SERVER
It is a RAG (Retrieval Augmented Generation) SLM application that reads the content of all PDFs loaded in a central diretory.
Splits it into chunks, create embeddings and saves the context to a InMemorty vector store. 
It was done using primarily **TypeScript**, **LangChain** and a *llama2* model pulled using **Ollama**. <br><br>
Please refer to the server [README](/server/README.md) for more detailed information.

### CLIENT
It is a basic web application build **NextJS**, making API requests to the server allowing the user to query the local language model. <br><br>
Please refer to the client [README](/client/README.md) for more detailed information.

## INSTALLING
You will need to install node packages in both the server and client directories.

1. Firstly run the following command in the root directory and not in the 'server' or 'client' sub-directories. This will install only the **concurrently** package which will be used to simultaneously install and run both app. 
```bash
$ npm install
```

2. Once successfully completed, run the following to install the dependancy packages for both apps.<br> 
Make sure to add **run** within the command or else it will look at the root package.json file which is wrong.
```bash
$ npm run install
```

## STARTING BOTH APPS
1. When both applications dependancies have completed their installations you will be able to run both using the following command:
```bash
$ npm start
```