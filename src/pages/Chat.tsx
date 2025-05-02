
import { useState, useRef, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUser } from "@/contexts/UserContext";
import { useChat, Message, ChatThread } from "@/contexts/ChatContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeft,
  ChevronLeft,
  Edit,
  Image as ImageIcon,
  Mic,
  MoreVertical,
  Send,
  Smile,
  Trash2,
  MapPin,
  X
} from "lucide-react";

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
  const [inputValue, setInputValue] = useState("");
  const [showThreads, setShowThreads] = useState(true);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  // Auto scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  
  // Reset UI state when changing threads
  useEffect(() => {
    setInputValue("");
    setEditingMessageId(null);
    setEditingContent("");
    
    // On mobile, hide thread list when a thread is selected
    if (isMobile && activeThreadId) {
      setShowThreads(false);
    }
  }, [activeThreadId, isMobile]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingMessageId) {
      // Handle editing mode
      if (editingContent.trim()) {
        editMessage(editingMessageId, editingContent);
      }
      setEditingMessageId(null);
      setEditingContent("");
    } else {
      // Handle sending new message
      if (inputValue.trim() && activeThreadId) {
        sendMessage(inputValue);
        setInputValue("");
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
  
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };
  
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
  
  // Find current thread data
  const currentThread = threads.find(thread => thread.id === activeThreadId);
  
  // Mobile back button for thread list
  const handleBackToThreads = () => {
    setShowThreads(true);
  };
  
  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <div className="flex flex-1 overflow-hidden">
        {/* Thread List - Hidden on mobile when a thread is active */}
        {(!isMobile || showThreads) && (
          <div className={`${isMobile ? 'w-full' : 'w-1/3 border-r'} bg-white`}>
            <div className="p-4 border-b">
              <h2 className="text-xl font-bold text-navy">Messages</h2>
              <p className="text-sm text-gray-500">
                {threads.length} conversation{threads.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="overflow-y-auto h-[calc(100%-64px)]">
              {threads.length > 0 ? (
                threads.map((thread) => (
                  <div
                    key={thread.id}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                      thread.id === activeThreadId ? "bg-gray-100" : ""
                    }`}
                    onClick={() => {
                      setActiveThreadId(thread.id);
                      if (isMobile) setShowThreads(false);
                    }}
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
            </div>
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
            <div className="flex-1 overflow-y-auto p-4">
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
                        <div 
                          key={message.id} 
                          className={`mb-4 flex ${message.senderRole === user?.role ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className="max-w-[80%]">
                            {/* Message bubble */}
                            <div 
                              className={`
                                ${message.senderRole === 'client' ? 'chat-bubble-client' : 'chat-bubble-staff'}
                                ${editingMessageId === message.id ? 'border-2 border-blue-400' : ''}
                              `}
                            >
                              {message.content}
                              {message.imageUrl && (
                                <div className="mt-2">
                                  <img 
                                    src={message.imageUrl}
                                    alt="Shared" 
                                    className="rounded-md max-w-full"
                                  />
                                </div>
                              )}
                              {message.location && (
                                <div className="mt-2 flex items-center text-sm">
                                  <MapPin size={14} className="mr-1" />
                                  <span>Location shared</span>
                                </div>
                              )}
                            </div>
                            
                            {/* Message metadata */}
                            <div 
                              className={`flex items-center mt-1 text-xs text-gray-500 ${
                                message.senderRole === user?.role ? 'justify-end' : 'justify-start'
                              }`}
                            >
                              <span>{formatTime(message.timestamp)}</span>
                              {message.isEdited && <span className="ml-1">(edited)</span>}
                              
                              {/* Edit/Delete dropdown - only for client's own messages */}
                              {message.sender === user?.id && user?.role === "client" && (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                                      <MoreVertical size={14} />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleEditMessage(message)}>
                                      <Edit className="mr-2 h-4 w-4" /> Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleDeleteMessage(message.id)}>
                                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              )}
                            </div>
                          </div>
                        </div>
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
            </div>

            {/* Message Input */}
            {activeThreadId && (
              <div className="p-4 bg-white border-t">
                {editingMessageId && (
                  <div className="mb-2 p-2 bg-blue-50 rounded-md flex items-center">
                    <span className="text-sm text-blue-700 flex-1">Editing message</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={() => {
                        setEditingMessageId(null);
                        setEditingContent("");
                      }}
                    >
                      <X size={14} />
                    </Button>
                  </div>
                )}
                <form onSubmit={handleSendMessage} className="flex items-center">
                  <Input
                    placeholder="Type a message..."
                    value={editingMessageId ? editingContent : inputValue}
                    onChange={(e) => {
                      if (editingMessageId) {
                        setEditingContent(e.target.value);
                      } else {
                        setInputValue(e.target.value);
                      }
                    }}
                    className="flex-1 mr-2"
                  />
                  <div className="flex items-center gap-1">
                    {!editingMessageId && (
                      <>
                        <Button type="button" variant="ghost" size="icon">
                          <ImageIcon className="h-5 w-5 text-gray-500" />
                        </Button>
                        <Button type="button" variant="ghost" size="icon">
                          <Mic className="h-5 w-5 text-gray-500" />
                        </Button>
                        <Button type="button" variant="ghost" size="icon">
                          <Smile className="h-5 w-5 text-gray-500" />
                        </Button>
                        <Button type="button" variant="ghost" size="icon">
                          <MapPin className="h-5 w-5 text-gray-500" />
                        </Button>
                      </>
                    )}
                    <Button type="submit" className={editingMessageId ? "bg-blue-500 hover:bg-blue-600" : "bg-orange hover:bg-orange/90"}>
                      {editingMessageId ? (
                        <Edit className="h-5 w-5" />
                      ) : (
                        <Send className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
