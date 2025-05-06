import React from "react";
import { MapPin } from "lucide-react";
import { Message } from "@/contexts/ChatContext";
import { useUser } from "@/contexts/UserContext";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, MoreVertical, Trash2 } from "lucide-react";

interface ChatBubbleProps {
  message: Message;
  onEdit: (message: Message) => void;
  onDelete: (id: string) => void;
}

const formatTime = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric'
  }).format(date);
};

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, onEdit, onDelete }) => {
  const { user } = useUser();
  
  // Debug logging - uncomment this to see values in console
  // console.log('Message DEBUG:', {
  //   messageId: message.id,
  //   messageSender: message.sender,
  //   currentUserId: user?.id,
  //   isCurrentUserMessage: message.sender === user?.id
  // });
  
  // Check if current user is the message sender
  const isCurrentUserMessage = message.sender === user?.id;
  
  return (
    <div 
      className={`mb-4 flex ${isCurrentUserMessage ? 'justify-end' : 'justify-start'}`}
    >
      <div className="max-w-[80%]">
        {/* Message bubble */}
        <div 
          className={`px-4 py-3 rounded-2xl ${
            isCurrentUserMessage 
              ? 'bg-[#9b87f5] text-white' // Current user's messages are purple
              : 'bg-[#FEF7CD] text-navy' // Other user's messages are yellow
          }`}
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
            isCurrentUserMessage ? 'justify-end' : 'justify-start'
          }`}
        >
          <span>{formatTime(message.timestamp)}</span>
          {message.isEdited && <span className="ml-1">(edited)</span>}
          
          {/* Edit/Delete dropdown - only for current user's messages */}
          {isCurrentUserMessage && user?.role === "client" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                  <MoreVertical size={14} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(message)}>
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(message.id)}>
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
};