import VerificationModal from "@/app/components/VerificationModal";
import { useAuth, useSignIn, useSSO } from "@clerk/expo";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Path } from "react-native-svg";
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants/images";

WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  const router = useRouter();
  // New Clerk SDK (Core 3): useSignIn returns { signIn } — no isLoaded, no setActive
  const { signIn } = useSignIn();
  const { startSSOFlow } = useSSO();
  const { isSignedIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isSignedIn) return null;

  const handleVerify = async (code: string) => {
    if (!signIn) return;

    const { error: verifyError } = await signIn.mfa.verifyEmailCode({ code });

    if (verifyError) {
      throw new Error(verifyError.longMessage ?? verifyError.message ?? "Invalid code.");
    }

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ decorateUrl }) => {
          const url = decorateUrl("/");
          if (url.startsWith("http")) {
            // @ts-ignore
            window.location.href = url;
          } else {
            router.replace("/");
          }
        },
      });
    } else {
      throw new Error("Verification incomplete. Please try again.");
    }
  };

  const handleResend = async () => {
    if (!signIn) return;
    await signIn.mfa.sendEmailCode();
  };

  const handleSocialSignIn = async (strategy: "oauth_google" | "oauth_facebook" | "oauth_apple") => {
    setError("");
    setIsSubmitting(true);
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy,
        redirectUrl: AuthSession.makeRedirectUri({
          path: "sso-callback",
        }),
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
    } catch (err: any) {
      const message = err?.message ?? err?.errors?.[0]?.message ?? "Authentication failed. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignIn = async () => {
    // Guard: signIn is null until Clerk is ready
    if (!signIn || !email || !password) return;

    setError("");
    setIsSubmitting(true);

    try {
      // Core 3 API: signIn.password() returns { error }
      const { error: signInError } = await signIn.password({
        emailAddress: email,
        password,
      });

      if (signInError) {
        setError(
          signInError.longMessage ??
            signInError.message ??
            "Invalid email or password."
        );
        return;
      }

      if (signIn.status === "complete") {
        // Core 3 API: signIn.finalize() replaces setActive()
        await signIn.finalize({
          navigate: ({ decorateUrl }) => {
            const url = decorateUrl("/");
            if (url.startsWith("http")) {
              // @ts-ignore — web fallback
              window.location.href = url;
            } else {
              router.replace("/");
            }
          },
        });
      } else if (signIn.status === "needs_client_trust") {
        const emailCodeFactor = signIn.supportedSecondFactors.find(
          (factor) => factor.strategy === "email_code"
        );

        if (emailCodeFactor) {
          await signIn.mfa.sendEmailCode();
          setShowVerification(true);
        } else {
          setError("Unsupported verification strategy.");
        }
      } else {
        console.error("Sign-in not complete:", signIn.status);
      }
    } catch (err: any) {
      const message =
        err?.errors?.[0]?.longMessage ??
        err?.errors?.[0]?.message ??
        "Invalid email or password.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center mb-6 -ml-2"
          >
            <Ionicons name="chevron-back" size={24} color="#1C1C1E" />
          </TouchableOpacity>

          {/* Heading */}
          <Text
            className="leading-tight mb-1"
            style={{ textAlign: "center", fontSize: 28, fontWeight: "bold", color: "#111827" }}
          >
            Welcome back
          </Text>
          <Text
            className="mb-6"
            style={{ textAlign: "center", fontSize: 28, fontWeight: "bold", color: "#6B7280" }}
          >
            Continue your language journey 🌟
          </Text>

          {/* Mascot */}
          <View style={{ alignItems: "center", width: "100%", marginBottom: 32 }}>
            <Image
              source={images.mascotAuth}
              style={{ width: 200, height: 150 }}
              resizeMode="contain"
            />
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="alex@gmail.com"
              placeholderTextColor="#AEAEBE"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Password Input */}
          <View style={[styles.inputContainer, { marginTop: 12 }]}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={[styles.input, { flex: 1, paddingRight: 0 }]}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholder="••••••••"
                placeholderTextColor="#AEAEBE"
              />
              <TouchableOpacity
                onPress={() => setShowPassword((v) => !v)}
                style={styles.eyeButton}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={22}
                  color="#9090A8"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Inline error */}
          {!!error && (
            <Text className="text-[13px] text-red-500 mt-2">{error}</Text>
          )}

          {/* Sign In Button */}
          <TouchableOpacity
            onPress={handleSignIn}
            style={[styles.primaryButton, isSubmitting && { opacity: 0.7 }]}
            activeOpacity={0.85}
            disabled={isSubmitting || !signIn}
          >
            <Text style={styles.primaryButtonText}>
              {isSubmitting ? "Signing in…" : "Log In"}
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Buttons */}
          <SocialButton icon={<GoogleIcon />} label="Continue with Google" onPress={() => handleSocialSignIn("oauth_google")} />
          <SocialButton icon={<FacebookIcon />} label="Continue with Facebook" onPress={() => handleSocialSignIn("oauth_facebook")} />
          <SocialButton icon={<AppleIcon />} label="Continue with Apple" onPress={() => handleSocialSignIn("oauth_apple")} />

          {/* Footer */}
          <View className="flex-row justify-center items-center mt-8 mb-4">
            <Text className="text-[15px] text-[#9090A8]">
              Don&apos;t have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/auth/sign-up")}>
              <Text className="text-[15px] text-[#6B4EFF] font-semibold">
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <VerificationModal
        visible={showVerification}
        email={email}
        onClose={() => setShowVerification(false)}
        onVerify={handleVerify}
        onResend={handleResend}
      />
    </SafeAreaView>
  );
}

