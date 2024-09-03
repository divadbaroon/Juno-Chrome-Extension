"use client"

import '../../globals.css';

import { useState, useCallback, useEffect } from 'react';

// For managing the users profiles
import { useProfileManagement } from "../components/home/profileHandler/profileManagement"

// Genereate a list of the users profiles 
import ProfileList from '../components/home/profileHandler/ProfileList';

// UI components
import { useUser, UserButton } from '@clerk/clerk-react';
import { Separator } from "../../shadcn/components/separator";

// @ts-ignore
import { Input } from "../../shadcn/components/input";
import { BreadcrumbNav } from '../components/breadcrumb'; 
import { ProfileCarousel } from '../components/home/cardDisplay/carousel';
import { ProfilePopover } from '../components/home/profileHandler/ProfilePopover'; 


import ShortcutInput from '../components/home/shortcutSetter/ShortcutInput';

export default function HomePage() {
  // Gets the current user's data from Clerk authentication
  const { user } = useUser();

  // State for controlling the profile popover
  const [open, setOpen] = useState(false);

  // State for storing the selected profile name
  const [value, setValue] = useState("");

  // State for managing loading state
  const [isCarouselLoading, setIsCarouselLoading] = useState(true);

  // Hook for managing user's profile collection
  const {
    profiles,            // Gets array of current user's profiles
    selectedProfile,     // Gets currently selected profile
    userDetails,         // Gets user's details including collections
    handleProfileSelection, // Function to handle profile selection
    isCardInCollection, // Function to check if a profile is in user's collection
    isLoading: isProfileManagementLoading   
  } = useProfileManagement(user?.id || null);

  console.log(profiles)

  // Handler for profile selection in the popover
  const handleProfileSelect = useCallback((profileName: string) => {
    // Find the profile object based on the selected name
    const profile = profiles.find(p => p.name === profileName);
    // Update the selected profile
    handleProfileSelection(profile || null);
    // Update the value state with the selected profile name
    setValue(profile ? profile.name : "");
    // Close the popover
    setOpen(false);
  }, [profiles, handleProfileSelection]);

  // Effect to update value state when selectedProfile changes
  useEffect(() => {
    if (selectedProfile) {
      setValue(selectedProfile.name);
    } else {
      setValue("");
    }
  }, [selectedProfile]);

  useEffect(() => {
    // Update carousel loading state based on profile management loading state
    setIsCarouselLoading(isProfileManagementLoading);
  }, [isProfileManagementLoading]);

  // Function to handle reload action
  const onReload = () => {
    console.log("Reload triggered");
    // Add actual reload logic here if needed
  };

  return (
    <div className="root-container">

      {/* Account management button in top right */}
      <div className="flex justify-end items-center w-full mb-3">
        <UserButton afterSignOutUrl="/" showName={false} />
      </div>

      {/* Returns a list of all profiles in current user's collection */}
      <ProfileList />
    
      {/* Breadcrumb at top*/}
      <BreadcrumbNav /> 
  
      <Separator className="my-4 -mt-1" />
  
      {/* Drop down showing profiles*/}
      <div className="flex justify-between items-center w-full">
        <p className="p-12-regular text-dark-400">
          Selected profile:
        </p>
        <div className="ml-4"> 
          <ProfilePopover
            open={open}
            setOpen={setOpen}
            value={value}
            setValue={setValue}
            profiles={profiles}
            handleProfileSelect={handleProfileSelect}
          />
        </div>
      </div>

      <Separator className="my-4" />

      {/* Displaying all profiles side-by-side*/}
      <div className="relative w-full max-w-md mx-auto px-8"> 
        {isCarouselLoading ? (
          <div className="flex items-center justify-center h-40">
            <div className="rounded-full h-10 w-10 bg-[#334155] animate-ping"></div>
          </div>
        ) : (
          <ProfileCarousel
            profiles={profiles}
            selectedProfile={selectedProfile}
            userDetails={userDetails}
            handleProfileSelection={handleProfileSelection}
            isCardInCollection={isCardInCollection}
            onReload={onReload}
          />
        )}
      </div>

      <Separator className="my-4" />

      <div>
        <p className="p-10-regular text-dark-400">
          Set your shortcut for interacting. Once set, hold your shortcut and speak.
        </p>
        <ShortcutInput onShortcutChange={(newShortcut) => console.log('New shortcut:', newShortcut)} />
      </div>
    </div>
  );
}