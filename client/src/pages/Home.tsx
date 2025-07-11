import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/layout/Navbar";
import { CompatibilityScore } from "@/components/ui/compatibility-score";
import { ProfileTags } from "@/components/ui/lifestyle-tags";
import { 
  Home as HomeIcon, 
  Search, 
  MessageCircle, 
  User, 
  Heart,
  MapPin,
  Plus,
  TrendingUp,
  Users,
  Calendar
} from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import type { RoomListing, UserProfile, Match } from "@shared/schema";

export default function Home() {
  const { user } = useAuth();

  // Fetch user profile
  const { data: profile } = useQuery<UserProfile>({
    queryKey: ["/api/profile"],
  });

  // Fetch recent listings
  const { data: listings = [] } = useQuery<RoomListing[]>({
    queryKey: ["/api/listings"],
  });

  // Fetch user matches
  const { data: matches = [] } = useQuery<Match[]>({
    queryKey: ["/api/matches"],
  });

  const recentListings = listings.slice(0, 3);
  const recentMatches = matches.slice(0, 3);

  const getProfileCompleteness = () => {
    if (!profile) return 0;
    
    const fields = [
      profile.fullName,
      profile.age,
      profile.gender,
      profile.profession,
      profile.budgetMin,
      profile.budgetMax,
      profile.sleepSchedule,
      profile.workSchedule,
      profile.dietaryPreference,
      profile.smoking,
      profile.drinking,
      profile.cleanliness,
      profile.bio
    ];
    
    const completedFields = fields.filter(field => field !== null && field !== undefined && field !== "").length;
    return Math.round((completedFields / fields.length) * 100);
  };

  const profileCompleteness = getProfileCompleteness();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName || "User"}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            {profile?.userType === "room_seeker" 
              ? "Let's find you the perfect room and roommate"
              : "Manage your listings and connect with potential roommates"
            }
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold">{profileCompleteness}%</div>
                  <div className="text-sm text-gray-600">Profile Complete</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-secondary" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold">{matches.length}</div>
                  <div className="text-sm text-gray-600">Matches</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-accent" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold">3</div>
                  <div className="text-sm text-gray-600">Messages</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <HomeIcon className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold">{listings.length}</div>
                  <div className="text-sm text-gray-600">Active Listings</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Completion */}
            {profileCompleteness < 80 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Complete Your Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Profile Completion</span>
                      <span className="text-sm text-gray-500">{profileCompleteness}%</span>
                    </div>
                    <Progress value={profileCompleteness} className="h-2" />
                    <p className="text-sm text-gray-600">
                      Complete your profile to get better matches and increase your visibility
                    </p>
                    <Link href="/profile">
                      <Button size="sm">
                        Complete Profile
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link href="/browse">
                    <Button className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                      <Search className="w-6 h-6" />
                      <span>Browse Rooms</span>
                    </Button>
                  </Link>
                  
                  <Link href="/messages">
                    <Button variant="secondary" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                      <MessageCircle className="w-6 h-6" />
                      <span>Messages</span>
                    </Button>
                  </Link>
                  
                  {profile?.userType === "room_owner" && (
                    <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                      <Plus className="w-6 h-6" />
                      <span>Add Listing</span>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Matches */}
            {recentMatches.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Recent Matches
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentMatches.map((match) => (
                      <div key={match.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                            <span className="text-white font-medium">M</span>
                          </div>
                          <div>
                            <div className="font-medium">New Match</div>
                            <div className="text-sm text-gray-600">Compatibility: {match.compatibilityScore}%</div>
                          </div>
                        </div>
                        <Button size="sm">View Profile</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Listings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HomeIcon className="w-5 h-5" />
                  Recent Listings
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentListings.length === 0 ? (
                  <div className="text-center py-8">
                    <HomeIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No listings yet</h3>
                    <p className="text-gray-600 mb-4">Start browsing to find your perfect roommate</p>
                    <Link href="/browse">
                      <Button>Browse Rooms</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentListings.map((listing) => (
                      <div key={listing.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <HomeIcon className="w-8 h-8 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{listing.title}</h3>
                          <div className="flex items-center text-gray-600 text-sm">
                            <MapPin className="w-4 h-4 mr-1" />
                            {listing.location}
                          </div>
                          <div className="text-primary font-semibold">₹{listing.rent}</div>
                        </div>
                        <Button size="sm">View</Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Profile Card */}
            {profile && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Your Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto">
                      <span className="text-white text-xl font-bold">
                        {profile.fullName?.[0] || "U"}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold">{profile.fullName}</h3>
                      <p className="text-sm text-gray-600">{profile.profession}</p>
                      <Badge variant="secondary" className="mt-2">
                        {profile.userType === "room_seeker" ? "Room Seeker" : "Room Owner"}
                      </Badge>
                    </div>
                    {profile && <ProfileTags profile={profile} />}
                    <Link href="/profile" className="block">
                      <Button variant="outline" size="sm" className="w-full">
                        Edit Profile
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Activity Feed */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="text-sm">
                      <span className="font-medium">Profile updated</span>
                      <div className="text-gray-500">2 hours ago</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="text-sm">
                      <span className="font-medium">New message received</span>
                      <div className="text-gray-500">1 day ago</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div className="text-sm">
                      <span className="font-medium">Match found</span>
                      <div className="text-gray-500">2 days ago</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card>
              <CardHeader>
                <CardTitle>💡 Tip of the Day</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Add more details to your bio to help potential roommates understand your lifestyle better. 
                  Mention your hobbies, work schedule, and what you're looking for in a living situation.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
