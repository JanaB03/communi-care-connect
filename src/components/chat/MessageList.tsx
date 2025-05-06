import React, { useRef, useEffect } from "react";
import { Message } from "@/contexts/ChatContext";
import { ChatBubble } from "./ChatBubble";
import { MessageCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUser } from "@/contexts/UserContext";

interface MessageListProps {
  messages: Message[];
  activeThreadId: string | null;
  loadingMessages: boolean;
  onEditMessage: (message: Message) => void;
  onDeleteMessage: (id: string) => void;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  activeThreadId,
  loadingMessages,
  onEditMessage,
  onDeleteMessage
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();
  
  // Add console logging to debug
  // console.log('Current User:', user);
  // console.log('Messages:', messages.map(m => ({
  //   id: m.id,
  //   sender: m.sender,
  //   content: m.content
  // })));
  
  // Auto scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  
  const formatDateForHeader = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric'
      }).format(date);
    }
  };
  
  // Group messages by date
  const groupMessagesByDate = () => {
    const groups: { [key: string]: Message[] } = {};
    
    messages.forEach((message) => {
      const date = message.timestamp.toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return Object.entries(groups).map(([date, messages]) => {
      return {
        date: new Date(date),
        messages
      };
    }).sort((a, b) => a.date.getTime() - b.date.getTime());
  };
  
  return (
    <ScrollArea className="flex-1 p-4">
      {activeThreadId ? (
        loadingMessages ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-pulse text-gray-500">Loading messages...</div>
          </div>
        ) : (
          groupMessagesByDate().map((group, groupIndex) => (
            <div key={groupIndex} className="mb-6">
              <div className="flex justify-center mb-4">
                <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs">
                  {formatDateForHeader(group.date)}
                </span>
              </div>
              
              {group.messages.map((message) => (
                <ChatBubble 
                  key={message.id}
                  message={message}
                  onEdit={onEditMessage}
                  onDelete={onDeleteMessage}
                />
              ))}
            </div>
          ))
        )
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <MessageCircle size={48} strokeWidth={1} className="mb-4" />
          <p className="text-lg font-medium">Select a conversation to start messaging</p>
        </div>
      )}
      <div ref={messagesEndRef} />
    </ScrollArea>
  );
};