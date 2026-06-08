import { ClerkProvider, useAuth } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error("Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to your .env file");
}

// ─── Auth Gate ────────────────────────────────────────────────────────────────
// Redirects users based on their auth state:
//   - Signed out → /onboarding
//   - Signed in  → / (home)
function AuthGate() {
  const { isSignedIn, isLoaded } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    const inAuthGroup = segments[0] === "auth";
    const inOnboarding = segments[0] === "onboarding";

    if (!isSignedIn) {
      if (!inAuthGroup && !inOnboarding) {
        router.replace("/onboarding");
      }
    } else {
      if (inAuthGroup || inOnboarding) {
        router.replace("/");
      }
    }
  }, [isSignedIn, isLoaded, segments, router]);

  return <Slot />;
}

// ─── Root Layout ──────────────────────────────────────────────────────────────
export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <AuthGate />
    </ClerkProvider>
  );
}