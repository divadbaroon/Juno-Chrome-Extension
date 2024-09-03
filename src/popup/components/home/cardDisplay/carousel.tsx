import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../../../shadcn/components/carousel";
import DisplayCard from './DisplayCard';

interface CarouselProps {
  profiles: Profile[];
  selectedProfile: Profile | null;
  userDetails: UserDetails;
  handleProfileSelection: (profile: Profile) => void;
  isCardInCollection: (id: string) => boolean;
  onReload: () => void;
}

import { Profile } from "../../../../types"

interface UserDetails {
    clerkId: string;
    userCollection: {
        profiles: string[];
        llms: string[];
        voices: string[];
        extensions: string[];
    };
}

export function ProfileCarousel({
  profiles,
  selectedProfile,
  userDetails,
  handleProfileSelection,
  isCardInCollection,
  onReload
}: CarouselProps) {
  return (
    <Carousel className="w-full">
      <CarouselContent>
        {profiles.map((profile, index) => (
          <CarouselItem key={index} className="flex justify-center items-center">
            <div className="w-full max-w-md p-4">
              <DisplayCard
                clerkId={userDetails.clerkId}
                contextType="Library"
                type="Profiles"
                title={profile.name}
                creator={profile.creator}
                description={profile.description}
                isSelected={profile._id === selectedProfile?._id}
                onSelect={() => handleProfileSelection(profile)}
                userCollection={userDetails.userCollection}
                isInCollection={isCardInCollection(profile._id)}
                onReload={onReload}
                models={['Model 1', 'Model 2', 'Model 3']}
                blobURL={profile.objectURL}
                photo={profile.photo}
                link={profile.link}
                allItems={profile} 
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute -left-8 top-1/2 -translate-y-1/2" />
      <CarouselNext className="absolute -right-8 top-1/2 -translate-y-1/2" />
    </Carousel>
  );
}