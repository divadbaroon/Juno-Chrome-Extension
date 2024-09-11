import { ExtensionResult } from "../../../types";

// youtube-transcript library from https://www.npmjs.com/package/youtube-transcript
import { YoutubeTranscript } from 'youtube-transcript';

/*
Returns the full transcript of the Youtube video the user is currently viewing
*/
export async function performYoutubeQA(): Promise<ExtensionResult> {

    // Using URL library: https://developer.mozilla.org/en-US/docs/Web/API/URL 
    // to parse URL and extract videoID from it

    // Retrieves the current window's URL
    const parsedUrl = new URL(window.location.href);

    // Parses the Youtube URL and extracts the videoID, assigned to "v"
    const currentVideoID = parsedUrl.searchParams.get("v"); 

    // If videoID was not found, inform the user they must be on a valid youtube page
    if (!currentVideoID) {
        return {
            extensionResponse: 'This extension only works on YouTube video pages.',
            queryLLM: false
        };
    }

    try {
        // Using youtube-transcript library from https://www.npmjs.com/package/youtube-transcript
        // to extract transcript given the videoID
        const transcriptData = await YoutubeTranscript.fetchTranscript(currentVideoID);

        // An array of transcript segments are returned, thus we are mapping them and joining them together
        const fullTranscript = transcriptData.map(segment => segment.text).join(' ');
        
        return {
            extensionResponse: "When referring transcripts, provide direct quotes and statements. The Youtube video's transript: " + fullTranscript,
            queryLLM: true,
        };
    } catch (error) {
        console.error('Error fetching transcript:', error);
        return {
            extensionResponse: 'Failed to retrieve the video transcript.',
            queryLLM: false,
        };
    }
}


