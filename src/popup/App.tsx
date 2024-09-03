import { useState, useEffect } from 'react';
import "../globals.css";
import HomePage from "./pages/home";
import SecretsPage from "./pages/secrets"
import FaqPage from "./pages/faq"
import {
  SignedIn,
  SignedOut,
  SignIn,
  SignUp,
  ClerkProvider,
} from "@clerk/chrome-extension";
import {
  useNavigate,
  Routes,
  Route,
  MemoryRouter
} from "react-router-dom";

import { getFromChromeStorage } from '../popup/components/secrets/secretHandler'

async function initializeClerkKey() {
  return await getFromChromeStorage<string>("ClerkPublishableKey") || "";
}

function ClerkProviderWithRoutes({ clerkKey }: { clerkKey: string }) {
  const navigate = useNavigate();

  return (
    <ClerkProvider
      publishableKey={clerkKey}
      appearance={{ variables: { colorPrimary: '#1a1a1a' } }}
      navigate={(to) => navigate(to)}
    >
      <div className="App">
        <main className="App-main">
          <Routes>
            {/* Route for Sign Up */}
            <Route path="/sign-up/*" element={<SignUp signInUrl="/" />} />
            
            {/* Route for Home Page */}
            <Route path="/" element={
              <>
                <SignedIn>
                  <HomePage />
                </SignedIn>
                <SignedOut>
                  <SignIn afterSignInUrl="/" signUpUrl="/sign-up" />
                </SignedOut>
              </>
            } />

            {/* Route for /home */}
            <Route path="/home" element={
              <>
                <SignedIn>
                  <HomePage />
                </SignedIn>
                <SignedOut>
                  <SignIn afterSignInUrl="/home" signUpUrl="/sign-up" />
                </SignedOut>
              </>
            } />

            {/* Route for /settings */}
            <Route path="/settings" element={
              <>
                <SignedIn>
                  <SecretsPage />
                </SignedIn>
                <SignedOut>
                  <SignIn afterSignInUrl="/home" signUpUrl="/sign-up" />
                </SignedOut>
              </>
            } />

            {/* Route for /FAQ */}
            <Route path="/FAQ" element={
              <>
                <SignedIn>
                  <FaqPage  />
                </SignedIn>
                <SignedOut>
                  <SignIn afterSignInUrl="/home" signUpUrl="/sign-up" />
                </SignedOut>
              </>
            } />
          </Routes>
        </main>
      </div>
    </ClerkProvider>
  );
}

function App() {
  const [clerkKey, setClerkKey] = useState<string>("");

  useEffect(() => {
    initializeClerkKey().then(key => setClerkKey(key));
  }, []);

  if (!clerkKey) {
    return <div>Loading...</div>;
  }

  return (
    <MemoryRouter>
      <ClerkProviderWithRoutes clerkKey={clerkKey} />
    </MemoryRouter>
  );
}
export default App;
