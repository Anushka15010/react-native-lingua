import VerificationModal from "@/app/components/VerificationModal";
import { useRouter } from "expo-router";
import { useState } from "react";
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
  
  export default function SignInScreen() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [showVerification, setShowVerification] = useState(false);
  
    const handleSignIn = () => {
      if (!email) return;
      setShowVerification(true);
    };
  
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F8FF" }}>
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
              className="w-10 h-10 items-center justify-center mb-6"
            >
              <Text style={{ fontSize: 24, color: "#1C1C1E" }}>‹</Text>
            </TouchableOpacity>
  
            {/* Heading */}
            <Text className="text-[28px] font-bold text-[#1C1C1E] leading-tight mb-1">
              Welcome back
            </Text>
            <Text className="text-[16px] text-[#6B6B8D] mb-6">
              Continue your language journey 🌟
            </Text>
  
            {/* Mascot */}
            <View className="items-center mb-8">
              <Image
                source={images.mascot}
                style={{ width: 140, height: 130 }}
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
  
            {/* Sign In Button */}
            <TouchableOpacity
              onPress={handleSignIn}
              style={styles.primaryButton}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryButtonText}>Log In</Text>
            </TouchableOpacity>
  
            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>
  
            {/* Social Buttons */}
            <SocialButton
              icon={<GoogleIcon />}
              label="Continue with Google"
              onPress={() => {}}
            />
            <SocialButton
              icon={<FacebookIcon />}
              label="Continue with Facebook"
              onPress={() => {}}
            />
            <SocialButton
              icon={<AppleIcon />}
              label="Continue with Apple"
              onPress={() => {}}
            />
  
            {/* Footer */}
            <View className="flex-row justify-center items-center mt-8 mb-4">
              <Text className="text-[15px] text-[#9090A8]">
                Don't have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => router.push("/auth/sign-up")}>
                <Text className="text-[15px] text-[#5B4FCF] font-semibold">
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
  
        {/* Verification Modal */}
        <VerificationModal
          visible={showVerification}
          email={email}
          onClose={() => setShowVerification(false)}
        />
      </SafeAreaView>
    );
  }
  
  // ─── Social Button ────────────────────────────────────────────────────────────
  function SocialButton({
    icon,
    label,
    onPress,
  }: {
    icon: React.ReactNode;
    label: string;
    onPress: () => void;
  }) {
    return (
      <TouchableOpacity style={styles.socialButton} onPress={onPress} activeOpacity={0.8}>
        <View style={styles.socialIconWrap}>{icon}</View>
        <Text style={styles.socialButtonText}>{label}</Text>
      </TouchableOpacity>
    );
  }
  
  function GoogleIcon() {
    return (
      <View style={{ width: 24, height: 24 }}>
        <Text style={{ fontSize: 22, lineHeight: 24 }}>🇬</Text>
      </View>
    );
  }
  
  function FacebookIcon() {
    return (
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: "#1877F2",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "800", fontSize: 14, lineHeight: 18 }}>
          f
        </Text>
      </View>
    );
  }
  
  function AppleIcon() {
    return <Text style={{ fontSize: 20, color: "#1C1C1E" }}>􀣺</Text>;
  }
  // ─── Styles ───────────────────────────────────────────────────────────────────
  const styles = StyleSheet.create({
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 24,
      paddingTop: 8,
      paddingBottom: 24,
    },
    inputContainer: {
      backgroundColor: "#FFFFFF",
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 12,
      borderWidth: 1,
      borderColor: "#EBEBF0",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 4,
      elevation: 1,
    },
    inputLabel: {
      fontSize: 12,
      color: "#9090A8",
      fontWeight: "500",
      marginBottom: 4,
    },
    input: {
      fontSize: 16,
      color: "#1C1C1E",
      padding: 0,
      margin: 0,
    },
    primaryButton: {
      backgroundColor: "#5B4FCF",
      borderRadius: 16,
      height: 56,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 20,
      shadowColor: "#5B4FCF",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 6,
    },
    primaryButtonText: {
      color: "#FFFFFF",
      fontSize: 17,
      fontWeight: "700",
      letterSpacing: 0.3,
    },
    dividerRow: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 20,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: "#E8E8F0",
    },
    dividerText: {
      marginHorizontal: 12,
      fontSize: 13,
      color: "#9090A8",
    },
    socialButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#FFFFFF",
      borderRadius: 16,
      height: 56,
      paddingHorizontal: 20,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: "#EBEBF0",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 4,
      elevation: 1,
    },
    socialIconWrap: {
      width: 28,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    socialButtonText: {
      fontSize: 15,
      color: "#1C1C1E",
      fontWeight: "500",
    },
  });
  