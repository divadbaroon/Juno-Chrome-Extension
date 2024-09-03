const codec = "audio/mpeg";
const maxBufferDuration = 90;
// @ts-ignore
let streamingCompleted = true;
let mediaSource: MediaSource;
let audioElement: HTMLAudioElement;
let isStopped = false;
let abortController: AbortController | null = null;

const initializeAudioComponents = () => {
  if (mediaSource && mediaSource.readyState === 'open') {
    mediaSource.endOfStream();
  }
  mediaSource = new MediaSource();
  audioElement = new Audio();
  streamingCompleted = false;
  isStopped = false;
  abortController = new AbortController();
};

async function fetchElevenLabsAudio(text: string, voiceID: string, apiKey: string, signal: AbortSignal): Promise<Response> {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceID}/stream`,
    {
      method: "POST",
      headers: {
        Accept: codec,
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model_id: "eleven_turbo_v2_5",
        text: text,
        voice_settings: {
          similarity_boost: 0.5,
          stability: 0.5,
        },
      }),
      signal: signal, 
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  if (!response.body) {
    throw new Error("Response body is empty");
  }

  return response;
}

export const streamAudio = async (text: string, voiceID: string, apiKey: string) => {
  initializeAudioComponents();

  audioElement.src = URL.createObjectURL(mediaSource);
  audioElement.playbackRate = 1;

  mediaSource.addEventListener("sourceopen", async () => {
    const sourceBuffer = mediaSource.addSourceBuffer(codec);
    let isAppending = false;
    let appendQueue: ArrayBuffer[] = [];

    const processAppendQueue = () => {
      if (!isAppending && appendQueue.length > 0 && !isStopped) {
        isAppending = true;
        const chunk = appendQueue.shift();
        if (chunk && mediaSource.readyState === 'open') {
          sourceBuffer.appendBuffer(chunk);
        } else {
          isAppending = false;
          processAppendQueue();
        }
      }
    };

    sourceBuffer.addEventListener("updateend", () => {
      isAppending = false;
      processAppendQueue();

      if (mediaSource.duration > maxBufferDuration) {
        const currentTime = audioElement.currentTime;
        const removeEnd = Math.max(0, currentTime - 10);
        if (removeEnd > 0 && !sourceBuffer.updating) {
          sourceBuffer.remove(0, removeEnd);
        }
      }
    });

    const appendChunk = (chunk: ArrayBuffer) => {
      if (isStopped) return;
      appendQueue.push(chunk);
      processAppendQueue();
    };

    try {
      const response = await fetchElevenLabsAudio(text, voiceID, apiKey, abortController!.signal);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error("Response body is empty");
      }

      const reader = response.body.getReader();

      while (!isStopped) {
        const { done, value } = await reader.read();

        if (done) {
          streamingCompleted = true;
          if (mediaSource.readyState === 'open') {
            mediaSource.endOfStream();
          }
          break;
        }

        appendChunk(value.buffer);
      }
      
      if (!isStopped) {
        audioElement.play();
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Audio streaming was aborted');
      } else {
        console.error("Error fetching and appending chunks:", error);
      }
      streamingCompleted = true;
    }
  });
};

export const stopAudio = () => {
  isStopped = true;
  if (abortController) {
    abortController.abort();
    abortController = null;
  }
  if (audioElement) {
    audioElement.pause();
    audioElement.currentTime = 0;
  }
  if (mediaSource && mediaSource.readyState === 'open') {
    mediaSource.endOfStream();
  }
  streamingCompleted = true;
};