function SocialButton({ icon, label, onPress }: { icon: React.ReactNode; label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.socialButton} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.socialIconWrap}>{icon}</View>
      <Text style={styles.socialButtonText}>{label}</Text>
    </TouchableOpacity>
  );
}

function GoogleIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24">
      <Path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <Path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <Path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <Path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </Svg>
  );
}

function FacebookIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24">
      <Path
        fill="#1877F2"
        d="M24 12c0-6.627-5.373-12-12-12S0 5.373 0 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 22.954 24 17.99 24 12z"
      />
    </Svg>
  );
}

function AppleIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="#000000">
      <Path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.7-1.13 1.84-.99 2.94.97.08 2.06-.52 2.82-1.33z" />
    </Svg>
  );
}

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 8, paddingBottom: 24 },
  inputContainer: { backgroundColor: "#FFFFFF", borderRadius: 16, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12, borderWidth: 1, borderColor: "#EBEBF0", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  inputLabel: { fontSize: 12, color: "#9090A8", fontWeight: "500", marginBottom: 4 },
  input: { fontSize: 16, color: "#111827", padding: 0, margin: 0 },
  passwordRow: { flexDirection: "row", alignItems: "center" },
  eyeButton: { paddingLeft: 8, paddingVertical: 2 },
  primaryButton: { backgroundColor: "#6B4EFF", borderRadius: 16, height: 56, alignItems: "center", justifyContent: "center", marginTop: 20, shadowColor: "#6B4EFF", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  primaryButtonText: { color: "#FFFFFF", fontSize: 17, fontWeight: "700", letterSpacing: 0.3 },
  dividerRow: { flexDirection: "row", alignItems: "center", marginVertical: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#E8E8F0" },
  dividerText: { marginHorizontal: 12, fontSize: 13, color: "#9090A8" },
  socialButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#FFFFFF", borderRadius: 16, height: 56, paddingHorizontal: 20, marginBottom: 10, borderWidth: 1, borderColor: "#EBEBF0", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  socialIconWrap: { width: 28, alignItems: "center", justifyContent: "center", marginRight: 8 },
  socialButtonText: { fontSize: 15, color: "#111827", fontWeight: "600" },
});