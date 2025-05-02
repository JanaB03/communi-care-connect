
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Phone, Home, Users, FileText, Heart } from "lucide-react";

const Resources = () => {
  return (
    <div className="container mx-auto px-4 py-6 animate-fade-in">
      <h1 className="text-2xl md:text-3xl font-bold text-navy mb-6">Resources</h1>
      
      <Tabs defaultValue="housing" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="housing">Housing</TabsTrigger>
          <TabsTrigger value="health">Health</TabsTrigger>
          <TabsTrigger value="food">Food</TabsTrigger>
          <TabsTrigger value="legal">Legal</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="housing">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ResourceCard 
              title="Emergency Shelter" 
              description="Same-day shelter options throughout the city"
              icon={<Home />}
              tags={["No Wait List", "Same Day"]}
            />
            <ResourceCard 
              title="Transitional Housing" 
              description="90-day housing programs with case management"
              icon={<Home />}
              tags={["Application Required"]}
            />
            <ResourceCard 
              title="Housing First Program" 
              description="Permanent supportive housing opportunities"
              icon={<Home />}
              tags={["Application Required", "Case Manager Referral"]}
            />
            <ResourceCard 
              title="Rental Assistance" 
              description="Financial assistance for rent and utilities"
              icon={<FileText />}
              tags={["Application Required"]}
            />
            <ResourceCard 
              title="Housing Navigation" 
              description="One-on-one support to find housing"
              icon={<Users />}
              tags={["Walk-in Welcome"]}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="health">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ResourceCard 
              title="Mobile Health Clinic" 
              description="Free healthcare services at various locations"
              icon={<Heart />}
              tags={["No Insurance Required", "Walk-in Welcome"]}
            />
            <ResourceCard 
              title="Mental Health Services" 
              description="Counseling and psychiatric services"
              icon={<Heart />}
              tags={["Appointment Needed"]}
            />
            <ResourceCard 
              title="Addiction Recovery" 
              description="Substance use disorder treatment programs"
              icon={<Heart />}
              tags={["Walk-in Welcome", "24/7"]}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="food">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ResourceCard 
              title="Community Kitchen" 
              description="Daily hot meals served at multiple locations"
              icon={<Heart />}
              tags={["No Requirements", "Daily"]}
            />
            <ResourceCard 
              title="Food Pantry" 
              description="Weekly groceries and essentials"
              icon={<Heart />}
              tags={["ID Required"]}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="legal">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ResourceCard 
              title="Legal Aid Clinic" 
              description="Free legal consultation and representation"
              icon={<FileText />}
              tags={["Appointment Needed"]}
            />
            <ResourceCard 
              title="Legal Document Assistance" 
              description="Help with ID, birth certificates, and other documents"
              icon={<FileText />}
              tags={["Walk-in Welcome"]}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="documents">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ResourceCard 
              title="ID Services" 
              description="Get help obtaining state ID, birth certificates, and other vital documents"
              icon={<FileText />}
              tags={["Appointment Recommended"]}
            />
            <ResourceCard 
              title="Document Storage" 
              description="Secure storage for important personal documents"
              icon={<FileText />}
              tags={["No Appointment Needed"]}
            />
          </div>
        </TabsContent>
      </Tabs>
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Need Help Now?</CardTitle>
          <CardDescription>Contact our 24/7 support line or visit a drop-in center</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center">
              <Phone className="h-8 w-8 text-orange mr-4" />
              <div>
                <h3 className="font-bold text-lg">Crisis Support Line</h3>
                <p className="text-blue-600">(800) 555-HELP</p>
              </div>
            </div>
            <Button className="bg-orange hover:bg-orange/90">
              Call Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const ResourceCard = ({ 
  title, 
  description, 
  icon, 
  tags = [] 
}: { 
  title: string; 
  description: string;
  icon: React.ReactNode;
  tags?: string[];
}) => {
  return (
    <Card className="h-full transition-all hover:shadow-md">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="bg-purple/10 p-3 rounded-full text-purple">
            {icon}
          </div>
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <span 
              key={i} 
              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-4">
          <Button variant="outline" className="w-full">Learn More</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Resources;
