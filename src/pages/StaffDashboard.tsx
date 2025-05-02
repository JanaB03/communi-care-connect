
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/contexts/UserContext";
import { useChat } from "@/contexts/ChatContext";
import { 
  ArrowRight,
  Bell,
  Calendar,
  CheckCircle, 
  MapPin, 
  MessageCircle,
  Users
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";

const StaffDashboard = () => {
  const { user } = useUser();
  const { threads } = useChat();
  const isMobile = useIsMobile();
  const [date] = useState(new Date());

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

  // Mock data for check-ins
  const checkIns = [
    { 
      id: "checkin-1",
      name: "Jessie Smith", 
      location: "Downtown Center",
      time: new Date(Date.now() - 1800000) // 30 minutes ago
    },
    { 
      id: "checkin-2",
      name: "Taylor Johnson", 
      location: "Mobile Outreach",
      time: new Date(Date.now() - 7200000) // 2 hours ago
    },
    { 
      id: "checkin-3",
      name: "Casey Brown", 
      location: "East Side Shelter",
      time: new Date(Date.now() - 10800000) // 3 hours ago
    }
  ];
  
  // Mock data for locations
  const clientLocations = [
    {
      id: "loc-1",
      name: "Jessie Smith", 
      location: "Downtown Library",
      coordinates: "47.6062° N, 122.3321° W",
      updatedAt: new Date(Date.now() - 900000) // 15 minutes ago
    },
    {
      id: "loc-2",
      name: "Taylor Johnson", 
      location: "City Park", 
      coordinates: "47.6101° N, 122.3420° W",
      updatedAt: new Date(Date.now() - 3600000) // 1 hour ago
    }
  ];

  return (
    <div className="container mx-auto px-4 py-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-navy">Staff Dashboard</h1>
          <p className="text-gray-600">{formatDate(date)}</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button variant="outline" className="mr-2">
            <Bell className="h-4 w-4 mr-1" />
            Alerts
          </Button>
          <Button className="bg-navy hover:bg-navy/90">
            <Users className="h-4 w-4 mr-1" />
            Manage Clients
          </Button>
        </div>
      </div>

      {/* Dashboard Tabs */}
      <Tabs defaultValue="overview" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="check-ins">Check-ins</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="locations">Client Locations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Messages Card */}
            <Card className="md:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold flex items-center">
                  <MessageCircle className="mr-2 h-5 w-5 text-orange" />
                  Recent Messages
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {threads.length > 0 ? (
                    threads.slice(0, 3).map((thread) => (
                      <div key={thread.id} className="flex items-center justify-between group hover:bg-gray-50 p-2 rounded-md">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-3">
                            <AvatarImage src={thread.avatar} alt={thread.participantName} />
                            <AvatarFallback>{thread.participantName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium line-clamp-1">{thread.participantName}</p>
                            <p className="text-xs text-gray-500">
                              {formatTime(thread.lastMessageTime)}
                            </p>
                          </div>
                        </div>
                        {thread.unreadCount > 0 && (
                          <span className="bg-orange text-white text-xs px-2 py-0.5 rounded-full">
                            {thread.unreadCount}
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No recent messages</p>
                  )}
                  
                  <Link to="/chat">
                    <Button variant="ghost" size="sm" className="text-orange w-full">
                      View All Messages <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Check-ins Card */}
            <Card className="md:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-purple" />
                  Recent Check-ins
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {checkIns.map((checkin) => (
                    <div key={checkin.id} className="flex items-center justify-between group hover:bg-gray-50 p-2 rounded-md">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-3">
                          <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(checkin.name)}&background=random`} alt={checkin.name} />
                          <AvatarFallback>{checkin.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium line-clamp-1">{checkin.name}</p>
                          <p className="text-xs text-gray-500">
                            {checkin.location} • {formatTime(checkin.time)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button variant="ghost" size="sm" className="text-purple w-full">
                    View All Check-ins <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Client Locations Card */}
            <Card className="md:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold flex items-center">
                  <MapPin className="mr-2 h-5 w-5 text-sky-blue" />
                  Client Locations
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {clientLocations.map((loc) => (
                    <div key={loc.id} className="flex items-center justify-between group hover:bg-gray-50 p-2 rounded-md">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-3">
                          <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(loc.name)}&background=random`} alt={loc.name} />
                          <AvatarFallback>{loc.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium line-clamp-1">{loc.name}</p>
                          <p className="text-xs text-gray-500">
                            {loc.location}
                          </p>
                        </div>
                      </div>
                      <Link to="/map">
                        <Button variant="ghost" size="sm" className="text-sky-blue">
                          <MapPin className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  ))}
                  
                  <Link to="/map">
                    <Button variant="ghost" size="sm" className="text-sky-blue w-full">
                      View All Locations <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="check-ins">
          <Card>
            <CardHeader>
              <CardTitle>Client Check-ins</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Recent client check-ins at various locations.</p>
              <div className="space-y-4">
                {checkIns.map((checkin) => (
                  <div key={checkin.id} className="flex items-center justify-between border-b pb-4 last:border-b-0">
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-4">
                        <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(checkin.name)}&background=random`} alt={checkin.name} />
                        <AvatarFallback>{checkin.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{checkin.name}</p>
                        <p className="text-sm text-gray-500">
                          {checkin.location} • {formatTime(checkin.time)}
                        </p>
                      </div>
                    </div>
                    <div>
                      <Button variant="outline" size="sm" className="mr-2">
                        View Details
                      </Button>
                      <Link to="/chat">
                        <Button size="sm">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Message
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle>Client Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Recent messages from clients.</p>
              <div className="space-y-4">
                {threads.map((thread) => (
                  <div key={thread.id} className="flex items-center justify-between border-b pb-4 last:border-b-0">
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-4">
                        <AvatarImage src={thread.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(thread.participantName)}&background=random`} alt={thread.participantName} />
                        <AvatarFallback>{thread.participantName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{thread.participantName}</p>
                        <p className="text-sm text-gray-500">
                          Last message at {formatTime(thread.lastMessageTime)}
                        </p>
                      </div>
                    </div>
                    <div>
                      <Link to="/chat">
                        <Button size="sm">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          View Conversation
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="locations">
          <Card>
            <CardHeader>
              <CardTitle>Client Locations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Current known locations of clients.</p>
              <div className="space-y-4">
                {clientLocations.map((loc) => (
                  <div key={loc.id} className="flex items-center justify-between border-b pb-4 last:border-b-0">
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-4">
                        <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(loc.name)}&background=random`} alt={loc.name} />
                        <AvatarFallback>{loc.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{loc.name}</p>
                        <p className="text-sm">Location: {loc.location}</p>
                        <p className="text-xs text-gray-500">
                          Coordinates: {loc.coordinates} • Updated {formatTime(loc.updatedAt)}
                        </p>
                      </div>
                    </div>
                    <div>
                      <Button variant="outline" size="sm" className="mr-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        Map
                      </Button>
                      <Link to="/chat">
                        <Button size="sm">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Contact
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Your Schedule Card */}
      <Card className="mb-8" id="appointments">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl font-semibold">Today's Schedule</CardTitle>
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-1" /> Add Event
          </Button>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-4">
            <div className="p-4 bg-white rounded-lg border flex items-start">
              <div className="mr-4 bg-purple/20 p-2 rounded text-purple">
                <Calendar size={20} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="font-medium text-navy">Team Meeting</h3>
                  <span className="text-sm text-gray-500">9:30 AM - 10:30 AM</span>
                </div>
                <p className="text-sm text-gray-600">Conference Room B</p>
              </div>
            </div>
            
            <div className="p-4 bg-white rounded-lg border flex items-start">
              <div className="mr-4 bg-orange/20 p-2 rounded text-orange">
                <Users size={20} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="font-medium text-navy">Client Session - Jessie Smith</h3>
                  <span className="text-sm text-gray-500">2:00 PM - 3:00 PM</span>
                </div>
                <p className="text-sm text-gray-600">Office 3</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role Switch Button */}
      <div className="mt-8 flex justify-center">
        <Link to="/client">
          <Button variant="outline" className="w-full md:w-auto border-purple text-purple hover:bg-purple/5">
            Switch to Client View
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default StaffDashboard;
