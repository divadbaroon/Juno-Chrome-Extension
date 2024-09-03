import { useState, useEffect, useCallback } from 'react';
import { Profile, UserDetails } from "../../../../types";
import { getCurrentProfile, setCurrentProfile } from './profileManager';

export function useProfileManagement(userId: string | null) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails>({
    clerkId: '',
    userCollection: { profiles: [], llms: [], voices: [], extensions: [], prompts: [] }
  });
  const [isLoading, setIsLoading] = useState(true);

  const handleProfileSelection = useCallback(async (profile: Profile | null) => {
    console.log("Selected profile:", profile);
  
    if (profile === null) {
      if (profiles.length > 0) {
        const defaultProfile = profiles[0];
        setSelectedProfile(defaultProfile);
        await setCurrentProfile(defaultProfile);
      } else {
        setSelectedProfile(null);
        await chrome.storage.sync.remove('selectedProfile');
      }
    } else {
      setSelectedProfile(profile);
      await setCurrentProfile(profile);
    }
    // Remove the reordering logic from here
  }, [profiles]);

  const isCardInCollection = useCallback((id: string) => {
    return userDetails.userCollection.profiles.includes(id);
  }, [userDetails.userCollection.profiles]);

  async function fetchUserData(userId: string): Promise<UserDetails> {
    const response = await fetch(`https://www.junoai.io/api/webhooks/users?userId=${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user data 2');
    }
    const userData = await response.json();
    return {
      clerkId: userId,
      userCollection: userData.userCollection
    };
  }

  async function fetchAllProfiles(): Promise<Profile[]> {
    const response = await fetch('https://www.junoai.io/api/webhooks/profiles');
    if (!response.ok) {
      throw new Error('Failed to fetch profiles');
    }
    return await response.json();
  }

  function filterUserProfiles(allProfiles: Profile[], userData: UserDetails): Profile[] {
    return allProfiles.filter((profile: Profile) => 
      userData.userCollection.profiles.includes(profile._id)
    );
  }

  useEffect(() => {
    const fetchUserAndProfiles = async () => {
      if (!userId) return;
      setIsLoading(true);

      try {
        const userData = await fetchUserData(userId);
        setUserDetails(userData);

        const allProfiles = await fetchAllProfiles();
        let userProfiles = filterUserProfiles(allProfiles, userData);

        const currentProfile = await getCurrentProfile();

        if (currentProfile && userProfiles.some(p => p._id === currentProfile._id)) {
          // Move the current profile to the front only during initialization
          userProfiles = [
            currentProfile,
            ...userProfiles.filter(p => p._id !== currentProfile._id)
          ];
          setSelectedProfile(currentProfile);
        } else if (userProfiles.length > 0) {
          setSelectedProfile(userProfiles[0]);
          await setCurrentProfile(userProfiles[0]);
        } else {
          setSelectedProfile(null);
        }

        setProfiles(userProfiles);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAndProfiles();
  }, [userId]);

  return {
    profiles,
    setProfiles, 
    selectedProfile,
    userDetails,
    handleProfileSelection,
    isCardInCollection,
    isLoading
  };
}