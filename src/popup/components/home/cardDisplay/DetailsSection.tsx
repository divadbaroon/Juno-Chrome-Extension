import React, { useState, useEffect } from 'react';
import { Separator } from "../../../../shadcn/components/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../../shadcn/components/card';
import { useForm, FormProvider } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../shadcn/components/form";
import { Input } from "../../../../shadcn/components/input";

import { fetchExtensionById, fetchVoiceById, fetchLLMById } from '../cardDisplay/getCardDetails'

interface FormValues {
  title: string;
  description: string;
  background: string;
  context: string;
  personality: string;
  interactionGuidelines: string;
  temperature: number;
  creator: string;
}

interface DetailsSectionProps {
  models: string[];
  type: string;
  title: string;
  creator: string;
  description: string;
  link?: string;
  onUpdateDetails: (updatedDetails: { title: string; description: string }) => void;
  allItems: any;
}

interface LLMData {
  name: string;
  description: string;
  creator: string;
  link: string;
}

interface VoiceData {
  name: string;
  description: string;
  creator: string;
}

interface ExtensionData {
  name: string;
  description: string;
  creator: string;
}

const DetailsSection: React.FC<DetailsSectionProps> = ({ type, title, creator, description, link, onUpdateDetails, allItems}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showExampleUsage, setShowExampleUsage] = useState(false);
  const [showSetupInstructions, setShowSetupInstructions] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
  const [showMoreInformation, setShowMoreInformation] = useState(false);
  const [llmData, setLLMData] = useState<LLMData | null>(null);
  const [voiceData, setVoiceData] = useState<VoiceData | null>(null);
  const [extensionData, setExtensionData] = useState<ExtensionData | null>(null);

  useEffect(() => {
    const fetchLLMData = async () => {
      try {
        const data = await fetchLLMById(allItems.llm);
        setLLMData(data);
      } catch (error) {
        console.error('Failed to fetch extension data:', error);
      }
    };

    const fetchVoiceData = async () => {
      try {
        console.log(allItems)
        const data = await fetchVoiceById(allItems.voice);
        setVoiceData(data);
      } catch (error) {
        console.error('Failed to fetch voice data:', error);
      }
    };

    const fetchExtensionData = async () => {
      try {
        const data = await fetchExtensionById(allItems.extensions[0]);
        setExtensionData(data);
      } catch (error) {
        console.error('Failed to fetch extension data:', error);
      }
    };

    fetchLLMData();
    fetchVoiceData();
    fetchExtensionData()
  }, [allItems.llm, allItems.voice, allItems.extensions]);

  const methods = useForm<FormValues>({
    defaultValues: {
      title,
      description,
      background: allItems.background,
      context: allItems.context,
      personality: allItems.personality,
      interactionGuidelines: allItems.interactionGuidelines,
      temperature: allItems.temperature,
      creator
    },
  });

  const onSubmit = (data: { title: string; description: string }) => {
    onUpdateDetails(data);
  };

  return (
    <div className="details-section-wrapper" style={{ maxHeight: '400px' }}>
      <div>
        {/* Details section */}
        <div className="mb-4">
          <h3
            className="text-lg font-bold mb-2 cursor-pointer"
            onClick={() => setShowDetails(!showDetails)}
          >
            Profile Details
          </h3>
          <Separator className="my-0" />
          {showDetails && (
            <div className="expandable-section overflow-y-auto" style={{ maxHeight: '200px' }}>
              <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)} className="forms-container space-y-4 mt-2" style={{ marginLeft: '5px' }}>
                  <div className="space-y-4" style={{ marginTop: '5px', marginLeft: '5px' }}>
                    <FormField
                      control={methods.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold" style={{ color: '#373737' }}>
                            Title
                          </FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          {methods.formState.errors.title && <FormMessage>{methods.formState.errors.title.message}</FormMessage>}
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-4" style={{ marginLeft: '5px' }}>
                    <FormField
                      control={methods.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold" style={{ color: '#373737' }}>
                            Description
                          </FormLabel>
                          <div className="mt-1">
                            <textarea
                              {...field}
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2" 
                            />
                          </div>
                          {methods.formState.errors.description && <FormMessage>{methods.formState.errors.description.message}</FormMessage>}
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-4" style={{ marginLeft: '5px' }}>
                    <FormField
                      control={methods.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold" style={{ color: '#373737' }}>
                            Author
                          </FormLabel>
                          <FormControl>
                            <Input {...field} defaultValue={allItems.creator} disabled />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </form>
              </FormProvider>
            </div>
          )}
        </div>
  
        {/* Conditionally render sections based on type */}
        {type === 'Profiles' && (
          <>
            {/* LLM section */}
            <div className="mb-4">
              <h3
                className="text-lg font-bold mb-2 cursor-pointer"
                onClick={() => setShowExampleUsage(!showExampleUsage)}
              >
                Large language model
              </h3>
              <Separator className="my-0" />
              {showExampleUsage && (
                <div className="expandable-section overflow-y-auto" style={{ maxHeight: '200px' }}>
                  <Card>
                    <div className="card__content">
                      {llmData ? (
                        <div className="card__details">
                          <CardHeader>
                            <CardTitle>{llmData.name}</CardTitle>
                            <CardDescription>{llmData.creator}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="card__description" style={{ marginTop: -10 }}>{llmData.description}</p>
                          </CardContent>
                        </div>
                      ) : (
                        <CardContent>
                          <p>Loading llm data...</p>
                        </CardContent>
                      )}
                    </div>
                  </Card>
                </div>
              )}
            </div>
  
            {/* Prompt section */}
            <div className="mb-4">
              <h3
                className="text-lg font-bold mb-2 cursor-pointer"
                onClick={() => setShowSetupInstructions(!showSetupInstructions)}
              >
                Prompt
              </h3>
              <Separator className="my-0" />
              {showSetupInstructions && (
                <div className="expandable-section overflow-y-auto" style={{ maxHeight: '200px' }}>
                  <div className="border border-gray-300 rounded p-2">
                    <FormProvider {...methods}>
                      <form className="forms-container space-y-4 mt-2" style={{ marginLeft: '5px' }}>
                        <div className="space-y-4" style={{ marginTop: '5px', marginLeft: '5px' }}>
                          <FormField
                            control={methods.control}
                            name="background"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="font-bold" style={{ color: '#373737' }}>
                                  Core Identity
                                </FormLabel>
                                <FormControl>
                                  <Input {...field} defaultValue={allItems.identity} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="space-y-4" style={{ marginLeft: '5px' }}>
                          <FormField
                            control={methods.control}
                            name="context"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="font-bold" style={{ color: '#373737' }}>
                                  Context & Background
                                </FormLabel>
                                <FormControl>
                                  <Input {...field} defaultValue={allItems.context} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="space-y-4" style={{ marginLeft: '5px' }}>
                          <FormField
                            control={methods.control}
                            name="personality"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="font-bold" style={{ color: '#373737' }}>
                                  Personality Traits
                                </FormLabel>
                                <FormControl>
                                  <Input {...field} defaultValue={allItems.personality} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="space-y-4" style={{ marginLeft: '5px' }}>
                          <FormField
                            control={methods.control}
                            name="interactionGuidelines"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="font-bold" style={{ color: '#373737' }}>
                                  Interaction Style
                                </FormLabel>
                                <FormControl>
                                  <Input {...field} defaultValue={allItems.interactionGuidelines} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="space-y-4" style={{ marginLeft: '5px' }}>
                          <FormField
                            control={methods.control}
                            name="temperature"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="font-bold" style={{ color: '#373737' }}>
                                  Temperature (0-100)
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step={1}
                                    min={0}
                                    max={100}
                                    {...field}
                                    defaultValue={allItems.temperature || 0}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                      </form>
                    </FormProvider>
                  </div>
                </div>
              )}
            </div>
  
            {/* Voice section */}
            <div className="mb-4">
              <h3
                className="text-lg font-bold mb-2 cursor-pointer"
                onClick={() => setShowCode(!showCode)}
              >
                Voice
              </h3>
              <Separator className="my-0" />
              {showCode && (
                <div className="expandable-section overflow-y-auto" style={{ maxHeight: '200px' }}>
                  <Card>
                    <div className="card__content">
                      {voiceData ? (
                        <div className="card__details">
                          <CardHeader>
                            <CardTitle>{voiceData.name}</CardTitle>
                            <CardDescription>{voiceData.creator}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="card__description" style={{ marginTop: -10 }}>{voiceData.description}</p>
                          </CardContent>
                        </div>
                      ) : (
                        <CardContent>
                          <p>Loading voice data...</p>
                        </CardContent>
                      )}
                    </div>
                  </Card>
                </div>
              )}
            </div>
  
            {/* Extensions section */}
            <div className="mb-4">
              <h3
                className="text-lg font-bold mb-2 cursor-pointer"
                onClick={() => setShowAdditionalInfo(!showAdditionalInfo)}
              >
                Extensions
              </h3>
              <Separator className="my-0" />
              {showAdditionalInfo && (
                <div className="expandable-section overflow-y-auto" style={{ maxHeight: '200px' }}>
                  <Card>
                    <div className="card__content">
                      {extensionData ? (
                        <div className="card__details">
                          <CardHeader>
                            <CardTitle>{extensionData.name}</CardTitle>
                            <CardDescription>{extensionData.creator}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="card__description" style={{ marginTop: -10 }}>{extensionData.description}</p>
                          </CardContent>
                        </div>
                      ) : (
                        <CardContent>
                          <p style={{ marginTop: 10, marginBottom: -10 }}>This profile has no extensions.</p>
                        </CardContent>
                      )}
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </>
        )}
        {/* Conditionally render sections based on type */}
        {type === 'Extensions' && (
          <>
            {/* Example Usage section */}
            <div className="mb-4">
              <h3
                className="text-lg font-bold mb-2 cursor-pointer"
                onClick={() => setShowExampleUsage(!showExampleUsage)}
              >
                Example Usage
              </h3>
              <Separator className="my-0" />
              {showExampleUsage && (
                <div className="expandable-section overflow-y-auto" style={{ maxHeight: '200px' }}>
                  <div className="border border-gray-300 rounded p-2">
                    <p>Example usage content goes here.</p>
                  </div>
                </div>
              )}
            </div>
  
            {/* Setup Instructions section */}
            <div className="mb-4">
              <h3
                className="text-lg font-bold mb-2 cursor-pointer"
                onClick={() => setShowSetupInstructions(!showSetupInstructions)}
              >
                Setup Instructions
              </h3>
              <Separator className="my-0" />
              {showSetupInstructions && (
                <div className="expandable-section overflow-y-auto" style={{ maxHeight: '200px' }}>
                  <div className="border border-gray-300 rounded p-2">
                    <p>There are no setup instructions for this extension.</p>
                  </div>
                </div>
              )}
            </div>
  
            {/* Code section */}
            <div className="mb-4">
              <h3
                className="text-lg font-bold mb-2 cursor-pointer"
                onClick={() => setShowCode(!showCode)}
              >
                Code
              </h3>
              <Separator className="my-0" />
              {showCode && (
                <div className="expandable-section overflow-y-auto" style={{ maxHeight: '200px' }}>
                  <div className="border border-gray-300 rounded p-2">
                    <p>Code snippets or examples go here.</p>
                  </div>
                </div>
              )}
            </div>
  
            {/* Preferences section */}
            <div>
              <h3
                className="text-lg font-bold mb-2 cursor-pointer"
                onClick={() => setShowAdditionalInfo(!showAdditionalInfo)}
              >
                Preferences
              </h3>
              <Separator className="my-0" />
              {showAdditionalInfo && (
                <div className="expandable-section overflow-y-auto" style={{ maxHeight: '200px' }}>
                  <div className="border border-gray-300 rounded p-2">
                    <p>Additional information goes here.</p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
  
        {type === 'LLMs' && (
          <>
            {/* Performance section */}
            <div className="mb-4">
              <h3
                className="text-lg font-bold mb-2 cursor-pointer"
                onClick={() => setShowMoreInformation(!showMoreInformation)}
              >
                More Information
              </h3>
              <Separator className="my-0" />
              {showMoreInformation && (
                <div className="expandable-section overflow-y-auto" style={{ maxHeight: '200px' }}>
                  <div className="border border-gray-300 rounded p-2">
                    <p>More information can be found here: <a href={link} target="_blank" rel="noopener noreferrer" className="highlight-link">{link}</a></p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DetailsSection;