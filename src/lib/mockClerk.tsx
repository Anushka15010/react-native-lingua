import React, { createContext, useContext, useState, useEffect } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";

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
      await SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

// Check if we are running in Mock Clerk mode
const publishableKeyFromEnv = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || "mock_key";
const USE_MOCK = 
  process.env.EXPO_PUBLIC_USE_MOCK_CLERK === "true" ||
  publishableKeyFromEnv === "mock_key";

// Context for mock mode
const MockClerkContext = createContext<{
  isLoaded: boolean;
  isSignedIn: boolean;
  userId: string | null;
  user: any | null;
  signOut: () => Promise<void>;
  signIn: any;
  signUp: any;
  setActive: (options: { session: string | null } | null) => Promise<void>;
  startOAuthFlow: () => Promise<any>;
} | null>(null);

function createMockUser(email: string) {
  return {
    id: "user_" + Math.random().toString(36).substring(2, 9),
    fullName: email.split("@")[0],
    firstName: email.split("@")[0],
    imageUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
    emailAddresses: [{ emailAddress: email }],
  };
}

export function MockClerkProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [mockEmail, setMockEmail] = useState<string>("");

  useEffect(() => {
    const loadMockSession = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("mock_user_id");
        const storedUserData = await AsyncStorage.getItem("mock_user_data");
        if (storedUserId && storedUserData) {
          setUserId(storedUserId);
          setUser(JSON.parse(storedUserData));
        }
      } catch (e) {
        console.error("Failed to load mock session", e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadMockSession();
  }, []);

  const loginAs = async (email: string) => {
    const mockUser = createMockUser(email);
    await AsyncStorage.setItem("mock_user_id", mockUser.id);
    await AsyncStorage.setItem("mock_user_data", JSON.stringify(mockUser));
    setUserId(mockUser.id);
    setUser(mockUser);
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem("mock_user_id");
      await AsyncStorage.removeItem("mock_user_data");
      setUserId(null);
      setUser(null);
    } catch (e) {
      console.error("Failed to sign out", e);
    }
  };

  const setActive = async (options: { session: string | null } | null) => {
    if (options && options.session) {
      await loginAs(mockEmail || "learner@muolingo.com");
    } else {
      await signOut();
    }
  };

  const signIn = {
    emailCode: {
      sendCode: async (args: { emailAddress: string }) => {
        setMockEmail(args.emailAddress);
        return { error: null };
      },
      verifyCode: async (args: { code: string }) => {
        return { error: null };
      }
    },
    finalize: async (args: { navigate: () => void }) => {
      await loginAs(mockEmail || "learner@muolingo.com");
      args.navigate();
      return { error: null };
    },
    status: "complete",
    createdSessionId: "mock_session_123",
  };

  const signUp = {
    password: async (args: { emailAddress: string; password?: string }) => {
      setMockEmail(args.emailAddress);
      return { error: null };
    },
    verifications: {
      sendEmailCode: async () => {
        return { error: null };
      },
      verifyEmailCode: async (args: { code: string }) => {
        return { error: null };
      }
    },
    finalize: async (args: { navigate: () => void }) => {
      await loginAs(mockEmail || "learner@muolingo.com");
      args.navigate();
      return { error: null };
    },
    status: "complete",
    createdSessionId: "mock_session_123",
  };

  const startOAuthFlow = async () => {
    const email = "oauth.learner@muolingo.com";
    setMockEmail(email);
    return {
      createdSessionId: "mock_oauth_session",
      setActive: async (options: any) => {
        await loginAs(email);
      }
    };
  };

  return (
    <MockClerkContext.Provider
      value={{
        isLoaded,
        isSignedIn: !!userId,
        userId,
        user,
        signOut,
        signIn,
        signUp,
        setActive,
        startOAuthFlow,
      }}
    >
      {children}
    </MockClerkContext.Provider>
  );
}

// ----------------------------------------------------
// Mock Implementations of Hooks
// ----------------------------------------------------
function useMockAuth() {
  const context = useContext(MockClerkContext);
  if (!context) {
    return {
      isLoaded: true,
      isSignedIn: false,
      userId: null,
      signOut: async () => {},
    };
  }
  return {
    isLoaded: context.isLoaded,
    isSignedIn: context.isSignedIn,
    userId: context.userId,
    signOut: context.signOut,
  };
}

function useMockUser() {
  const context = useContext(MockClerkContext);
  if (!context) {
    return {
      isLoaded: true,
      isSignedIn: false,
      user: null,
    };
  }
  return {
    isLoaded: context.isLoaded,
    isSignedIn: context.isSignedIn,
    user: context.user,
  };
}

function useMockSignIn() {
  const context = useContext(MockClerkContext);
  if (!context) {
    return {
      signIn: null,
      fetchStatus: "idle",
      isLoaded: true,
      setActive: async () => {},
    };
  }
  return {
    signIn: context.signIn,
    fetchStatus: "idle",
    isLoaded: context.isLoaded,
    setActive: context.setActive,
  };
}

function useMockSignUp() {
  const context = useContext(MockClerkContext);
  if (!context) {
    return {
      signUp: null,
      fetchStatus: "idle",
      isLoaded: true,
      setActive: async () => {},
    };
  }
  return {
    signUp: context.signUp,
    fetchStatus: "idle",
    isLoaded: context.isLoaded,
    setActive: context.setActive,
  };
}

function useMockOAuth(options: any) {
  const context = useContext(MockClerkContext);
  return {
    startOAuthFlow: context ? context.startOAuthFlow : async () => ({
      createdSessionId: "mock_oauth_session",
      setActive: async () => {},
    }),
  };
}

// ----------------------------------------------------
// Real Implementations of Hooks
// ----------------------------------------------------
function useRealAuth() {
  const { isLoaded, isSignedIn, userId, signOut } = useClerkAuth();
  return {
    isLoaded,
    isSignedIn,
    userId,
    signOut,
  };
}

function useRealUser() {
  const { isLoaded, isSignedIn, user } = useClerkUser();
  return {
    isLoaded,
    isSignedIn,
    user,
  };
}

function useRealSignIn() {
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

function useRealSignUp() {
  const { signUp, fetchStatus } = useClerkSignUp();
  const { setActive } = useClerk();

  return {
    signUp,
    fetchStatus,
    isLoaded: true,
    setActive,
  };
}

function useRealOAuth(options: any) {
  const { startOAuthFlow } = useClerkOAuth(options);
  return {
    startOAuthFlow,
  };
}

// ----------------------------------------------------
// Exports based on USE_MOCK static config
// ----------------------------------------------------
export function ClerkProvider({ children, publishableKey, tokenCache, ...props }: any) {
  if (USE_MOCK) {
    return <MockClerkProvider>{children}</MockClerkProvider>;
  }
  return (
    <ClerkProviderReal publishableKey={publishableKey} tokenCache={tokenCache} {...props}>
      {children}
    </ClerkProviderReal>
  );
}

export function ClerkLoaded({ children }: { children: React.ReactNode }) {
  const context = useContext(MockClerkContext);
  if (USE_MOCK) {
    return context && context.isLoaded ? <>{children}</> : null;
  }
  return <ClerkLoadedReal>{children}</ClerkLoadedReal>;
}

export const useAuth = USE_MOCK ? useMockAuth : useRealAuth;
export const useUser = USE_MOCK ? useMockUser : useRealUser;
export const useSignIn = USE_MOCK ? useMockSignIn : useRealSignIn;
export const useSignUp = USE_MOCK ? useMockSignUp : useRealSignUp;
export const useOAuth = USE_MOCK ? useMockOAuth : useRealOAuth;
