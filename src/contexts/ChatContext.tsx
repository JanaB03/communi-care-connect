
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
  imageUrl?: string;
  location?: {
    lat: number;
    lng: number;
  };
}

export interface ChatThread {
  id: string;
  participantName: string;
  participantId: string;
  participantRole: "client" | "staff";
  lastMessageTime: Date;
  unreadCount: number;
  avatar?: string;
}

interface ChatContextType {
  messages: Message[];
  threads: ChatThread[];
  activeThreadId: string | null;
  setActiveThreadId: (id: string | null) => void;
  sendMessage: (content: string, imageUrl?: string, location?: { lat: number; lng: number }) => void;
  editMessage: (id: string, content: string) => void;
  deleteMessage: (id: string) => void;
  loadingMessages: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

// Simulated mock data
const mockThreads: ChatThread[] = [
  {
    id: "thread-1",
    participantName: "Jessie Smith",
    participantId: "client-123",
    participantRole: "client",
    lastMessageTime: new Date(),
    unreadCount: 2,
    avatar: "/avatar-client.png"
  },
  {
    id: "thread-2",
    participantName: "Case Manager Alex",
    participantId: "staff-456",
    participantRole: "staff",
    lastMessageTime: new Date(Date.now() - 3600000),
    unreadCount: 0,
    avatar: "/avatar-staff.png"
  },
  {
    id: "thread-3",
    participantName: "Housing Specialist Jordan",
    participantId: "staff-789",
    participantRole: "staff",
    lastMessageTime: new Date(Date.now() - 86400000),
    unreadCount: 0,
    avatar: "/avatar-staff-2.png"
  }
];

const mockMessages: Record<string, Message[]> = {
  "thread-1": [
    {
      id: "msg-1",
      sender: "staff-456",
      senderName: "Case Manager Alex",
      senderRole: "staff",
      content: "Hi Jessie, how are you doing today? Just checking in to see if you need any assistance.",
      timestamp: new Date(Date.now() - 3600000)
    },
    {
      id: "msg-2",
      sender: "client-123",
      senderName: "Jessie Smith",
      senderRole: "client",
      content: "I'm doing okay. I wanted to ask about the mobile clinic tomorrow.",
      timestamp: new Date(Date.now() - 1800000)
    },
    {
      id: "msg-3",
      sender: "staff-456",
      senderName: "Case Manager Alex",
      senderRole: "staff",
      content: "The mobile clinic will be downtown from 10am to 2pm tomorrow. Would you like me to book you an appointment?",
      timestamp: new Date(Date.now() - 600000)
    }
  ],
  "thread-2": [
    {
      id: "msg-4",
      sender: "client-123",
      senderName: "Jessie Smith",
      senderRole: "client",
      content: "Hi Alex, I'm looking for housing resources. Can you help?",
      timestamp: new Date(Date.now() - 86400000)
    },
    {
      id: "msg-5",
      sender: "staff-456",
      senderName: "Case Manager Alex",
      senderRole: "staff",
      content: "Of course! Let's meet tomorrow to discuss your housing options. I have some good leads for you.",
      timestamp: new Date(Date.now() - 82800000)
    }
  ],
  "thread-3": [
    {
      id: "msg-6",
      sender: "client-123",
      senderName: "Jessie Smith",
      senderRole: "client",
      content: "Hello, I'm following up on my housing application status.",
      timestamp: new Date(Date.now() - 172800000)
    },
    {
      id: "msg-7",
      sender: "staff-789",
      senderName: "Housing Specialist Jordan",
      senderRole: "staff",
      content: "Hi Jessie, your application is under review. We should have an update by Friday.",
      timestamp: new Date(Date.now() - 169200000)
    }
  ]
};

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const [threads, setThreads] = useState<ChatThread[]>(mockThreads);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);

  // Load messages when active thread changes
  useEffect(() => {
    if (!activeThreadId) return;

    const loadMessages = async () => {
      setLoadingMessages(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setMessages(mockMessages[activeThreadId] || []);
      } catch (error) {
        console.error("Error loading messages", error);
      } finally {
        setLoadingMessages(false);
      }
    };

    loadMessages();
  }, [activeThreadId]);

  // Send a new message
  const sendMessage = (content: string, imageUrl?: string, location?: { lat: number; lng: number }) => {
    if (!user || !activeThreadId || !content.trim()) return;

    // Create new message object
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: user.id,
      senderName: user.name,
      senderRole: user.role,
      content,
      timestamp: new Date(),
      imageUrl,
      location
    };

    // Update messages state
    setMessages(prev => [...prev, newMessage]);

    // Update thread with last message info
    setThreads(prev => 
      prev.map(thread => 
        thread.id === activeThreadId
          ? { ...thread, lastMessageTime: newMessage.timestamp, unreadCount: 0 }
          : thread
      )
    );

    // In a real app, send to backend/API here
    console.log("Message sent:", newMessage);
    
    // Add to mock data for persistence during session
    mockMessages[activeThreadId] = [...(mockMessages[activeThreadId] || []), newMessage];
  };

  // Edit a message
  const editMessage = (id: string, content: string) => {
    if (!user || !activeThreadId) return;
    
    // Only client users can edit messages
    if (user.role !== "client") return;
    
    // Update messages state
    setMessages(prev => 
      prev.map(msg => 
        msg.id === id && msg.sender === user.id 
          ? { ...msg, content, isEdited: true }
          : msg
      )
    );
    
    // In a real app, update backend/API here
    console.log("Message edited:", id, content);
    
    // Update mock data
    if (mockMessages[activeThreadId]) {
      mockMessages[activeThreadId] = mockMessages[activeThreadId].map(msg => 
        msg.id === id && msg.sender === user.id 
          ? { ...msg, content, isEdited: true }
          : msg
      );
    }
  };

  // Delete a message
  const deleteMessage = (id: string) => {
    if (!user || !activeThreadId) return;
    
    // Only client users can delete messages
    if (user.role !== "client") return;
    
    // Update messages state
    setMessages(prev => prev.filter(msg => !(msg.id === id && msg.sender === user.id)));
    
    // In a real app, update backend/API here
    console.log("Message deleted:", id);
    
    // Update mock data
    if (mockMessages[activeThreadId]) {
      mockMessages[activeThreadId] = mockMessages[activeThreadId].filter(
        msg => !(msg.id === id && msg.sender === user.id)
      );
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
        loadingMessages
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
