
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search, CheckCircle } from "lucide-react";
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
      description: "Emergency overnight shelter with 50 beds"
    },
    {
      id: 2,
      name: "Community Health Clinic",
      address: "456 Park Avenue",
      type: "Medical",
      hours: "Mon-Fri: 9am-5pm",
      description: "Free healthcare services including dental and vision"
    },
    {
      id: 3,
      name: "Food Pantry",
      address: "789 Oak Drive",
      type: "Food",
      hours: "Wed & Sat: 10am-2pm",
      description: "Weekly grocery distribution and hot meals"
    },
    {
      id: 4,
      name: "Resource Center",
      address: "321 Elm Street",
      type: "Support Services",
      hours: "Mon-Fri: 8am-6pm",
      description: "Case management, job assistance, and document support"
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
      <h1 className="text-2xl md:text-3xl font-bold text-navy mb-4">Service Locations</h1>
      
      {user?.role === "client" && (
        <div className="mb-6">
          <Button className="bg-sky-blue hover:bg-sky-blue/90 mb-4">
            <MapPin className="mr-2 h-4 w-4" /> Share My Current Location
          </Button>
          <p className="text-sm text-gray-600">
            Sharing your location helps your care team provide better support.
            Your location is only shared with authorized staff members.
          </p>
        </div>
      )}
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          className="pl-10"
          placeholder="Search for services, locations, or addresses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredLocations.map(location => (
          <Card key={location.id} className="h-full transition-all hover:shadow-md">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{location.name}</CardTitle>
                  <p className="text-sm text-gray-500">{location.type}</p>
                </div>
                <div className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                  {location.hours}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-start mb-3">
                <MapPin className="h-4 w-4 text-orange mr-2 mt-0.5" />
                <p className="text-sm text-gray-600">{location.address}</p>
              </div>
              <p className="text-sm mb-4">{location.description}</p>
              <div className="flex justify-between mt-4">
                <Button variant="outline" size="sm">
                  <MapPin className="h-4 w-4 mr-1" /> Directions
                </Button>
                <Button size="sm" className="bg-navy hover:bg-navy/90">
                  More Info
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {user?.role === "staff" && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Client Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">View current and recent locations of clients who have shared their location.</p>
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
      
      <div className="p-4 bg-gray-100 rounded-lg text-center">
        <p className="mb-2 text-gray-700">This is a simplified map view. In a production app, an interactive map would be integrated here.</p>
      </div>
    </div>
  );
};

export default Map;
