import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import MessageInterface from "@/components/messaging/MessageInterface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Users, Video, Calendar } from "lucide-react";

export default function Messages() {
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-2">
            Connect safely with potential roommates
          </p>
        </div>

        {/* Communication Tips */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Stay Safe</h3>
              <p className="text-sm text-gray-600">
                Keep conversations in-app until you've met and feel comfortable
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Video className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-semibold mb-2">Video Chat</h3>
              <p className="text-sm text-gray-600">
                Schedule video calls to get to know each other better
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold mb-2">Meet in Public</h3>
              <p className="text-sm text-gray-600">
                Always meet potential roommates in public places first
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Message Interface */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Your Conversations
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <MessageInterface
              selectedPartnerId={selectedPartnerId}
              onSelectPartner={setSelectedPartnerId}
            />
          </CardContent>
        </Card>

        {/* Meeting Scheduler */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Schedule Meetings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Meeting Scheduler</h3>
              <p className="text-gray-600 mb-4">
                Schedule in-person meetings or video calls with potential roommates
              </p>
              <div className="text-sm text-gray-500">
                Feature coming soon! For now, coordinate meetings through messages.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
