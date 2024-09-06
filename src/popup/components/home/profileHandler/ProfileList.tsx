import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';

import { Profile, User } from "../../../../types"

function ProfileList() {
  const [_profiles, setProfiles] = useState<Profile[]>([]);
  const { user } = useUser();

  useEffect(() => {
    const fetchUserAndProfiles = async () => {

      // check if user is found
      if (!user) return; 

      try {
        // Fetch user data
        const userResponse = await fetch(`https://www.junoai.io/api/webhooks/users?userId=${user.id}`);
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data 1');
        }
        const userData: User = await userResponse.json();

        // Fetch all profiles
        const profilesResponse = await fetch('https://www.junoai.io/api/webhooks/profiles');
        if (!profilesResponse.ok) {
          throw new Error('Failed to fetch profiles');
        }
        const allProfiles: Profile[] = await profilesResponse.json();
        
        // Filter profiles based on user's collection
        const userProfiles = allProfiles.filter(profile => 
          userData.userCollection.profiles.includes(profile._id)
        );
        
        setProfiles(userProfiles);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchUserAndProfiles();
  }, [user]); 

  return null; 
}

export default ProfileList;