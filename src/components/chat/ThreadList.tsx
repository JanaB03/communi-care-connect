
import React from "react";
import { ChatThread } from "@/contexts/ChatContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ThreadListProps {
  threads: ChatThread[];
  activeThreadId: string | null;
  onSelectThread: (threadId: string) => void;
}

const formatTime = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric'
  }).format(date);
};

export const ThreadList: React.FC<ThreadListProps> = ({ threads, activeThreadId, onSelectThread }) => {
  return (
    <div className="w-full bg-white">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-navy">Messages</h2>
        <p className="text-sm text-gray-500">
          {threads.length} conversation{threads.length !== 1 ? 's' : ''}
        </p>
      </div>
      
      <ScrollArea className="h-[calc(100vh-164px)]">
        {threads.length > 0 ? (
          threads.map((thread) => (
            <div
              key={thread.id}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                thread.id === activeThreadId ? "bg-gray-100" : ""
              }`}
              onClick={() => onSelectThread(thread.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage 
                      src={thread.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(thread.participantName)}&background=random`} 
                      alt={thread.participantName} 
                    />
                    <AvatarFallback>{thread.participantName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center">
                      <p className="font-medium">{thread.participantName}</p>
                      {thread.unreadCount > 0 && (
                        <span className="ml-2 bg-orange text-white text-xs px-2 py-0.5 rounded-full">
                          {thread.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {formatTime(thread.lastMessageTime)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            No conversations yet
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
