"use client";

import { useState, useEffect } from "react";
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
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: "Loading...",
    email: "Loading...",
    phone: "Loading...",
    location: "Loading...",
    avatar: "/placeholder.svg?height=100&width=100",
  });

  const [formData, setFormData] = useState({ ...profile });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("jwt");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch(
          "http://127.0.0.1:3000/spendify/api/profile/me",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
              Accept: "application/json",
              Origin: window.location.origin,
            },
            mode: "cors",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const data = await response.json();
        if (data.status === "success") {
          // Update both profile and formData with the API response
          const updatedProfile = {
            ...profile,
            name: data.data.name || "Not specified",
            email: data.data.email || "Not specified",
            phone: data.data.phone || "Not specified",
            location: data.data.location || "Not specified",
          };

          setProfile(updatedProfile);
          setFormData(updatedProfile);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        // Set default values in case of error
        const errorProfile = {
          ...profile,
          name: "Error loading profile",
          email: "Error loading profile",
          phone: "Error loading profile",
          location: "Error loading profile",
        };
        setProfile(errorProfile);
        setFormData(errorProfile);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Send PUT request to update profile
      const response = await fetch(
        "http://127.0.0.1:3000/spendify/api/profile/me",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
            Accept: "application/json",
            Origin: window.location.origin,
          },
          mode: "cors",
          credentials: "include",
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            location:
              formData.location === "Not specified" ? null : formData.location,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await response.json();
      if (data.status === "success") {
        // Update local state with the response data
        const updatedProfile = {
          ...profile,
          name: data.data.name,
          email: data.data.email,
          phone: data.data.phone,
          location: data.data.location || "Not specified",
        };

        setProfile(updatedProfile);
        setFormData(updatedProfile);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      // You might want to show an error message to the user here
    }
  };

  const handleCancel = () => {
    setFormData({ ...profile });
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </CardContent>
      </Card>
    );
  }

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
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
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
                    ? profile.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                    : "U"}
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

          <div className="flex-1 space-y-4">
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
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="button" onClick={handleSave}>
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProfileSection;
