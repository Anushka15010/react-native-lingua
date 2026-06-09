import { ClerkProvider, useAuth } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { useAppStore } from "../store/useAppStore";
import { Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { fonts } from "../theme/fonts";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error("Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to your .env file");
}

SplashScreen.preventAutoHideAsync();

// ─── Auth Gate ────────────────────────────────────────────────────────────────
// Redirects users based on their auth state and selected language:
//   - Signed in, no language selected → /language-select
//   - Signed in, onboarding/auth screens → / (home)
function AuthGate() {
  const { isSignedIn, isLoaded } = useAuth();
  const { selectedLanguageId, hasHydrated } = useAppStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded || !hasHydrated) return;

    const inAuthGroup = segments[0] === "auth";
    const inOnboarding = segments[0] === "onboarding";
    const inLanguageSelect = segments[0] === "language-select";

    if (isSignedIn) {
      if (!selectedLanguageId) {
        if (!inLanguageSelect) {
          router.replace("/language-select");
        }
      } else {
        if (inAuthGroup || inOnboarding) {
          router.replace("/");
        }
      }
    }
  }, [isSignedIn, isLoaded, hasHydrated, selectedLanguageId, segments, router]);

  return <Slot />;
}

// ─── Root Layout ──────────────────────────────────────────────────────────────
export default function RootLayout() {
  const [loaded, error] = useFonts(fonts);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ClerkProvider publishableKey={publishableKey} tokenCache={Platform.OS !== "web" ? tokenCache : undefined}>
        <AuthGate />
      </ClerkProvider>
    </SafeAreaProvider>
  );
}