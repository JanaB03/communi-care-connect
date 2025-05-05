import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Edit, X, ImageIcon, Mic, Smile, MapPin, Paperclip } from "lucide-react";
import { useChat } from "@/contexts/ChatContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface MessageInputProps {
  onSendMessage: (content: string, attachmentType?: "image" | "location" | "document", attachmentData?: any) => void;
  editingMessageId: string | null;
  editingContent: string;
  setEditingContent: (content: string) => void;
  cancelEditing: () => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  editingMessageId,
  editingContent,
  setEditingContent,
  cancelEditing
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [lastTypingTime, setLastTypingTime] = useState(0);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { typingStatus } = useChat();
  
  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "0";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = scrollHeight + "px";
    }
  }, [inputValue, editingContent]);

  // Auto-focus textarea when editing
  useEffect(() => {
    if (editingMessageId && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [editingMessageId]);
  
  // Handle typing indicator
  useEffect(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    if (isTyping) {
      typingStatus(true);
      
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        typingStatus(false);
      }, 2000);
    }
    
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [isTyping, typingStatus]);
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    
    if (editingMessageId) {
      setEditingContent(value);
    } else {
      setInputValue(value);
      
      // Handle typing indicator
      const currentTime = Date.now();
      if (!isTyping) {
        setIsTyping(true);
      }
      setLastTypingTime(currentTime);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingMessageId) {
      if (editingContent.trim()) {
        onSendMessage(editingContent);
      }
      cancelEditing();
    } else {
      if (inputValue.trim()) {
        onSendMessage(inputValue);
        setInputValue("");
        setIsTyping(false);
        if (textareaRef.current) {
          textareaRef.current.style.height = "40px";
        }
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // In a real app, you would upload the file to a server
    // For demo purposes, we'll use a local URL
    const imageUrl = URL.createObjectURL(file);
    
    // Send message with image attachment
    onSendMessage(inputValue || "Sent an image", "image", imageUrl);
    setInputValue("");
  };
  
  const handleShareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: "Current location" // In a real app, you would reverse geocode
          };
          
          // Send message with location attachment
          onSendMessage(inputValue || "Shared my location", "location", locationData);
          setInputValue("");
        },
        (error) => {
          console.error("Error getting location:", error);
          // Show error to user
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser");
      // Show error to user
    }
  };
  
  return (
    <div className="p-4 bg-white border-t">
      {editingMessageId && (
        <div className="mb-2 p-2 bg-blue-50 rounded-md flex items-center">
          <span className="text-sm text-blue-700 flex-1">Editing message</span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6"
            onClick={cancelEditing}
          >
            <X size={14} />
          </Button>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="relative">
          <Textarea
            ref={textareaRef}
            placeholder="Type a message..."
            value={editingMessageId ? editingContent : inputValue}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            className="resize-none min-h-[40px] max-h-[120px] pr-24"
            rows={1}
          />
          <div className="absolute bottom-2 right-2 flex items-center gap-1">
            {!editingMessageId && (
              <>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
                      <Smile className="h-5 w-5 text-gray-500" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-2">
                    <div className="grid grid-cols-6 gap-2">
                      {["😊", "😂", "👍", "❤️", "👋", "🙏", "🔥", "💯", "🎉", "👏", "🤔", "😢"].map(emoji => (
                        <button
                          key={emoji}
                          type="button"
                          className="text-2xl p-1 hover:bg-gray-100 rounded"
                          onClick={() => setInputValue(prev => prev + emoji)}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
                
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <label htmlFor="image-upload">
                  <Button type="button" variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                    <ImageIcon className="h-5 w-5 text-gray-500" />
                  </Button>
                </label>
                
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={handleShareLocation}>
                  <MapPin className="h-5 w-5 text-gray-500" />
                </Button>
                
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
                  <Paperclip className="h-5 w-5 text-gray-500" />
                </Button>
              </>
            )}
            <Button type="submit" size="sm" className={`${editingMessageId ? "bg-blue-500 hover:bg-blue-600" : "bg-orange hover:bg-orange/90"} ml-1`}>
              {editingMessageId ? (
                <Edit className="h-4 w-4 mr-1" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </form>
      {isTyping && !editingMessageId && (
        <div className="text-xs text-gray-500 mt-1">You are typing...</div>
      )}
    </div>
  );
};