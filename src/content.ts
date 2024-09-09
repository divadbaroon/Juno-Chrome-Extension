import { Orchestrator } from './orchestrator/Orchestrator';
import "./functions/guiResponse/handleGUIResponse";

let orchestrator: Orchestrator | null = null;

/**
 * Initializes the orchestrator, which manages the overall 
 * coordination of Juno's engine and shortcut manager
*/
async function initializeJuno() {
    try {
        orchestrator = new Orchestrator();
        await orchestrator.initialize();
        console.log("Juno initialized and ready to use!");
    } catch (error) {
        console.error("Failed to initialize Juno:", error);
    }
}

// Function to handle page reloads or navigation
// @ts-ignore
function handleNavigation() {
    if (orchestrator) {
        orchestrator.stopListening();
        orchestrator = null;
    }
    initializeJuno();
}

// Initial setup
initializeJuno();
