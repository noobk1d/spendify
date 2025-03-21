"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/Profile/card";
import { Button } from "../ui/Profile/button";
import { Input } from "../ui/Profile/input";
import { Label } from "../ui/Profile/label";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Dashboard/avatar";
import { Edit2, Check, Camera } from "lucide-react";
import { Separator } from "../ui/Profile/separator";

function ProfileSection() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Gillian P.",
    email: "gillian.p@example.com",
    phone: "+1 (555) 123-4567",
    location: "New York, USA",
    avatar: "/placeholder.svg?height=100&width=100",
  });

  const [formData, setFormData] = useState({ ...profile });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setProfile({ ...formData });
    setIsEditing(false);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Manage your personal details</CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-1">
          {isEditing ? (
            <>
              <Check className="h-4 w-4" /> Save
            </>
          ) : (
            <>
              <Edit2 className="h-4 w-4" /> Edit Profile
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar className="h-32 w-32 border-4 border-background">
                <AvatarImage src={profile.avatar} alt={profile.name} />
                <AvatarFallback className="text-3xl">
                  {profile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute -bottom-2 -right-2 rounded-full h-8 w-8">
                  <Camera className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="text-center">
              <h3 className="font-medium text-lg">{profile.name}</h3>
            </div>
          </div>

          <Separator className="md:hidden my-4" />

          <form className="flex-1 space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                ) : (
                  <div className="text-sm font-medium py-2 px-3 rounded-md bg-muted">
                    {profile.name}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                ) : (
                  <div className="text-sm font-medium py-2 px-3 rounded-md bg-muted">
                    {profile.email}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                ) : (
                  <div className="text-sm font-medium py-2 px-3 rounded-md bg-muted">
                    {profile.phone}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                {isEditing ? (
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                  />
                ) : (
                  <div className="text-sm font-medium py-2 px-3 rounded-md bg-muted">
                    {profile.location}
                  </div>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            )}
          </form>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProfileSection;
