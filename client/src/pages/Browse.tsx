import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navbar from "@/components/layout/Navbar";
import { CompatibilityBadge } from "@/components/ui/compatibility-score";
import { ProfileTags } from "@/components/ui/lifestyle-tags";
import { 
  Search, 
  Filter, 
  MapPin, 
  Heart, 
  MessageCircle,
  User,
  SlidersHorizontal
} from "lucide-react";
import { calculateCompatibilityScore } from "@/lib/compatibility";
import { useAuth } from "@/hooks/useAuth";
import type { RoomListing, UserProfile } from "@shared/schema";
import type { FilterOptions } from "@/types";

export default function Browse() {
  const { user } = useAuth();
  const [filters, setFilters] = useState<FilterOptions>({
    location: "",
    budgetMin: "",
    budgetMax: "",
    lifestyle: "",
    genderPreference: "",
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Fetch user profile for compatibility calculation
  const { data: userProfile } = useQuery<UserProfile>({
    queryKey: ["/api/profile"],
  });

  // Fetch listings with filters
  const { data: listings = [], isLoading } = useQuery<RoomListing[]>({
    queryKey: ["/api/listings", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.location) params.set("location", filters.location);
      if (filters.budgetMin) params.set("budgetMin", filters.budgetMin);
      if (filters.budgetMax) params.set("budgetMax", filters.budgetMax);
      
      const response = await fetch(`/api/listings?${params.toString()}`, {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch listings");
      }
      
      return response.json();
    },
  });

  // Fetch owner profiles for compatibility scores
  const { data: ownerProfiles = [] } = useQuery<UserProfile[]>({
    queryKey: ["/api/admin/profiles"],
    retry: false,
  });

  const getOwnerProfile = (ownerId: string) => {
    return ownerProfiles.find(profile => profile.userId === ownerId);
  };

  const getCompatibilityScore = (listing: RoomListing) => {
    if (!userProfile) return 50;
    
    const ownerProfile = getOwnerProfile(listing.ownerId);
    if (!ownerProfile) return 50;
    
    const result = calculateCompatibilityScore(userProfile, ownerProfile);
    return result.score;
  };

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      location: "",
      budgetMin: "",
      budgetMax: "",
      lifestyle: "",
      genderPreference: "",
    });
  };

  const sortedListings = [...listings].sort((a, b) => {
    const scoreA = getCompatibilityScore(a);
    const scoreB = getCompatibilityScore(b);
    return scoreB - scoreA; // Sort by compatibility score descending
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Browse Rooms</h1>
          <p className="text-gray-600 mt-2">
            Discover compatible roommates and perfect living spaces
          </p>
        </div>

        {/* Filter Bar */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Basic Filters */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <Input
                    placeholder="Location (e.g. Koramangala)"
                    value={filters.location}
                    onChange={(e) => handleFilterChange("location", e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <Input
                    type="number"
                    placeholder="Min Budget (₹)"
                    value={filters.budgetMin}
                    onChange={(e) => handleFilterChange("budgetMin", e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <Input
                    type="number"
                    placeholder="Max Budget (₹)"
                    value={filters.budgetMax}
                    onChange={(e) => handleFilterChange("budgetMax", e.target.value)}
                    className="w-full"
                  />
                </div>

                <div>
                  <Select value={filters.lifestyle} onValueChange={(value) => handleFilterChange("lifestyle", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Lifestyle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any Lifestyle</SelectItem>
                      <SelectItem value="night_owl">Night Owl</SelectItem>
                      <SelectItem value="early_bird">Early Bird</SelectItem>
                      <SelectItem value="social">Social</SelectItem>
                      <SelectItem value="quiet">Quiet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex space-x-2">
                  <Button className="flex-1">
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Advanced Filters */}
              {showAdvancedFilters && (
                <div className="border-t pt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Select value={filters.genderPreference} onValueChange={(value) => handleFilterChange("genderPreference", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Gender Preference" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Any Gender</SelectItem>
                        <SelectItem value="male">Male Only</SelectItem>
                        <SelectItem value="female">Female Only</SelectItem>
                        <SelectItem value="mixed">Mixed</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Room Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Any Type</SelectItem>
                        <SelectItem value="private">Private Room</SelectItem>
                        <SelectItem value="shared">Shared Room</SelectItem>
                        <SelectItem value="studio">Studio</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Amenities" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Any Amenities</SelectItem>
                        <SelectItem value="wifi">WiFi</SelectItem>
                        <SelectItem value="ac">AC</SelectItem>
                        <SelectItem value="parking">Parking</SelectItem>
                        <SelectItem value="gym">Gym</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button variant="outline" onClick={clearFilters}>
                      Clear All Filters
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">
              {isLoading ? "Loading..." : `${sortedListings.length} results found`}
            </h2>
            <p className="text-sm text-gray-600">
              Sorted by compatibility score
            </p>
          </div>
          
          <Select defaultValue="compatibility">
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="compatibility">Best Match</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Listings Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, idx) => (
              <Card key={idx} className="animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-t-lg"></div>
                <CardContent className="p-6 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                  <div className="flex space-x-2">
                    <div className="h-6 bg-gray-200 rounded flex-1"></div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : sortedListings.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No listings found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your filters or search in a different location
              </p>
              <Button onClick={clearFilters}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedListings.map((listing) => {
              const ownerProfile = getOwnerProfile(listing.ownerId);
              const compatibilityScore = getCompatibilityScore(listing);
              
              return (
                <Card key={listing.id} className="hover:shadow-xl transition-shadow cursor-pointer">
                  <div className="aspect-video overflow-hidden rounded-t-lg bg-gray-200">
                    {listing.images && listing.images.length > 0 ? (
                      <img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold line-clamp-1">{listing.title}</h3>
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">₹{listing.rent}</div>
                        <div className="text-xs text-gray-500">per month</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="text-sm line-clamp-1">{listing.location}</span>
                    </div>
                    
                    {/* Compatibility Score */}
                    <div className="mb-4">
                      <CompatibilityBadge score={compatibilityScore} />
                    </div>
                    
                    {/* Owner Info & Lifestyle Tags */}
                    {ownerProfile && (
                      <>
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 text-sm font-medium">
                              {ownerProfile.fullName?.[0] || "U"}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium">{ownerProfile.fullName}</div>
                            <div className="text-xs text-gray-500">{ownerProfile.profession}</div>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <ProfileTags profile={ownerProfile} />
                        </div>
                      </>
                    )}
                    
                    {/* Room Details */}
                    <div className="text-sm text-gray-600 mb-4">
                      <div>Type: {listing.roomType}</div>
                      {listing.availableFrom && (
                        <div>Available: {new Date(listing.availableFrom).toLocaleDateString()}</div>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Button className="flex-1" size="sm">
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <Heart className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Load More */}
        {sortedListings.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Results
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
