import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserProfileSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, MapPin, Heart, Settings } from "lucide-react";
import type { UserProfile, InsertUserProfile } from "@shared/schema";

interface ProfileFormProps {
  profile?: UserProfile;
  onSubmit: (data: InsertUserProfile) => void;
  isLoading?: boolean;
}

export default function ProfileForm({ profile, onSubmit, isLoading }: ProfileFormProps) {
  const form = useForm<InsertUserProfile>({
    resolver: zodResolver(insertUserProfileSchema),
    defaultValues: {
      userType: profile?.userType || "room_seeker",
      fullName: profile?.fullName || "",
      age: profile?.age || "",
      gender: profile?.gender || "",
      profession: profile?.profession || "",
      budgetMin: profile?.budgetMin || undefined,
      budgetMax: profile?.budgetMax || undefined,
      preferredLocations: profile?.preferredLocations || [],
      sleepSchedule: profile?.sleepSchedule || undefined,
      workSchedule: profile?.workSchedule || undefined,
      dietaryPreference: profile?.dietaryPreference || undefined,
      smoking: profile?.smoking || undefined,
      drinking: profile?.drinking || undefined,
      cleanliness: profile?.cleanliness || undefined,
      guestsPolicy: profile?.guestsPolicy || undefined,
      petPreference: profile?.petPreference || undefined,
      stayDuration: profile?.stayDuration || undefined,
      bio: profile?.bio || "",
      isActive: profile?.isActive ?? true,
    },
  });

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold">Create Your Profile</h2>
        <p className="text-muted-foreground mt-2">Help us find your perfect roommate match</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* User Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                I am a...
              </CardTitle>
              <CardDescription>Choose your profile type</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="userType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-2 gap-4"
                      >
                        <div className="flex items-center space-x-2 border rounded-lg p-4">
                          <RadioGroupItem value="room_seeker" id="room_seeker" />
                          <Label htmlFor="room_seeker" className="flex-1 cursor-pointer">
                            <div className="font-medium">Room Seeker</div>
                            <div className="text-sm text-muted-foreground">Looking for a room</div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 border rounded-lg p-4">
                          <RadioGroupItem value="room_owner" id="room_owner" />
                          <Label htmlFor="room_owner" className="flex-1 cursor-pointer">
                            <div className="font-medium">Room Owner</div>
                            <div className="text-sm text-muted-foreground">Have space to share</div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age Range</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select age range" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="18-22">18-22</SelectItem>
                        <SelectItem value="23-27">23-27</SelectItem>
                        <SelectItem value="28-32">28-32</SelectItem>
                        <SelectItem value="33-40">33-40</SelectItem>
                        <SelectItem value="40+">40+</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="non_binary">Non-binary</SelectItem>
                        <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="profession"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profession</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Software Engineer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Budget & Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Budget & Location
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Monthly Budget (₹)</Label>
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="budgetMin"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Min" 
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="budgetMax"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Max" 
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="preferredLocations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Locations</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. Koramangala, HSR Layout" 
                        value={field.value?.join(", ") || ""}
                        onChange={(e) => field.onChange(e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                      />
                    </FormControl>
                    <FormDescription>Separate locations with commas</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Lifestyle Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Lifestyle Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="sleepSchedule"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Sleep Schedule</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="early_bird" id="early_bird" />
                            <Label htmlFor="early_bird">Early Bird (Sleep by 10 PM)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="night_owl" id="night_owl" />
                            <Label htmlFor="night_owl">Night Owl (Sleep after 12 AM)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="flexible" id="flexible" />
                            <Label htmlFor="flexible">Flexible</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="workSchedule"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Work Schedule</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="regular_office" id="regular_office" />
                            <Label htmlFor="regular_office">Regular Office Hours</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="remote_work" id="remote_work" />
                            <Label htmlFor="remote_work">Remote Work</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="night_shift" id="night_shift" />
                            <Label htmlFor="night_shift">Night Shift</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="student" id="student" />
                            <Label htmlFor="student">Student</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="dietaryPreference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dietary Preferences</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select preference" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="vegetarian">Vegetarian</SelectItem>
                          <SelectItem value="non_vegetarian">Non-Vegetarian</SelectItem>
                          <SelectItem value="vegan">Vegan</SelectItem>
                          <SelectItem value="no_preference">No Preference</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="smoking"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Smoking</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="non_smoker">Non-Smoker</SelectItem>
                          <SelectItem value="occasional_smoker">Occasional Smoker</SelectItem>
                          <SelectItem value="regular_smoker">Regular Smoker</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="drinking"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Drinking</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="non_drinker">Non-Drinker</SelectItem>
                          <SelectItem value="social_drinker">Social Drinker</SelectItem>
                          <SelectItem value="regular_drinker">Regular Drinker</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Additional Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Additional Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="cleanliness"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cleanliness Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="very_clean">Very Clean & Organized</SelectItem>
                        <SelectItem value="clean_flexible">Clean but Flexible</SelectItem>
                        <SelectItem value="moderately_clean">Moderately Clean</SelectItem>
                        <SelectItem value="relaxed">Relaxed about Cleanliness</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="guestsPolicy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Guests Policy</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select policy" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="guests_welcome">Guests Welcome Anytime</SelectItem>
                        <SelectItem value="guests_with_notice">Guests with Prior Notice</SelectItem>
                        <SelectItem value="occasional_guests">Occasional Guests Only</SelectItem>
                        <SelectItem value="no_guests">No Guests Preferred</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="petPreference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pet Preference</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select preference" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="love_pets">Love Pets</SelectItem>
                        <SelectItem value="okay_with_pets">Okay with Pets</SelectItem>
                        <SelectItem value="no_pets">No Pets Please</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stayDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stay Duration</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="3_6_months">3-6 months</SelectItem>
                        <SelectItem value="6_12_months">6-12 months</SelectItem>
                        <SelectItem value="1_2_years">1-2 years</SelectItem>
                        <SelectItem value="long_term">Long-term (2+ years)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Bio */}
          <Card>
            <CardHeader>
              <CardTitle>About You</CardTitle>
              <CardDescription>Tell potential roommates about yourself</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Write a brief description about yourself, your interests, and what you're looking for in a roommate..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button type="submit" size="lg" disabled={isLoading} className="px-8 py-3">
              {isLoading ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
