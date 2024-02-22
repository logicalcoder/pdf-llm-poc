"use client";

import 'react-toastify/dist/ReactToastify.css';
import { ChatWindowMessage } from '@/schema/ChatWindowMessage';

export function ChatMessageBubble(props: { message: ChatWindowMessage }) {
  const { role, content } = props.message;

  const colorClassName =
    role === "human" ? "bg-sky-600" : "bg-slate-50 text-black";
  const alignmentClassName =
    role === "human" ? "ml-auto" : "mr-auto";

  return (
    <div
      className={`${alignmentClassName} ${colorClassName} rounded px-4 py-2 max-w-[80%] mb-8 flex flex-col`}
    >
      <div className="flex">
        <div className="whitespace-pre-wrap">
          {content}
        </div>
      </div>
    </div>
  );
}