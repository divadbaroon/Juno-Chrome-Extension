"use client"

import { useState } from 'react'
import '../../globals.css';
import { CardContent } from "../../shadcn/components/card"
import { UserButton } from '@clerk/clerk-react';
import { Separator } from "../../shadcn/components/separator";
import { Input } from "../../shadcn/components/input";
import { BreadcrumbNav } from '../components/breadcrumb'; 
import { Button } from '../../shadcn/components/button'; 
import { CheckCircle2, XCircle } from 'lucide-react';
import { storeInChromeStorage } from '../components/secrets/secretHandler'; 
import { validateOpenAIKey, validateElevenLabsKey } from '../components/secrets/secretHandler'; 

type KeyStatus = boolean | null;

type ApiKeyStatuses = {
  openAI: KeyStatus;
  elevenlabs: KeyStatus;
};

export default function SecretsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [isError, setIsError] = useState(false);
  const [apiKeys, setApiKeys] = useState({
    openAI: '',
    elevenlabs: ''
  });
  const [keyStatuses, setKeyStatuses] = useState<ApiKeyStatuses>({
    openAI: null,
    elevenlabs: null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setApiKeys(prev => ({ ...prev, [id]: value }));
    setKeyStatuses(prev => ({ ...prev, [id]: null }));
    setIsError(false);
    setIsCreated(false);
  };

   const handleSaveSecrets = async () => {
    setIsLoading(true);
    setIsError(false);
    setIsCreated(false);

    const results = await Promise.all([
      apiKeys.openAI ? validateOpenAIKey(apiKeys.openAI) : Promise.resolve(null),
      apiKeys.elevenlabs ? validateElevenLabsKey(apiKeys.elevenlabs) : Promise.resolve(null)
    ]);

    const newKeyStatuses: ApiKeyStatuses = {
      openAI: results[0],
      elevenlabs: results[1]
    };

    setKeyStatuses(newKeyStatuses);

    // Check if any provided key is invalid
    const hasInvalidKey = Object.values(newKeyStatuses).some(status => status === false);
    
    if (hasInvalidKey) {
      setIsError(true);
      setIsLoading(false);
      return;
    }

    // Save valid keys to Chrome storage
    try {
      if (newKeyStatuses.openAI) {
        await storeInChromeStorage('OpenAI', apiKeys.openAI);
      }
      if (newKeyStatuses.elevenlabs) {
        await storeInChromeStorage('Elevenlabs', apiKeys.elevenlabs);
      }
      setIsCreated(true);
    } catch (error) {
      setIsError(true);
    }

    setIsLoading(false);
  };

  return (
    <div className="root-container">
      <div className="flex justify-end items-center w-full mb-3">
        <UserButton afterSignOutUrl="/" showName={false} />
      </div>
    
      <BreadcrumbNav /> 
  
      <Separator className="my-4 -mt-1" />

      <CardContent className="space-y-4">
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 -ml-6">
          <p className="text-sm text-blue-700">
            <span className="font-semibold">Free plan users:</span> add API keys below.<br />
            <span className="font-semibold">Standard/premium users:</span> skip this section.
          </p>
        </div> 
      </CardContent>

      <Separator className="my-4 -mt-1" />

      {/* OpenAI api key */}
      <p className="block text-sm font-medium text-gray-700">
        OpenAI:
      </p>
      <div className="relative">
        <Input 
          id="openAI"
          type="text" 
          placeholder="Enter your OpenAI API key" 
          className="text-[#373737] mt-1 pr-10"
          value={apiKeys.openAI}
          onChange={handleInputChange}
        />
        {keyStatuses.openAI !== null && (
          keyStatuses.openAI ? 
            <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" size={20} /> :
            <XCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500" size={20} />
        )}
      </div>

      {/* elevenlabs api key */}
      <p className="block text-sm font-medium text-gray-700 mt-3">
        Elevenlabs:
      </p>
      <div className="relative">
        <Input 
          id="elevenlabs"
          type="text" 
          placeholder="Enter your Elevenlabs API key" 
          className="text-[#373737] mt-1 pr-10"
          value={apiKeys.elevenlabs}
          onChange={handleInputChange}
        />
        {keyStatuses.elevenlabs !== null && (
          keyStatuses.elevenlabs ? 
            <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" size={20} /> :
            <XCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500" size={20} />
        )}
      </div>
      
      <Button
        onClick={handleSaveSecrets}
        style={{ float: 'right', marginTop: '1.5em'}}
        disabled={isLoading}
        className={isError ? 'bg-red-500 hover:bg-red-600' : ''}
      >
        {isLoading ? (
          <>
            <svg
              aria-hidden="true"
              role="status"
              className="inline w-4 h-4 me-3 text-white animate-spin"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="#E5E7EB"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentColor"
              />
            </svg>
            Validating...
          </>
        ) : isError ? (
          'Error: API keys invalid'
        ) : isCreated ? (
          'Saved!'
        ) : (
          'Save'
        )}
      </Button>
    </div>
  );
}