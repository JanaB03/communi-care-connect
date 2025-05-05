import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/contexts/UserContext";
import { ArrowRight, Bell, Calendar, CheckCircle, MapPin, MessageCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const ClientDashboard = () => {
  const { user } = useUser();
  const isMobile = useIsMobile();
  const [date] = useState(new Date());

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="container mx-auto px-4 py-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-navy">Welcome back, {user?.name.split(' ')[0]}</h1>
          <p className="text-gray-600">{formatDate(date)}</p>
        </div>
      </div>

      {/* Quick Actions Section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <span className="text-orange mr-2">⚡</span> Quick Actions
          </h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/client#check-in" className="block">
            <div className="action-card bg-navy">
              <div className="rounded-full bg-white/20 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <CheckCircle className="text-white" size={24} />
              </div>
              <h3 className="font-medium">Check In Now</h3>
            </div>
          </Link>
          
          <Link to="/chat" className="block">
            <div className="action-card bg-orange">
              <div className="rounded-full bg-white/20 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <MessageCircle className="text-white" size={24} />
              </div>
              <h3 className="font-medium">Messages</h3>
            </div>
          </Link>
          
          <Link to="/map" className="block">
            <div className="action-card bg-sky-blue">
              <div className="rounded-full bg-white/20 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <MapPin className="text-white" size={24} />
              </div>
              <h3 className="font-medium">Share Location</h3>
            </div>
          </Link>
          
          <Link to="/resources" className="block">
            <div className="action-card bg-gold">
              <div className="rounded-full bg-white/20 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <MapPin className="text-white" size={24} />
              </div>
              <h3 className="font-medium">Find Services</h3>
            </div>
          </Link>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Today's Updates */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-semibold">Today's Updates</CardTitle>
            <span className="text-sm text-gray-500">April 28</span>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 flex">
                <div className="mr-4 text-blue-500">
                  <Bell size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-navy">Mobile Clinic Today</h3>
                  <p className="text-sm text-gray-600">Old Town Station from 10am-2pm</p>
                </div>
              </div>
              
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-100 flex">
                <div className="mr-4 text-amber-500">
                  <Bell size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-navy">Weather Alert</h3>
                  <p className="text-sm text-gray-600">Rain tonight. Extra beds at Imperial Street Shelter.</p>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button variant="ghost" size="sm" className="text-orange">
                  See All Updates <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Your Appointments */}
        <Card id="appointments">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-semibold">Your Appointments</CardTitle>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-1" /> Add New
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
                    <h3 className="font-medium text-navy">Case Manager Meeting</h3>
                    <span className="text-sm text-gray-500">Tomorrow at 2:00 PM</span>
                  </div>
                  <p className="text-sm text-gray-600">Central Library, 2nd Floor</p>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button variant="ghost" size="sm" className="text-orange">
                  Add Appointment Reminder <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Role Switch Button */}
      <div className="mt-8 flex justify-center">
        <Link to="/staff">
          <Button variant="outline" className="w-full md:w-auto border-navy text-navy hover:bg-navy/5">
            Switch to Staff View
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ClientDashboard;