
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Edit, X, ImageIcon, Mic, Smile, MapPin } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (content: string) => void;
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
      }
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
      <form onSubmit={handleSubmit} className="flex items-center">
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
  );
};
