import { ChatWindow } from "@/components/ChatWindow";

export default function Home() {
  return (
    <ChatWindow
      titleText="LOCAL RUNNING LANGUAGE MODEL POC"
      placeholder="Ask me anything related to the uploaded content..."
    ></ChatWindow>
  );
}