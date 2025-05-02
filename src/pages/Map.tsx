
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search, CheckCircle, Phone, Clock, Info } from "lucide-react";
import { useUser } from "@/contexts/UserContext";

const Map = () => {
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock service locations
  const serviceLocations = [
    {
      id: 1,
      name: "Downtown Shelter",
      address: "123 Main Street",
      type: "Shelter",
      hours: "24/7",
      description: "Emergency overnight shelter with 50 beds",
      phone: "(555) 123-4567"
    },
    {
      id: 2,
      name: "Community Health Clinic",
      address: "456 Park Avenue",
      type: "Medical",
      hours: "Mon-Fri: 9am-5pm",
      description: "Free healthcare services including dental and vision",
      phone: "(555) 234-5678"
    },
    {
      id: 3,
      name: "Food Pantry",
      address: "789 Oak Drive",
      type: "Food",
      hours: "Wed & Sat: 10am-2pm",
      description: "Weekly grocery distribution and hot meals",
      phone: "(555) 345-6789"
    },
    {
      id: 4,
      name: "Resource Center",
      address: "321 Elm Street",
      type: "Support Services",
      hours: "Mon-Fri: 8am-6pm",
      description: "Case management, job assistance, and document support",
      phone: "(555) 456-7890"
    }
  ];
  
  // Filter locations based on search query
  const filteredLocations = searchQuery
    ? serviceLocations.filter(location => 
        location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.address.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : serviceLocations;

  return (
    <div className="container mx-auto px-4 py-6 animate-fade-in">
      <div className="flex flex-col md:flex-row mb-6 gap-6">
        <div className="w-full md:w-1/3 space-y-6">
          <h1 className="text-2xl md:text-3xl font-bold text-navy">Service Locations</h1>
          
          {user?.role === "client" && (
            <Card className="border-0 shadow-md">
              <CardContent className="p-4">
                <Button className="w-full bg-sky-blue hover:bg-sky-blue/90 mb-4">
                  <MapPin className="mr-2 h-4 w-4" /> Share My Current Location
                </Button>
                <p className="text-sm text-gray-600">
                  Sharing your location helps your care team provide better support.
                  Your location is only shared with authorized staff members.
                </p>
              </CardContent>
            </Card>
          )}
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              className="pl-10 shadow"
              placeholder="Search for services, locations, or addresses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {filteredLocations.map(location => (
            <Card key={location.id} className="border-0 shadow hover:shadow-md transition-all overflow-hidden">
              <CardHeader className="border-l-4 border-purple bg-gray-50 py-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{location.name}</CardTitle>
                    <p className="text-sm text-gray-500">{location.type}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 text-orange mr-2 mt-0.5" />
                    <p className="text-sm text-gray-600">{location.address}</p>
                  </div>
                  <div className="flex items-start">
                    <Clock className="h-4 w-4 text-navy mr-2 mt-0.5" />
                    <p className="text-sm text-gray-600">{location.hours}</p>
                  </div>
                  <div className="flex items-start">
                    <Phone className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                    <p className="text-sm text-gray-600">{location.phone}</p>
                  </div>
                </div>
                
                <div className="flex justify-between mt-4">
                  <Button variant="outline" size="sm" className="text-navy">
                    <MapPin className="h-4 w-4 mr-1" /> Directions
                  </Button>
                  <Button size="sm" className="bg-purple hover:bg-purple/90">
                    <Info className="h-4 w-4 mr-1" /> Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="w-full md:w-2/3 bg-gray-100 rounded-lg shadow-inner h-[500px] md:h-auto">
          <div className="h-full flex items-center justify-center">
            <div className="text-center p-6">
              <MapPin className="h-12 w-12 text-purple mb-4 mx-auto opacity-50" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">Interactive Map</h3>
              <p className="text-gray-500">An interactive map would be displayed here showing service locations</p>
            </div>
          </div>
        </div>
      </div>
      
      {user?.role === "staff" && (
        <Card className="mb-4 border-0 shadow">
          <CardHeader>
            <CardTitle>Client Locations</CardTitle>
            <CardDescription>View current and recent locations of clients who have shared their location</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div className="flex items-center">
                  <div className="bg-sky-blue/20 p-2 rounded-full mr-3">
                    <MapPin className="h-4 w-4 text-sky-blue" />
                  </div>
                  <div>
                    <p className="font-medium">Jessie Smith</p>
                    <p className="text-sm text-gray-500">Downtown Library • Updated 15 min ago</p>
                  </div>
                </div>
                <Button size="sm">View</Button>
              </div>
              
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div className="flex items-center">
                  <div className="bg-sky-blue/20 p-2 rounded-full mr-3">
                    <MapPin className="h-4 w-4 text-sky-blue" />
                  </div>
                  <div>
                    <p className="font-medium">Taylor Johnson</p>
                    <p className="text-sm text-gray-500">City Park • Updated 1 hour ago</p>
                  </div>
                </div>
                <Button size="sm">View</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Map;
