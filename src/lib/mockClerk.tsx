import React, { createContext, useContext, useState } from "react";

// Mock tokenCache
export const tokenCache = {
  getToken: async (key: string) => "",
  saveToken: async (key: string, value: string) => {},
};

const AuthContext = createContext<any>(null);

export function ClerkProvider({ children, ...props }: { children: React.ReactNode; [key: string]: any }) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [session, setSession] = useState<string | null>(null);

  return (
    <AuthContext.Provider value={{ isSignedIn, setIsSignedIn, session, setSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function ClerkLoaded({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  return {
    isLoaded: true,
    isSignedIn: context ? context.isSignedIn : false,
    userId: context && context.isSignedIn ? "mock_user_123" : null,
    signOut: async () => {
      if (context) {
        context.setIsSignedIn(false);
        context.setSession(null);
      }
    },
  };
}

export function useUser() {
  const context = useContext(AuthContext);
  return {
    isLoaded: true,
    isSignedIn: context ? context.isSignedIn : false,
    user: context && context.isSignedIn ? {
      id: "mock_user_123",
      firstName: "Jane",
      lastName: "Doe",
      fullName: "Jane Doe",
      imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
      emailAddresses: [{ emailAddress: "jane.doe@example.com" }],
    } : null,
  };
}

export function useSignIn() {
  const context = useContext(AuthContext);
  
  const mockSignIn: any = {
    status: "complete",
    createdSessionId: "sess_123",
    firstFactorVerification: {
      status: "complete",
      externalVerificationRedirectURL: "http://localhost:8085/oauth-native-callback?rotating_token_nonce=mock_nonce",
    },
    emailCode: {
      sendCode: async (args: any): Promise<{ error: any }> => {
        return { error: null };
      },
      verifyCode: async (args: any): Promise<{ error: any }> => {
        return { error: null };
      },
    },
    finalize: async (args: any) => {
      if (context) {
        context.setIsSignedIn(true);
        context.setSession("sess_123");
      }
      if (args && args.navigate) {
        args.navigate();
      }
    },
    create: async (args: any): Promise<{ error: any }> => {
      return { error: null };
    },
    reload: async (args: any): Promise<{ error: any }> => {
      return { error: null };
    },
  };

  return {
    signIn: mockSignIn,
    fetchStatus: "loaded" as any,
    isLoaded: true,
    setActive: async (args: any) => {
      if (context) {
        context.setIsSignedIn(true);
        context.setSession(args.session);
      }
    },
  };
}

export function useSignUp() {
  const context = useContext(AuthContext);

  const mockSignUp: any = {
    status: "complete",
    createdSessionId: "sess_123",
    firstFactorVerification: {
      status: "complete",
    },
    password: async (args: any): Promise<{ error: any }> => {
      return { error: null };
    },
    verifications: {
      sendEmailCode: async (): Promise<{ error: any }> => {
        return { error: null };
      },
      verifyEmailCode: async (args: any): Promise<{ error: any }> => {
        return { error: null };
      },
    },
    finalize: async (args: any) => {
      if (context) {
        context.setIsSignedIn(true);
        context.setSession("sess_123");
      }
      if (args && args.navigate) {
        args.navigate();
      }
    },
    create: async (args: any): Promise<{ error: any }> => {
      return { error: null };
    },
  };

  return {
    signUp: mockSignUp,
    fetchStatus: "loaded" as any,
    isLoaded: true,
    setActive: async (args: any) => {
      if (context) {
        context.setIsSignedIn(true);
        context.setSession(args.session);
      }
    },
  };
}

export function useOAuth(options: any) {
  const context = useContext(AuthContext);
  return {
    startOAuthFlow: async () => {
      return {
        createdSessionId: "sess_123",
        setActive: (args: any) => {
          if (context) {
            context.setIsSignedIn(true);
            context.setSession(args.session);
          }
        },
      };
    },
  };
}
