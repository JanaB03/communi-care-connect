import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUser } from "@/contexts/UserContext";
import { useChat, Message } from "@/contexts/ChatContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ChevronLeft } from "lucide-react";
import { ThreadList } from "@/components/chat/ThreadList";
import { MessageList } from "@/components/chat/MessageList";
import { MessageInput } from "@/components/chat/MessageInput";

const Chat = () => {
  const { user } = useUser();
  const { 
    messages, 
    threads, 
    activeThreadId, 
    setActiveThreadId, 
    sendMessage,
    editMessage,
    deleteMessage,
    loadingMessages,
    markThreadAsRead
  } = useChat();
  const [showThreads, setShowThreads] = useState(true);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const isMobile = useIsMobile();
  
  // Reset UI state when changing threads
  useEffect(() => {
    setEditingMessageId(null);
    setEditingContent("");
    
    // On mobile, hide thread list when a thread is selected
    if (isMobile && activeThreadId) {
      setShowThreads(false);
    }
    
    // Mark thread as read when selected
    if (activeThreadId) {
      markThreadAsRead(activeThreadId);
    }
  }, [activeThreadId, isMobile, markThreadAsRead]);

  const handleSendMessage = (
    content: string, 
    attachmentType?: "image" | "location" | "document", 
    attachmentData?: any
  ) => {
    if (editingMessageId) {
      // Handle editing mode
      if (content.trim()) {
        editMessage(editingMessageId, content);
      }
      setEditingMessageId(null);
      setEditingContent("");
    } else {
      // Handle sending new message
      if (content.trim() && activeThreadId) {
        sendMessage(content, attachmentType, attachmentData);
      }
    }
  };
  
  const handleEditMessage = (message: Message) => {
    setEditingMessageId(message.id);
    setEditingContent(message.content);
  };
  
  const handleDeleteMessage = (messageId: string) => {
    deleteMessage(messageId);
  };
  
  const handleBackToThreads = () => {
    setShowThreads(true);
  };
  
  const handleSelectThread = (threadId: string) => {
    setActiveThreadId(threadId);
    if (isMobile) setShowThreads(false);
  };
  
  // Find current thread data
  const currentThread = threads.find(thread => thread.id === activeThreadId);
  
  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <div className="flex flex-1 overflow-hidden">
        {/* Thread List - Hidden on mobile when a thread is active */}
        {(!isMobile || showThreads) && (
          <div className={`${isMobile ? 'w-full' : 'w-1/3 border-r'} bg-white flex flex-col`}>
            <ThreadList 
              threads={threads} 
              activeThreadId={activeThreadId}
              onSelectThread={handleSelectThread}
            />
          </div>
        )}

        {/* Message Area - Full width on mobile when a thread is active */}
        {(!isMobile || !showThreads) && (
          <div className={`${isMobile ? 'w-full' : 'w-2/3'} flex flex-col bg-gradient-client`}>
            {/* Header */}
            <div className="p-4 border-b bg-white flex items-center">
              {isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="mr-2"
                  onClick={handleBackToThreads}
                >
                  <ChevronLeft />
                </Button>
              )}
              {activeThreadId && currentThread ? (
                <div className="flex items-center flex-1">
                  <div className="relative">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage 
                        src={currentThread.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentThread.participantName)}&background=random`} 
                        alt={currentThread.participantName} 
                      />
                      <AvatarFallback>
                        {currentThread.participantName.charAt(0) || '?'}
                      </AvatarFallback>
                    </Avatar>
                    {currentThread.status && (
                      <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                        currentThread.status === 'online' ? 'bg-green-500' :
                        currentThread.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                      }`}></span>
                    )}
                  </div>
                  <div>
                    <h2 className="font-bold">{currentThread.participantName}</h2>
                    <p className="text-sm text-gray-500">
                      {currentThread.status === 'online' ? 'Online' : 
                       currentThread.status === 'away' ? 'Away' : 'Offline'} • 
                      {currentThread.participantRole === "client" ? " Client" : " Staff"}
                    </p>
                  </div>
                </div>
              ) : (
                <h2 className="font-bold">Select a conversation</h2>
              )}
            </div>

            {/* Messages */}
            <MessageList 
              messages={messages}
              threads={threads} // Pass threads prop
              activeThreadId={activeThreadId}
              loadingMessages={loadingMessages}
              onEditMessage={handleEditMessage}
              onDeleteMessage={handleDeleteMessage}
            />

            {/* Message Input */}
            {activeThreadId && (
              <MessageInput 
                onSendMessage={handleSendMessage}
                editingMessageId={editingMessageId}
                editingContent={editingContent}
                setEditingContent={setEditingContent}
                cancelEditing={() => {
                  setEditingMessageId(null);
                  setEditingContent("");
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;