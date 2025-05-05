import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "./UserContext";

export interface Message {
  id: string;
  sender: string;
  senderName: string;
  senderRole: "client" | "staff";
  content: string;
  timestamp: Date;
  isEdited?: boolean;
  isRead?: boolean;
  imageUrl?: string;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
  attachmentType?: "image" | "location" | "document";
  documentUrl?: string;
}

export interface ChatThread {
  id: string;
  participantName: string;
  participantId: string;
  participantRole: "client" | "staff";
  lastMessageTime: Date;
  lastMessage?: string;
  unreadCount: number;
  avatar?: string;
  status?: "online" | "offline" | "away";
  isTyping?: boolean;
  isActive?: boolean;
}

interface ChatContextType {
  messages: Message[];
  threads: ChatThread[];
  activeThreadId: string | null;
  setActiveThreadId: (id: string | null) => void;
  sendMessage: (content: string, attachmentType?: "image" | "location" | "document", attachmentData?: any) => void;
  editMessage: (id: string, content: string) => void;
  deleteMessage: (id: string) => void;
  markThreadAsRead: (threadId: string) => void;
  loadingMessages: boolean;
  typingStatus: (isTyping: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

// Shared mock data store to simulate real-time database
// This will be used across different user sessions
const globalMockMessages: Record<string, Message[]> = {
  "thread-1": [
    {
      id: "msg-1",
      sender: "staff-456",
      senderName: "Case Manager Alex",
      senderRole: "staff",
      content: "Hi Jessie, how are you doing today? Just checking in to see if you need any assistance.",
      timestamp: new Date(Date.now() - 3600000),
      isRead: true
    },
    {
      id: "msg-2",
      sender: "client-123",
      senderName: "Jessie Smith",
      senderRole: "client",
      content: "I'm doing okay. I wanted to ask about the mobile clinic tomorrow.",
      timestamp: new Date(Date.now() - 1800000),
      isRead: true
    },
    {
      id: "msg-3",
      sender: "staff-456",
      senderName: "Case Manager Alex",
      senderRole: "staff",
      content: "The mobile clinic will be downtown from 10am to 2pm tomorrow. Would you like me to book you an appointment?",
      timestamp: new Date(Date.now() - 600000),
      isRead: false
    }
  ],
  "thread-2": [
    {
      id: "msg-4",
      sender: "client-123",
      senderName: "Jessie Smith",
      senderRole: "client",
      content: "Hi Alex, I'm looking for housing resources. Can you help?",
      timestamp: new Date(Date.now() - 86400000),
      isRead: true
    },
    {
      id: "msg-5",
      sender: "staff-456",
      senderName: "Case Manager Alex",
      senderRole: "staff",
      content: "Of course! Let's meet tomorrow to discuss your housing options. I have some good leads for you.",
      timestamp: new Date(Date.now() - 82800000),
      isRead: true
    }
  ],
  "thread-3": [
    {
      id: "msg-6",
      sender: "client-123",
      senderName: "Jessie Smith",
      senderRole: "client",
      content: "Hello, I'm following up on my housing application status.",
      timestamp: new Date(Date.now() - 172800000),
      isRead: true
    },
    {
      id: "msg-7",
      sender: "staff-789",
      senderName: "Housing Specialist Jordan",
      senderRole: "staff",
      content: "Hi Jessie, your application is under review. We should have an update by Friday.",
      timestamp: new Date(Date.now() - 169200000),
      isRead: true
    }
  ]
};

// Thread data
const mockThreads: ChatThread[] = [
  {
    id: "thread-1",
    participantName: "Jessie Smith",
    participantId: "client-123",
    participantRole: "client",
    lastMessageTime: new Date(),
    lastMessage: "The mobile clinic will be downtown from 10am to 2pm tomorrow.",
    unreadCount: 1,
    avatar: "/avatar-client.png",
    status: "online"
  },
  {
    id: "thread-2",
    participantName: "Case Manager Alex",
    participantId: "staff-456",
    participantRole: "staff",
    lastMessageTime: new Date(Date.now() - 3600000),
    lastMessage: "Let's meet tomorrow to discuss your housing options.",
    unreadCount: 0,
    avatar: "/avatar-staff.png",
    status: "offline"
  },
  {
    id: "thread-3",
    participantName: "Housing Specialist Jordan",
    participantId: "staff-789",
    participantRole: "staff",
    lastMessageTime: new Date(Date.now() - 86400000),
    lastMessage: "We should have an update by Friday.",
    unreadCount: 0,
    avatar: "/avatar-staff-2.png",
    status: "away"
  }
];

// Set up a real-time update interval in milliseconds
const REAL_TIME_UPDATE_INTERVAL = 2000;

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const [threads, setThreads] = useState<ChatThread[]>(mockThreads);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});

  // Simulated real-time message syncing
  useEffect(() => {
    if (!activeThreadId) return;
    
    // Initial load of messages
    const loadMessages = async () => {
      setLoadingMessages(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setMessages(globalMockMessages[activeThreadId] || []);
        
        // Mark messages as read when thread is opened
        if (user) {
          markThreadAsRead(activeThreadId);
        }
      } catch (error) {
        console.error("Error loading messages", error);
      } finally {
        setLoadingMessages(false);
      }
    };
    
    loadMessages();
    
    // Set up polling for real-time updates
    const intervalId = setInterval(() => {
      setMessages([...globalMockMessages[activeThreadId] || []]);
      
      // Update typing status randomly for demo purposes
      if (Math.random() > 0.8) { // 20% chance
        const updatedThreads = [...threads];
        const threadIndex = updatedThreads.findIndex(t => t.id === activeThreadId);
        if (threadIndex !== -1) {
          updatedThreads[threadIndex].isTyping = !updatedThreads[threadIndex].isTyping;
          setThreads(updatedThreads);
          
          // Auto-reset typing status after 3 seconds
          if (updatedThreads[threadIndex].isTyping) {
            setTimeout(() => {
              setThreads(prev => {
                const newThreads = [...prev];
                const idx = newThreads.findIndex(t => t.id === activeThreadId);
                if (idx !== -1) {
                  newThreads[idx].isTyping = false;
                }
                return newThreads;
              });
            }, 3000);
          }
        }
      }
    }, REAL_TIME_UPDATE_INTERVAL);
    
    return () => clearInterval(intervalId);
  }, [activeThreadId, user]);

  // Update threads with active status
  useEffect(() => {
    setThreads(prev => 
      prev.map(thread => ({
        ...thread,
        isActive: thread.id === activeThreadId
      }))
    );
  }, [activeThreadId]);

  // Send a new message
  const sendMessage = (
    content: string,
    attachmentType?: "image" | "location" | "document",
    attachmentData?: any
  ) => {
    if (!user || !activeThreadId || !content.trim()) return;

    // Create new message object
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: user.id,
      senderName: user.name,
      senderRole: user.role,
      content,
      timestamp: new Date(),
      isRead: true,
      attachmentType
    };

    // Add attachment data if provided
    if (attachmentType === "image" && attachmentData) {
      newMessage.imageUrl = attachmentData;
    } else if (attachmentType === "location" && attachmentData) {
      newMessage.location = attachmentData;
    } else if (attachmentType === "document" && attachmentData) {
      newMessage.documentUrl = attachmentData;
    }

    // Update global mock data store (simulates database update)
    if (!globalMockMessages[activeThreadId]) {
      globalMockMessages[activeThreadId] = [];
    }
    globalMockMessages[activeThreadId] = [...globalMockMessages[activeThreadId], newMessage];

    // Update messages state
    setMessages(prev => [...prev, newMessage]);

    // Update thread with last message info
    setThreads(prev => 
      prev.map(thread => 
        thread.id === activeThreadId
          ? { 
              ...thread, 
              lastMessageTime: newMessage.timestamp, 
              lastMessage: content,
              unreadCount: 0,
              isTyping: false
            }
          : thread
      )
    );

    // Simulate response for demo purposes (50% chance)
    if (Math.random() > 0.5) {
      // Show typing indicator
      setThreads(prev => 
        prev.map(thread => 
          thread.id === activeThreadId
            ? { ...thread, isTyping: true }
            : thread
        )
      );
      
      // Send automated response after delay
      setTimeout(() => {
        const responder = threads.find(t => t.id === activeThreadId);
        if (!responder) return;
        
        const responses = [
          "Thanks for your message. I'll get back to you soon.",
          "I've received your message and will follow up shortly.",
          "Got it. Let me check on that for you.",
          "Thanks for letting me know. I'll look into this."
        ];
        
        const responseMsg: Message = {
          id: `msg-${Date.now()}`,
          sender: responder.participantId,
          senderName: responder.participantName,
          senderRole: responder.participantRole,
          content: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date(),
          isRead: false
        };
        
        globalMockMessages[activeThreadId].push(responseMsg);
        setMessages(prev => [...prev, responseMsg]);
        
        // Update thread
        setThreads(prev => 
          prev.map(thread => 
            thread.id === activeThreadId
              ? { 
                  ...thread, 
                  lastMessageTime: responseMsg.timestamp, 
                  lastMessage: responseMsg.content,
                  isTyping: false
                }
              : thread
          )
        );
      }, 3000 + Math.random() * 2000); // Random delay between 3-5 seconds
    }

    console.log("Message sent:", newMessage);
  };

  // Edit a message
  const editMessage = (id: string, content: string) => {
    if (!user || !activeThreadId) return;
    
    // Only client users can edit messages
    if (user.role !== "client") return;
    
    // Update global mock data store (simulates database update)
    if (globalMockMessages[activeThreadId]) {
      globalMockMessages[activeThreadId] = globalMockMessages[activeThreadId].map(msg => 
        msg.id === id && msg.sender === user.id 
          ? { ...msg, content, isEdited: true }
          : msg
      );
    }
    
    // Update messages state
    setMessages(prev => 
      prev.map(msg => 
        msg.id === id && msg.sender === user.id 
          ? { ...msg, content, isEdited: true }
          : msg
      )
    );
    
    // Update thread if the edited message was the last one
    const editedMessage = globalMockMessages[activeThreadId].find(m => m.id === id);
    if (editedMessage) {
      const lastMessage = globalMockMessages[activeThreadId].reduce((latest, msg) => 
        msg.timestamp > latest.timestamp ? msg : latest
      );
      
      if (lastMessage.id === id) {
        setThreads(prev => 
          prev.map(thread => 
            thread.id === activeThreadId
              ? { ...thread, lastMessage: content }
              : thread
          )
        );
      }
    }
    
    console.log("Message edited:", id, content);
  };

  // Delete a message
  const deleteMessage = (id: string) => {
    if (!user || !activeThreadId) return;
    
    // Only client users can delete messages
    if (user.role !== "client") return;
    
    // Update global mock data store (simulates database update)
    if (globalMockMessages[activeThreadId]) {
      const deletedIndex = globalMockMessages[activeThreadId].findIndex(
        msg => msg.id === id && msg.sender === user.id
      );
      
      if (deletedIndex !== -1) {
        globalMockMessages[activeThreadId].splice(deletedIndex, 1);
      }
    }
    
    // Update messages state
    setMessages(prev => prev.filter(msg => !(msg.id === id && msg.sender === user.id)));
    
    // Update thread last message if needed
    if (globalMockMessages[activeThreadId] && globalMockMessages[activeThreadId].length > 0) {
      const newLastMessage = globalMockMessages[activeThreadId].reduce((latest, msg) => 
        msg.timestamp > latest.timestamp ? msg : latest
      );
      
      setThreads(prev => 
        prev.map(thread => 
          thread.id === activeThreadId
            ? { 
                ...thread, 
                lastMessage: newLastMessage.content,
                lastMessageTime: newLastMessage.timestamp 
              }
            : thread
        )
      );
    }
    
    console.log("Message deleted:", id);
  };

  // Mark a thread as read
  const markThreadAsRead = (threadId: string) => {
    if (!user) return;
    
    // Update global mock messages
    if (globalMockMessages[threadId]) {
      globalMockMessages[threadId] = globalMockMessages[threadId].map(msg => 
        msg.sender !== user.id ? { ...msg, isRead: true } : msg
      );
    }
    
    // Update local messages if this is the active thread
    if (activeThreadId === threadId) {
      setMessages(prev => 
        prev.map(msg => 
          msg.sender !== user.id ? { ...msg, isRead: true } : msg
        )
      );
    }
    
    // Update thread unread count
    setThreads(prev => 
      prev.map(thread => 
        thread.id === threadId ? { ...thread, unreadCount: 0 } : thread
      )
    );
  };

  // Set typing status
  const typingStatus = (isTyping: boolean) => {
    if (!user || !activeThreadId) return;
    
    // In a real app, this would notify the server that the user is typing
    console.log(`User ${user.name} is ${isTyping ? 'typing' : 'not typing'} in thread ${activeThreadId}`);
    
    // For demo purposes, we could add some simulated responses here
    if (isTyping) {
      // Chance of showing typing indicator from the other participant
      const thread = threads.find(t => t.id === activeThreadId);
      if (thread && Math.random() > 0.7) {
        setTimeout(() => {
          setThreads(prev => 
            prev.map(t => 
              t.id === activeThreadId ? { ...t, isTyping: true } : t
            )
          );
          
          // Auto-reset after a few seconds
          setTimeout(() => {
            setThreads(prev => 
              prev.map(t => 
                t.id === activeThreadId ? { ...t, isTyping: false } : t
              )
            );
          }, 2000 + Math.random() * 2000);
        }, 1000 + Math.random() * 1000);
      }
    }
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        threads,
        activeThreadId,
        setActiveThreadId,
        sendMessage,
        editMessage,
        deleteMessage,
        markThreadAsRead,
        loadingMessages,
        typingStatus
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};