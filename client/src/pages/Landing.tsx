import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/layout/Navbar";
import { 
  Heart, 
  Shield, 
  MessageCircle, 
  Search, 
  Home,
  Users,
  Star,
  CheckCircle,
  ArrowRight,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from "lucide-react";

export default function Landing() {
  const features = [
    {
      icon: Heart,
      title: "Compatibility Matching",
      description: "Advanced algorithm matches you based on lifestyle, habits, and personality traits",
      color: "text-primary"
    },
    {
      icon: Shield,
      title: "Trust & Safety",
      description: "KYC verification, reviews, and background checks ensure safe connections",
      color: "text-secondary"
    },
    {
      icon: MessageCircle,
      title: "Smart Communication",
      description: "In-app messaging, video calls, and scheduling tools for seamless interaction",
      color: "text-accent"
    }
  ];

  const mockListings = [
    {
      id: 1,
      title: "Spacious Room in Koramangala",
      location: "Koramangala 5th Block, Bangalore",
      rent: "₹12,000",
      compatibility: 94,
      tags: ["Night Owl", "Vegetarian", "Non-Smoker"],
      owner: "Priya S.",
      profession: "Software Engineer",
      image: "https://images.unsplash.com/photo-1556020685-ae41abfc9365?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
    },
    {
      id: 2,
      title: "Cozy Room near IT Parks",
      location: "HSR Layout, Bangalore",
      rent: "₹8,500",
      compatibility: 87,
      tags: ["Early Bird", "Non-Veg", "Social"],
      owner: "Rahul M.",
      profession: "Marketing Executive",
      image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
    },
    {
      id: 3,
      title: "Minimalist Studio Apartment",
      location: "Whitefield, Bangalore",
      rent: "₹15,000",
      compatibility: 92,
      tags: ["Minimalist", "Quiet", "Remote Work"],
      owner: "Sarah K.",
      profession: "UX Designer",
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-gradient text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Find Your Perfect Roommate Match
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Connect with compatible roommates based on lifestyle, habits, and preferences. More than just location and budget.
              </p>
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <a href="/api/login">
                    <Button 
                      size="lg" 
                      className="w-full bg-white text-primary hover:bg-gray-50 font-semibold flex items-center justify-center space-x-2"
                    >
                      <Search className="w-5 h-5" />
                      <span>Find a Room</span>
                    </Button>
                  </a>
                  <a href="/api/login">
                    <Button 
                      size="lg" 
                      className="w-full bg-secondary hover:bg-secondary/90 font-semibold flex items-center justify-center space-x-2"
                    >
                      <Home className="w-5 h-5" />
                      <span>List Your Space</span>
                    </Button>
                  </a>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Compatibility Score</div>
                      <div className="text-2xl font-bold">96%</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white/10 p-3 rounded-lg text-center">
                      <div className="w-6 h-6 mx-auto mb-1">🌙</div>
                      <div className="text-xs">Night Owl</div>
                    </div>
                    <div className="bg-white/10 p-3 rounded-lg text-center">
                      <div className="w-6 h-6 mx-auto mb-1">🌱</div>
                      <div className="text-xs">Vegetarian</div>
                    </div>
                    <div className="bg-white/10 p-3 rounded-lg text-center">
                      <div className="w-6 h-6 mx-auto mb-1">🚭</div>
                      <div className="text-xs">Non-Smoker</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Find a Mate?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We go beyond basic matching to help you find truly compatible living partners
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Type Selection */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Path
            </h2>
            <p className="text-xl text-gray-600">
              Are you looking for a room or do you have space to share?
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Room Seeker Card */}
            <Card className="border-2 border-transparent hover:border-primary transition-all cursor-pointer">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Room Seeker</h3>
                <p className="text-gray-600 mb-6">Looking for a room or shared accommodation</p>
                
                <div className="space-y-3 text-left mb-8">
                  {[
                    "Browse available rooms",
                    "Filter by lifestyle preferences", 
                    "Get compatibility scores",
                    "Connect with room owners"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <CheckCircle className="w-4 h-4 text-secondary" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
                
                <a href="/api/login" className="block">
                  <Button className="w-full" size="lg">
                    Start as Room Seeker
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </a>
              </CardContent>
            </Card>
            
            {/* Room Owner Card */}
            <Card className="border-2 border-transparent hover:border-secondary transition-all cursor-pointer">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Home className="w-10 h-10 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Room Owner</h3>
                <p className="text-gray-600 mb-6">Have space and looking for the right roommate</p>
                
                <div className="space-y-3 text-left mb-8">
                  {[
                    "List your available space",
                    "Set compatibility preferences",
                    "Review matched seekers",
                    "Screen potential roommates"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <CheckCircle className="w-4 h-4 text-secondary" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
                
                <a href="/api/login" className="block">
                  <Button className="w-full bg-secondary hover:bg-secondary/90" size="lg">
                    Start as Room Owner
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Room Listings</h2>
            <p className="text-xl text-gray-600">Discover spaces that match your lifestyle</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockListings.map((listing) => (
              <Card key={listing.id} className="hover:shadow-xl transition-shadow">
                <div className="aspect-video overflow-hidden rounded-t-lg">
                  <img 
                    src={listing.image}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold">{listing.title}</h3>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">{listing.rent}</div>
                      <div className="text-xs text-gray-500">per month</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-4">
                    <div className="w-4 h-4 mr-2">📍</div>
                    <span className="text-sm">{listing.location}</span>
                  </div>
                  
                  <div className="compatibility-score p-3 rounded-lg mb-4">
                    <div className="flex items-center justify-between text-white">
                      <span className="text-sm font-medium">Compatibility Score</span>
                      <span className="text-lg font-bold">{listing.compatibility}%</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {listing.tags.map((tag, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 text-sm font-medium">
                        {listing.owner[0]}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium">{listing.owner}</div>
                      <div className="text-xs text-gray-500">{listing.profession}</div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <a href="/api/login" className="flex-1">
                      <Button className="w-full" size="sm">
                        View Details
                      </Button>
                    </a>
                    <Button variant="outline" size="sm">
                      ♥
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <a href="/api/login">
              <Button size="lg">
                View All Listings
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Find a Mate</h3>
              <p className="text-gray-300 mb-6">
                Connecting compatible roommates through smart matching and trusted connections.
              </p>
              <div className="flex space-x-4">
                {[
                  { icon: Facebook, href: "#" },
                  { icon: Twitter, href: "#" },
                  { icon: Instagram, href: "#" },
                  { icon: Linkedin, href: "#" }
                ].map((social, idx) => (
                  <a key={idx} href={social.href} className="text-gray-300 hover:text-white">
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
            
            {[
              {
                title: "For Seekers",
                links: ["Browse Rooms", "Compatibility Matching", "Safety Tips", "Success Stories"]
              },
              {
                title: "For Owners", 
                links: ["List Your Space", "Tenant Screening", "Pricing Guide", "Legal Support"]
              },
              {
                title: "Support",
                links: ["Help Center", "Contact Us", "Privacy Policy", "Terms of Service"]
              }
            ].map((section, idx) => (
              <div key={idx}>
                <h4 className="font-semibold mb-4">{section.title}</h4>
                <ul className="space-y-2 text-gray-300">
                  {section.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <a href="#" className="hover:text-white">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-300">
            <p>&copy; 2024 Find a Mate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
