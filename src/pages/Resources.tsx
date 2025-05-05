import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Home, Heart, FileText, Search, MapPin } from "lucide-react";

const Resources = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Feature cards for the top section
  const featureCards = [
    {
      title: "Policy Updates",
      icon: <FileText className="h-6 w-6 text-white" />,
      color: "bg-purple-600",
    },
    {
      title: "Housing Search",
      icon: <Home className="h-6 w-6 text-white" />,
      color: "bg-purple-600",
    },
    {
      title: "Getting Phone Access",
      icon: <BookOpen className="h-6 w-6 text-white" />,
      color: "bg-purple-600",
    },
  ];

  // Resource cards for the bottom section
  const resourceCards = [
    {
      name: "Day Center",
      description: "Drop-in center with showers, meals, and case management",
      tags: ["No Wait List", "Same Day"],
    },
    {
      name: "Imperial Street Shelter",
      description: "90-day housing program with on-site support services",
      tags: ["Application Required"],
    },
    {
      name: "Housing First Program",
      description: "Permanent supportive housing opportunities",
      tags: ["Application Required", "Case Manager Referral"],
    },
    {
      name: "Central Library Resources",
      description: "Computer access, job search assistance, and resource navigation",
      tags: ["Walk-in Welcome"],
    },
    {
      name: "Old Town Station Mobile Clinic",
      description: "Free healthcare services available Tuesday and Thursday",
      tags: ["No Insurance Required", "Walk-in Welcome"],
    },
    {
      name: "Community Food Bank",
      description: "Weekly food distribution at multiple locations",
      tags: ["No ID Required", "Walk-in Welcome"],
    },
  ];
  
  // Topic filters for the left sidebar
  const topicFilters = [
    "Emergency services",
    "Day Centers",
    "Shelters/transitional housing",
    "Permanent housing",
    "Health",
    "Hazards"
  ];
  
  // Location filters for the left sidebar
  const locationFilters = [
    "Imperial Street",
    "Near my location"
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main content container */}
      <div className="container mx-auto px-4 py-6">
        {/* Page title */}
        <h1 className="text-3xl font-bold text-purple-900 text-center mb-8">Resource Library</h1>
        
        {/* Top feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {featureCards.map((card, index) => (
            <div 
              key={index} 
              className="rounded-lg overflow-hidden shadow-md"
            >
              <div className={`${card.color} h-24 w-full`}></div>
              <div className="bg-white p-4 text-center">
                <h3 className="text-navy font-semibold">{card.title}</h3>
              </div>
            </div>
          ))}
        </div>
        
        {/* Search and filters section */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {/* Left sidebar with filters */}
          <div className="w-full md:w-1/4 bg-navy text-white p-4 rounded-md">
            {/* Search box */}
            <div className="relative mb-6">
              <Input 
                className="pl-10 bg-gray-100 text-gray-800"
                placeholder="Search resources"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
            
            {/* Topic filters */}
            <div className="mb-6">
              <h3 className="uppercase text-sm font-bold mb-2">Topic</h3>
              {topicFilters.map((filter, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input type="checkbox" id={`topic-${index}`} className="mr-2" />
                  <label htmlFor={`topic-${index}`} className="text-sm">{filter}</label>
                </div>
              ))}
            </div>
            
            {/* Location filters */}
            <div>
              <h3 className="uppercase text-sm font-bold mb-2">Location</h3>
              {locationFilters.map((filter, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input type="checkbox" id={`location-${index}`} className="mr-2" />
                  <label htmlFor={`location-${index}`} className="text-sm">{filter}</label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right side - resource cards grid */}
          <div className="w-full md:w-3/4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resourceCards.map((resource, index) => (
              <div key={index} className="bg-white rounded-md shadow-md overflow-hidden">
                <div className="h-24 bg-navy/10"></div>
                <div className="p-4">
                  <h3 className="font-semibold text-navy">{resource.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {resource.tags.map((tag, i) => (
                      <span key={i} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Crisis support section */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="font-bold text-xl mb-2">Need Help Now?</h2>
          <p className="text-gray-600 mb-4">Contact our 24/7 support line or visit a drop-in center</p>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center">
              <div className="bg-orange/10 p-3 rounded-full mr-4">
                <BookOpen className="h-6 w-6 text-orange" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Crisis Support Line</h3>
                <p className="text-blue-600">(800) 555-HELP</p>
              </div>
            </div>
            <Button className="bg-orange hover:bg-orange/90">
              Call Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;