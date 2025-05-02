
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Bell, 
  Globe, 
  Accessibility, 
  CheckCircle, 
  UserRound, 
  FileText, 
  HelpCircle,
  Pen
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";

const Settings = () => {
  const { user } = useUser();
  const [email, setEmail] = useState("james.lockhart@example.com");
  const [phone, setPhone] = useState("(555) 123-4567");
  
  // Menu items for the left sidebar
  const menuItems = [
    { icon: <UserRound className="h-5 w-5" />, label: "Edit Profile", active: true },
    { icon: <Bell className="h-5 w-5" />, label: "Notifications", active: false },
    { icon: <Globe className="h-5 w-5" />, label: "Language", active: false },
    { icon: <Accessibility className="h-5 w-5" />, label: "Accessibility", active: false },
    { icon: <CheckCircle className="h-5 w-5" />, label: "Verification", active: false },
    { icon: <UserRound className="h-5 w-5" />, label: "Account Status", active: false },
    { icon: <FileText className="h-5 w-5" />, label: "Export/Delete Data", active: false },
    { icon: <HelpCircle className="h-5 w-5" />, label: "Help", active: false },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left sidebar menu */}
          <div className="w-full md:w-1/4 bg-white border-r">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Settings</h2>
              <div className="space-y-1">
                {menuItems.map((item, index) => (
                  <div 
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-md cursor-pointer ${
                      item.active 
                        ? "bg-blue-100" 
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right content area */}
          <div className="w-full md:w-3/4 bg-blue-50">
            {/* Header */}
            <div className="bg-blue-100 p-4">
              <h3 className="text-xl font-semibold">Edit Profile</h3>
            </div>
            
            {/* Profile content */}
            <div className="p-8">
              {/* Profile picture */}
              <div className="flex flex-col items-center mb-8">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-2 bg-gray-200">
                    <img 
                      src="/avatar-client.png" 
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://ui-avatars.com/api/?name=James+Lockhart&background=random";
                      }}
                    />
                  </div>
                  <button className="absolute bottom-0 right-0 bg-white p-1 rounded-full border border-gray-300">
                    <Pen className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-xl">James Lockhart</h3>
                </div>
              </div>
              
              {/* Personal Information */}
              <div className="mb-8">
                <h4 className="font-semibold text-lg mb-3">Personal Information</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                    <Input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Phone</label>
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="bg-white"
                    />
                  </div>
                </div>
              </div>
              
              {/* Health Information */}
              <div className="mb-8">
                <h4 className="font-semibold text-lg mb-3">Health Information</h4>
                <div className="flex items-center text-blue-600">
                  <span>View my health portal</span>
                  <span className="ml-2">→</span>
                </div>
              </div>
              
              {/* Account Management */}
              <div className="mb-8">
                <h4 className="font-semibold text-lg mb-3">Suspend/Delete Account</h4>
                <div className="flex items-center text-blue-600">
                  <span>Feedback form</span>
                  <span className="ml-2">→</span>
                </div>
              </div>
              
              {/* Save button */}
              <div className="flex justify-end">
                <Button className="bg-gray-600 hover:bg-gray-700">
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
