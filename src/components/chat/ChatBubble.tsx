import React from "react";
import { MapPin, Check, Clock } from "lucide-react";
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
  const isCurrentUserMessage = message.sender === user?.id;
  const isClientMessage = message.senderRole === 'client';
  
  // Render different bubble content based on message type
  const renderMessageContent = () => {
    // For image attachments
    if (message.attachmentType === "image" && message.imageUrl) {
      return (
        <>
          {message.content && <p className="mb-2">{message.content}</p>}
          <div className="mt-1 rounded-md overflow-hidden max-w-[240px]">
            <img 
              src={message.imageUrl}
              alt="Shared" 
              className="max-w-full object-contain"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg";
              }}
            />
          </div>
        </>
      );
    }
    
    // For location attachments
    if (message.attachmentType === "location" && message.location) {
      return (
        <>
          {message.content && <p className="mb-1">{message.content}</p>}
          <div className="mt-1 flex items-center text-sm">
            <MapPin size={14} className="mr-1 flex-shrink-0" />
            <span className="text-sm">
              Location: {message.location.address || `${message.location.lat.toFixed(6)}, ${message.location.lng.toFixed(6)}`}
            </span>
          </div>
          <div className="mt-2 rounded-md overflow-hidden">
            <div className="bg-gray-200 h-24 w-full rounded-md flex items-center justify-center">
              <MapPin size={24} />
            </div>
          </div>
        </>
      );
    }
    
    // For document attachments
    if (message.attachmentType === "document" && message.documentUrl) {
      return (
        <>
          {message.content && <p className="mb-1">{message.content}</p>}
          <div className="mt-1 p-2 border rounded-md bg-gray-50 flex items-center">
            <div className="bg-blue-100 p-2 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <div className="ml-2 overflow-hidden">
              <div className="font-medium text-sm truncate">Document</div>
              <div className="text-xs text-gray-500 truncate">{message.documentUrl.split('/').pop()}</div>
            </div>
          </div>
        </>
      );
    }
    
    // For plain text messages
    return <p>{message.content}</p>;
  };
  
  return (
    <div 
      className={`mb-4 flex ${isCurrentUserMessage ? 'justify-end' : 'justify-start'}`}
    >
      <div className="max-w-[80%]">
        {/* Message bubble */}
        <div 
          className={`px-4 py-3 rounded-2xl ${
            isClientMessage 
              ? 'bg-[#FEF7CD] text-navy' 
              : 'bg-[#9b87f5] text-white'
          }`}
        >
          {renderMessageContent()}
        </div>
        
        {/* Message metadata */}
        <div 
          className={`flex items-center mt-1 text-xs text-gray-500 ${
            isCurrentUserMessage ? 'justify-end' : 'justify-start'
          }`}
        >
          <span>{formatTime(message.timestamp)}</span>
          {message.isEdited && <span className="ml-1">(edited)</span>}
          {isCurrentUserMessage && message.isRead && (
            <Check size={12} className="ml-1 text-blue-500" />
          )}
          
          {/* Edit/Delete dropdown - only for client's own messages */}
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