import React, { useState, useRef } from 'react';
import { Button } from '../../../../shadcn/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../../../shadcn/components/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from '../../../../shadcn/components/dialog';
import DetailsSection from './DetailsSection';

interface DisplayCardProps {
  clerkId: string; // Clerk ID of the user viewing the card
  contextType: string;
  type: string;
  title: string;
  creator: string;
  blobURL?: string;
  link?: string;
  description: string;
  photo?: string;
  isSelected: boolean;
  onSelect: () => void;
  userCollection: {
    profiles: string[];
    llms: string[];
    voices: string[];
    extensions: string[];
  };
  isInCollection: boolean;
  additionalInfo?: string;
  onReload: () => void;
  models: string[];
  allItems: any;
}

const DisplayCard: React.FC<DisplayCardProps> = ({
  contextType,
  type,
  title,
  creator,
  blobURL,
  link,
  description,
  isSelected,
  onSelect,
  isInCollection,
  onReload,
  models,
  allItems,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [cardTitle, setTitle] = useState(title);
  const [cardDescription, setDescription] = useState(description);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const borderClass =
    isSelected && (contextType === 'QuickStart' || contextType == 'Lab')
      ? 'selected-card'
      : 'non-selected-card';

  const handleSelect = () => {
    onSelect();
    onReload(); // Call onReload after onSelect is called
  };

  const handleUpdateDetails = (updatedDetails: { title: string; description: string }) => {
    setTitle(updatedDetails.title);
    setDescription(updatedDetails.description);
  };

  const playAudioSample = () => {
  if (blobURL) {
    // Stop the currently playing audio, if any
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Create a new audio element and play the selected audio
    const audio = new Audio(blobURL);
    audioRef.current = audio;
    audio.play().catch(error => console.error("Error playing the audio:", error));
  }
};

  return (
    <>
    <Card className={`${borderClass}`}>
      
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{creator}</CardDescription>
      </CardHeader>
      <CardContent>
      <p className="card__description" style={{ marginTop: '0px' }}>{description}</p>

      </CardContent>
      <CardFooter className="card-footer flex justify-center items-center space-x-8">
        {type === 'Voices' ? (
          <Button className="w-24 px-8" variant="outline" onClick={playAudioSample}>
          Sample
        </Button>
        ) : (
          <Button className="w-24 px-8" variant="outline" onClick={openModal}>
            Details
          </Button>
        )}
        <Button className="w-24 px-8" onClick={handleSelect}>
          {contextType === 'QuickStart' && type === 'Extensions'
            ? isSelected
              ? 'Unadd'
              : 'Add'
            : contextType === 'Dashboard'
            ? isInCollection
              ? 'Remove'
              : 'Save'
            : contextType === 'Library'
            ? isSelected
              ? 'Selected'
              : 'Select'
            : isSelected
            ? 'Selected'
            : 'Select'}
        </Button>
      </CardFooter>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <div className="flex">          
            <div className="w-full pl-4">
            <DetailsSection
                type={type}
                models={models}
                title={cardTitle}
                creator={creator}
                description={cardDescription}
                link={link}
                onUpdateDetails={handleUpdateDetails}
                allItems = {allItems}
              />   
             </div>          
          </div>
          <DialogFooter>
            <Button onClick={closeModal}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  </>
  );
};

export default DisplayCard;