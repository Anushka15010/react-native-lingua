import React from "react";
import {
  useSignIn as useClerkSignIn,
  useSignUp as useClerkSignUp,
  useAuth as useClerkAuth,
  useUser as useClerkUser,
  useOAuth as useClerkOAuth,
  useClerk,
  ClerkProvider as ClerkProviderReal,
  ClerkLoaded as ClerkLoadedReal,
} from "@clerk/expo";
import * as SecureStore from "expo-secure-store";

// Real tokenCache using expo-secure-store
export const tokenCache = {
  async getToken(key: string) {
    try {
      const item = await SecureStore.getItemAsync(key);
      if (item) {
        console.log(`${key} was used 🔐 \n`);
      } else {
        console.log("No values stored under key: " + key);
      }
      return item;
    } catch (error) {
      console.error("SecureStore get item error: ", error);
      await SecureStore.deleteItemAsync(key);
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

// Re-export standard Clerk Provider & Loader
export function ClerkProvider({ children, publishableKey, tokenCache, ...props }: any) {
  return (
    <ClerkProviderReal publishableKey={publishableKey} tokenCache={tokenCache} {...props}>
      {children}
    </ClerkProviderReal>
  );
}

export const ClerkLoaded = ClerkLoadedReal;

// Wrapped useAuth hook
export function useAuth() {
  const { isLoaded, isSignedIn, userId, signOut } = useClerkAuth();
  return {
    isLoaded,
    isSignedIn,
    userId,
    signOut,
  };
}

// Wrapped useUser hook
export function useUser() {
  const { isLoaded, isSignedIn, user } = useClerkUser();
  return {
    isLoaded,
    isSignedIn,
    user,
  };
}

// Wrapped useSignIn hook
export function useSignIn() {
  const { signIn, fetchStatus } = useClerkSignIn();
  const { setActive } = useClerk();

  const wrappedSignIn = signIn ? new Proxy(signIn, {
    get(target, prop) {
      if (prop === "reload") {
        return async (args: any) => {
          if (typeof (target as any).reload === "function") {
            return await (target as any).reload.bind(target)(args);
          }
          return { error: null };
        };
      }
      const value = Reflect.get(target, prop);
      if (typeof value === "function") {
        return value.bind(target);
      }
      return value;
    }
  }) : null;

  return {
    signIn: wrappedSignIn as any,
    fetchStatus,
    isLoaded: true,
    setActive,
  };
}

// Wrapped useSignUp hook
export function useSignUp() {
  const { signUp, fetchStatus } = useClerkSignUp();
  const { setActive } = useClerk();

  return {
    signUp,
    fetchStatus,
    isLoaded: true,
    setActive,
  };
}

// Wrapped useOAuth hook
export function useOAuth(options: any) {
  const { startOAuthFlow } = useClerkOAuth(options);
  return {
    startOAuthFlow,
  };
}
