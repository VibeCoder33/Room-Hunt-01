import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/layout/Navbar";
import ProfileForm from "@/components/forms/ProfileForm";
import RoomListingForm from "@/components/forms/RoomListingForm";
import { ProfileTags } from "@/components/ui/lifestyle-tags";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { User, Home, Settings, Plus, Edit, Trash2, MapPin } from "lucide-react";
import type { UserProfile, InsertUserProfile, RoomListing, InsertRoomListing } from "@shared/schema";

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("profile");
  const [editingListing, setEditingListing] = useState<RoomListing | null>(null);
  const [showListingForm, setShowListingForm] = useState(false);

  // Fetch user profile
  const { data: profile, isLoading: profileLoading } = useQuery<UserProfile>({
    queryKey: ["/api/profile"],
  });

  // Fetch user's listings (for room owners)
  const { data: listings = [] } = useQuery<RoomListing[]>({
    queryKey: ["/api/listings"],
    select: (data) => data.filter(listing => listing.ownerId === user?.id),
  });

  // Profile mutation
  const profileMutation = useMutation({
    mutationFn: async (data: InsertUserProfile) => {
      const response = await apiRequest("POST", "/api/profile", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      console.error("Profile update error:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  // Listing mutation
  const listingMutation = useMutation({
    mutationFn: async (data: InsertRoomListing) => {
      const url = editingListing ? `/api/listings/${editingListing.id}` : "/api/listings";
      const method = editingListing ? "PUT" : "POST";
      const response = await apiRequest(method, url, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/listings"] });
      setShowListingForm(false);
      setEditingListing(null);
      toast({
        title: "Success",
        description: editingListing ? "Listing updated successfully" : "Listing created successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      console.error("Listing error:", error);
      toast({
        title: "Error",
        description: "Failed to save listing",
        variant: "destructive",
      });
    },
  });

  // Delete listing mutation
  const deleteMutation = useMutation({
    mutationFn: async (listingId: number) => {
      await apiRequest("DELETE", `/api/listings/${listingId}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/listings"] });
      toast({
        title: "Success",
        description: "Listing deleted successfully",
      });
    },
    onError: (error) => {
      console.error("Delete error:", error);
      toast({
        title: "Error",
        description: "Failed to delete listing",
        variant: "destructive",
      });
    },
  });

  const handleProfileSubmit = (data: InsertUserProfile) => {
    profileMutation.mutate(data);
  };

  const handleListingSubmit = (data: InsertRoomListing) => {
    listingMutation.mutate(data);
  };

  const handleEditListing = (listing: RoomListing) => {
    setEditingListing(listing);
    setShowListingForm(true);
    setActiveTab("listings");
  };

  const handleDeleteListing = (listingId: number) => {
    if (confirm("Are you sure you want to delete this listing?")) {
      deleteMutation.mutate(listingId);
    }
  };

  const handleAddListing = () => {
    setEditingListing(null);
    setShowListingForm(true);
    setActiveTab("listings");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile & Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your profile information and room listings
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="listings" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              My Listings
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            {profile && !profileLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto">
                      <span className="text-white text-2xl font-bold">
                        {profile.fullName?.[0] || user?.firstName?.[0] || "U"}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{profile.fullName}</h3>
                      <p className="text-gray-600">{profile.profession}</p>
                      <p className="text-sm text-gray-500">{profile.age} years old</p>
                    </div>
                    <Badge variant="secondary" className="text-sm">
                      {profile.userType === "room_seeker" ? "Room Seeker" : "Room Owner"}
                    </Badge>
                    
                    {profile && (
                      <div className="mt-4">
                        <ProfileTags profile={profile} />
                      </div>
                    )}

                    {profile.bio && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg text-left">
                        <h4 className="font-medium text-sm mb-2">About</h4>
                        <p className="text-sm text-gray-700">{profile.bio}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Profile Form */}
                <div className="lg:col-span-2">
                  <ProfileForm
                    profile={profile}
                    onSubmit={handleProfileSubmit}
                    isLoading={profileMutation.isPending}
                  />
                </div>
              </div>
            ) : (
              <ProfileForm
                onSubmit={handleProfileSubmit}
                isLoading={profileMutation.isPending || profileLoading}
              />
            )}
          </TabsContent>

          {/* Listings Tab */}
          <TabsContent value="listings" className="space-y-6">
            {showListingForm ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">
                    {editingListing ? "Edit Listing" : "Create New Listing"}
                  </h2>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowListingForm(false);
                      setEditingListing(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
                <RoomListingForm
                  listing={editingListing || undefined}
                  onSubmit={handleListingSubmit}
                  isLoading={listingMutation.isPending}
                />
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">My Listings</h2>
                  <Button onClick={handleAddListing}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Listing
                  </Button>
                </div>

                {listings.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No listings yet</h3>
                      <p className="text-gray-600 mb-6">
                        Create your first listing to start connecting with potential roommates
                      </p>
                      <Button onClick={handleAddListing}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create First Listing
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {listings.map((listing) => (
                      <Card key={listing.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-semibold mb-2">{listing.title}</h3>
                              <div className="flex items-center text-gray-600 mb-2">
                                <MapPin className="w-4 h-4 mr-1" />
                                <span className="text-sm">{listing.location}</span>
                              </div>
                              <div className="text-2xl font-bold text-primary">₹{listing.rent}</div>
                              <div className="text-sm text-gray-500">per month</div>
                            </div>
                            <Badge variant={listing.isActive ? "default" : "secondary"}>
                              {listing.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>

                          {listing.description && (
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                              {listing.description}
                            </p>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                              Room Type: {listing.roomType}
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditListing(listing)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteListing(listing.id)}
                                disabled={deleteMutation.isPending}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Profile Visibility</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Show my profile to potential matches</div>
                        <div className="text-sm text-gray-600">
                          Your profile will be visible in search results and recommendations
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        {profile?.isActive ? "Enabled" : "Disabled"}
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Privacy Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Contact Information</div>
                        <div className="text-sm text-gray-600">
                          Control who can see your contact details
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Matches Only
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Account Actions</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Download My Data</div>
                        <div className="text-sm text-gray-600">
                          Export all your data from Find a Mate
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Download
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-red-600">Delete Account</div>
                        <div className="text-sm text-gray-600">
                          Permanently delete your account and all data
                        </div>
                      </div>
                      <Button variant="destructive" size="sm">
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
