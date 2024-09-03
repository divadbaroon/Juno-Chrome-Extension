import React, { useState, useRef, useCallback, KeyboardEvent, useEffect } from 'react';
import { storeInChromeStorage } from '../../../components/secrets/secretHandler'; 

interface ShortcutInputProps {
  onShortcutChange?: (shortcut: string) => void;
}

const ShortcutInput: React.FC<ShortcutInputProps> = ({ onShortcutChange }) => {
  const [shortcut, setShortcut] = useState('');
  const [placeholder, setPlaceholder] = useState("Click to set shortcut");
  const keysPressed = useRef<string[]>([]);
  const timeoutRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    let key = event.key.toUpperCase();
    if (key === "CONTROL") {
      key = "CTRL";
    }
    console.log(key);
    if (!keysPressed.current.includes(key)) {
      keysPressed.current.push(key);
      const newShortcut = keysPressed.current.join(' + ');
      setShortcut(newShortcut);
    }
    setPlaceholder("Listening for key strokes...");

    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }
  }, []);

  const handleKeyUp = useCallback((_event: KeyboardEvent<HTMLInputElement>) => {
    setPlaceholder("Not listening");
    
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = window.setTimeout(async () => {
      setPlaceholder("Click to set shortcut");
      const finalShortcut = keysPressed.current.join(' + ');
      try {
        await storeInChromeStorage('Shortcut', finalShortcut);
        console.log('Final shortcut:', finalShortcut);
        onShortcutChange?.(finalShortcut);
      } catch (error) {
        console.error('Error storing shortcut:', error);
      }
      keysPressed.current = [];
      setShortcut('');
    }, 1000);
  }, [onShortcutChange]);

  const startListening = useCallback(() => {
    keysPressed.current = [];
    setShortcut('');
    setPlaceholder("Listening for key strokes...");
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const input = inputRef.current;
    if (input) {
      input.addEventListener('keyup', handleKeyUp as any);
      return () => {
        input.removeEventListener('keyup', handleKeyUp as any);
      };
    }
  }, [handleKeyUp]);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={shortcut}
        readOnly
        placeholder={placeholder}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-[#373737]"
        onClick={startListening}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default ShortcutInput;