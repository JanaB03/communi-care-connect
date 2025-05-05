import React, { useRef, useEffect } from "react";
import { Message, ChatThread } from "@/contexts/ChatContext";
import { ChatBubble } from "./ChatBubble";
import { MessageCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUser } from "@/contexts/UserContext";

interface MessageListProps {
  messages: Message[];
  threads: ChatThread[]; // Add this prop
  activeThreadId: string | null;
  loadingMessages: boolean;
  onEditMessage: (message: Message) => void;
  onDeleteMessage: (id: string) => void;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  threads, // Add this prop
  activeThreadId,
  loadingMessages,
  onEditMessage,
  onDeleteMessage
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();
  
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

  const renderTypingIndicator = () => {
    const otherRole = user?.role === 'client' ? 'staff' : 'client';
    const bubbleClass = otherRole === 'client' ? 'bg-[#FEF7CD] text-navy' : 'bg-[#9b87f5] text-white';
    
    return (
      <div className="flex justify-start mb-4">
        <div className="max-w-[80%]">
          <div className={`px-4 py-3 rounded-2xl ${bubbleClass}`}>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-current mr-1 animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-current mr-1 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Check if current thread is typing
  const isThreadTyping = activeThreadId ? 
    threads.find(t => t.id === activeThreadId)?.isTyping : false;
  
  return (
    <ScrollArea className="flex-1 p-4">
      {activeThreadId ? (
        loadingMessages ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-pulse flex flex-col items-center">
              <MessageCircle className="h-10 w-10 text-gray-300 mb-2" />
              <span className="text-gray-500">Loading messages...</span>
            </div>
          </div>
        ) : messages.length > 0 ? (
          <>
            {groupMessagesByDate().map((group, groupIndex) => (
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
            ))}
            
            {/* Typing indicator */}
            {isThreadTyping && renderTypingIndicator()}
            
            <div ref={messagesEndRef} />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <MessageCircle size={48} strokeWidth={1} className="mb-4" />
            <p className="text-lg font-medium">No messages yet</p>
            <p className="text-sm">Start the conversation!</p>
          </div>
        )
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <MessageCircle size={48} strokeWidth={1} className="mb-4" />
          <p className="text-lg font-medium">Select a conversation to start messaging</p>
        </div>
      )}
    </ScrollArea>
  );
};