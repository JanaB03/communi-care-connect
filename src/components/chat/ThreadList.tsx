import React from "react";
import { ChatThread } from "@/contexts/ChatContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/contexts/UserContext";

interface ThreadListProps {
  threads: ChatThread[];
  activeThreadId: string | null;
  onSelectThread: (threadId: string) => void;
}

const formatTime = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  // If less than 24 hours, show time
  if (diff < 86400000) {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  }
  
  // If within the last week, show day of week
  if (diff < 604800000) {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short'
    }).format(date);
  }
  
  // Otherwise, show date
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric'
  }).format(date);
};

export const ThreadList: React.FC<ThreadListProps> = ({ threads, activeThreadId, onSelectThread }) => {
  const { user } = useUser();
  
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      default: return 'bg-gray-400';
    }
  };
  
  return (
    <div className="w-full h-full bg-white flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-navy">Messages</h2>
        <p className="text-sm text-gray-500">
          {threads.length} conversation{threads.length !== 1 ? 's' : ''}
        </p>
      </div>
      
      <ScrollArea className="flex-1">
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
                <div className="flex items-center flex-1 min-w-0">
                  <div className="relative">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage 
                        src={thread.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(thread.participantName)}&background=random`} 
                        alt={thread.participantName} 
                      />
                      <AvatarFallback>{thread.participantName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(thread.status)}`}></span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center">
                      <p className="font-medium truncate">{thread.participantName}</p>
                      <p className="ml-2 text-xs text-gray-500 flex-shrink-0">{formatTime(thread.lastMessageTime)}</p>
                    </div>
                    <div className="flex items-center">
                      <p className="text-sm text-gray-500 truncate mr-2">
                        {thread.isTyping ? (
                          <span className="text-blue-500 flex items-center">
                            <span className="inline-block h-1.5 w-1.5 bg-blue-500 rounded-full mr-1 animate-pulse"></span>
                            Typing...
                          </span>
                        ) : (
                          thread.lastMessage
                        )}
                      </p>
                      {thread.unreadCount > 0 && (
                        <Badge variant="default" className="ml-auto bg-orange text-white text-xs">
                          {thread.unreadCount}
                        </Badge>
                      )}
                    </div>
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
      
      {/* User info section */}
      {user && (
        <div className="mt-auto border-t p-4 flex items-center">
          <Avatar className="h-8 w-8 mr-3">
            <AvatarImage 
              src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`} 
              alt={user.name} 
            />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">{user.name}</p>
            <p className="text-xs text-gray-500">{user.role === 'client' ? 'Client' : 'Staff'}</p>
          </div>
          <div className="ml-auto flex items-center">
            <Badge variant="outline" className="text-xs">
              Online
            </Badge>
          </div>
        </div>
      )}
    </div>
  );
};