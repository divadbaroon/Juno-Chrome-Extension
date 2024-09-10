import { Engine } from './Engine';
import { ShortcutManager } from '../functions/shortcutListener/ShortCutManager';
import { requestInitialData } from '../fileCommunication/messengers';

/**
 * Manages to overall coordination of the engine and shortcut manager
 * 
 * Specifically: 
 * The engine and shortcut listener to beigin listening for the user's keystrokes.
 * If the user hold's their assigned shortcut, the engine is initiated
 */
export class Orchestrator {
    private engine: Engine;
    private shortcutManager!: ShortcutManager;

    constructor() {
        this.engine = new Engine();
    }

    /**
     * Initializes the engine and shortcut listener and begin listening for 
     * the user's key strokes
     */
    async initialize() {
        try {
            // Initialize the engine
            await this.engine.initialize();

            // Get initial data for shortcut setup
            const initialData = await requestInitialData();

            if (!initialData) {
                throw new Error("Failed to load initial data");
            }

            // Create ShortcutManager
            this.shortcutManager = new ShortcutManager(
                initialData.shortcut,
                this.handleListenCommand.bind(this),
                this.handleProduceResponseCommand.bind(this)
            );

            // Start listening for shortcuts
            this.shortcutManager.startListening();

            console.log("Orchestrator initialized successfully");
        } catch (error) {
            console.error("Failed to initialize Orchestrator:", error);
            throw error;
        }
    }

    /**
     * Begins listening for the user's input via their microphone
     */
    private async handleListenCommand() {
        try {
            await this.engine.listen();
        } catch (error) {
            console.error("Error in listen command:", error);
        }
    }

     /**
     * Produces a response using the user's input as context
     */
    private async handleProduceResponseCommand() {
        try {
            await this.engine.produceResponse();
        } catch (error) {
            console.error("Error in produce response command:", error);
            // TODO: Handle error (say something to user)
        }
    }

    /**
     * Updates the user's key strokes
     */
    public updateShortcut(newShortcut: string) {
        this.shortcutManager.updateShortcut(newShortcut);
    }

    /**
     * Stop listening for the user's assigned shortcut
     */
    public stopListening() {
        this.shortcutManager.stopListening();
    }

    /**
     * Start listening for the user's assigned shortcut
     */
    public startListening() {
        this.shortcutManager.startListening();
    }

}