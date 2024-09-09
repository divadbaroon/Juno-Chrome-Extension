import { stopAudio } from '../textToSpeech/performTextToSpeech';

/**
 * Manages keyboard shortcuts
 * 
 */
export class ShortcutManager {
    private shortcut: string;
    private isShortcutActive: boolean = false;
    private listenCallback: () => void;
    private produceResponseCallback: () => void;

    /**
     * Creates an instance of ShortcutManager.
     */
    constructor(
        initialShortcut: string,
        listenCallback: () => void,
        produceResponseCallback: () => void
    ) {
        this.shortcut = initialShortcut;
        this.listenCallback = listenCallback;
        this.produceResponseCallback = produceResponseCallback;
    }

    /**
     * Starts listening for keyboard shortcuts.
     */
    startListening() {
        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);
        document.addEventListener('keydown', this.handleStopAudioShortcut);
    }

    /**
     * Stops listening for keyboard shortcuts.
     */
    stopListening() {
        document.removeEventListener('keydown', this.handleKeyDown);
        document.removeEventListener('keyup', this.handleKeyUp);
        document.removeEventListener('keydown', this.handleStopAudioShortcut);
    }

    /**
     * Updates the shortcut key combination.
     */
    updateShortcut(newShortcut: string) {
        this.shortcut = newShortcut;
    }

    /**
     * Handles the key down event for the main shortcut.
     */
    private handleKeyDown = (event: KeyboardEvent) => {
        const parsedShortcut = this.parseShortcut(this.shortcut);
        if (event.ctrlKey === parsedShortcut.ctrl &&
            event.shiftKey === parsedShortcut.shift &&
            event.altKey === parsedShortcut.alt &&
            event.key.toUpperCase() === parsedShortcut.key) {
            event.preventDefault();
            if (!this.isShortcutActive) {
                this.isShortcutActive = true;
                this.listenCallback();
            }
        }
    }

    /**
     * Handles the key up event for the main shortcut.
     */
    private handleKeyUp = (event: KeyboardEvent) => {
        const parsedShortcut = this.parseShortcut(this.shortcut);
        if (event.key.toUpperCase() === parsedShortcut.key) {
            this.isShortcutActive = false;
            this.produceResponseCallback();
        }
    }

    /**
     * Handles the shortcut for stopping audio playback.
     */
    private handleStopAudioShortcut = (event: KeyboardEvent) => {
        if (event.ctrlKey && event.shiftKey && event.key.toUpperCase() === 'A') {
            event.preventDefault();
            stopAudio();
            console.log('Audio playback stopped');
        }
    }

    /**
     * Parses a shortcut string into an object representation.
     */
    private parseShortcut(shortcutString: string) {
        const keys = shortcutString.toUpperCase().split('+').map(key => key.trim());
        return {
            ctrl: keys.includes('CTRL'),
            shift: keys.includes('SHIFT'),
            alt: keys.includes('ALT'),
            key: keys.find(key => !['CTRL', 'SHIFT', 'ALT'].includes(key)) || ''
        };
    }
}