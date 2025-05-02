
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
    loadingMessages
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
  }, [activeThreadId, isMobile]);

  const handleSendMessage = (content: string) => {
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
        sendMessage(content);
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
          <div className={`${isMobile ? 'w-full' : 'w-1/3 border-r'} bg-white`}>
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
              {activeThreadId ? (
                <>
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage 
                      src={currentThread?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentThread?.participantName || '')}&background=random`} 
                      alt={currentThread?.participantName} 
                    />
                    <AvatarFallback>
                      {currentThread?.participantName.charAt(0) || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-bold">{currentThread?.participantName}</h2>
                    <p className="text-sm text-gray-500">
                      {currentThread?.participantRole === "client" ? "Client" : "Staff"}
                    </p>
                  </div>
                </>
              ) : (
                <h2 className="font-bold">Select a conversation</h2>
              )}
            </div>

            {/* Messages */}
            <MessageList 
              messages={messages}
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
