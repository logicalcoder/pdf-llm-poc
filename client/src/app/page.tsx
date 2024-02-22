import { ChatWindow } from "@/components/ChatWindow";

export default function Home() {
  return (
    <ChatWindow
      titleText="Local SLM, Small Language Model, POC"
      placeholder="Ask me anything related to the uploaded content..."
    ></ChatWindow>
  );
}