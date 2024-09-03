import { Profile } from "../../../../types";

let currentProfile: Profile | null = null;

export async function getCurrentProfile(): Promise<Profile | null> {
  if (!currentProfile) {
    const result = await new Promise<{ selectedProfile?: string }>((resolve) => 
      chrome.storage.sync.get(['selectedProfile'], resolve)
    );
    
    if (result.selectedProfile) {
      currentProfile = await fetchProfileById(result.selectedProfile);
    }
  }
  return currentProfile;
}

export async function setCurrentProfile(profile: Profile): Promise<void> {
  currentProfile = profile;
  await chrome.storage.sync.set({ selectedProfile: profile._id });
}

async function fetchProfileById(profileId: string): Promise<Profile | null> {
    try {
      // Get all profiles
      const response = await fetch(`https://www.junoai.io/api/webhooks/profiles`);
  
      if (!response.ok) {
        throw new Error('Failed to fetch profiles');
      }
  
      // Parse all profiles
      const profiles: Profile[] = await response.json();
  
      // Find the specific profile by ID
      const profile = profiles.find(p => p._id === profileId);
  
      if (!profile) {
        console.log(`Profile with ID ${profileId} not found`);
        return null;
      }
  
      return profile;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }

// Listen for storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.selectedProfile) {
    const newProfileId = changes.selectedProfile.newValue;
    if (newProfileId && (!currentProfile || currentProfile._id !== newProfileId)) {
      fetchProfileById(newProfileId).then(profile => {
        currentProfile = profile;
      });
    }
  }
});