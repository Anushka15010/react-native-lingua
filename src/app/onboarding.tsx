import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const mascotLogo = require("../assets/images/moscot-logo.png");
const mascotWelcome = require("../assets/images/mascot-welcome.png");

export default function OnboardingScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  const mascotSize = width * 0.35;
  const headingSize = width < 600 ? 36 : width < 900 ? 48 : 56;
  const subtitleSize = width < 600 ? 16 : 18;
  const logoTextSize = width < 600 ? 24 : 30;
  const logoImageSize = width < 600 ? 40 : 52;
  const bubbleFontSize = width < 600 ? 15 : 18;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { minHeight: height }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Logo Row */}
        <View style={styles.logoRow}>
          <Image
            source={mascotLogo}
            style={{ width: logoImageSize, height: logoImageSize, marginRight: 10 }}
            resizeMode="contain"
          />
          <Text style={[styles.logoText, { fontSize: logoTextSize }]}>lingua</Text>
        </View>

        {/* Heading */}
        <View style={styles.headingContainer}>
          <Text style={[styles.headingDark, { fontSize: headingSize, lineHeight: headingSize * 1.2 }]}>
            Your AI language{" "}
          </Text>
          <Text style={[styles.headingPurple, { fontSize: headingSize, lineHeight: headingSize * 1.2 }]}>
            teacher.
          </Text>
        </View>

        {/* Subtitle */}
        <View style={styles.subtitleContainer}>
          <Text style={[styles.subtitle, { fontSize: subtitleSize }]}>
            Real conversations, personalized lessons, anytime, anywhere.
          </Text>
        </View>

        {/* Mascot + Speech Bubbles */}
        <View style={[styles.mascotContainer, { height: mascotSize * 1.4 }]}>
          <View style={[styles.bubble, styles.bubbleHello]}>
            <Text style={[styles.bubbleTextDark, { fontSize: bubbleFontSize }]}>Hello!</Text>
          </View>
          <View style={[styles.bubble, styles.bubbleHola]}>
            <Text style={[styles.bubbleTextPurple, { fontSize: bubbleFontSize }]}>¡Hola!</Text>
          </View>
          <View style={[styles.bubble, styles.bubbleChinese]}>
            <Text style={[styles.bubbleTextRed, { fontSize: bubbleFontSize }]}>你好!</Text>
          </View>
          <Image
            source={mascotWelcome}
            style={{ width: mascotSize, height: mascotSize * 1.1 }}
            resizeMode="contain"
          />
        </View>

        {/* Pagination Indicators */}
        <View style={styles.indicatorContainer}>
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        {/* Get Started Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/auth/sign-up")}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>Get Started</Text>
            <Ionicons name="chevron-forward" size={20} color="#ffffff" style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 32,
    marginBottom: 40,
  },
  logoText: {
    fontWeight: "700",
    color: "#111827",
  },
  headingContainer: {
    paddingHorizontal: "8%",
    marginBottom: 16,
  },
  headingDark: {
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
  },
  headingPurple: {
    fontWeight: "800",
    color: "#6B4EFF",
    textAlign: "center",
  },
  subtitleContainer: {
    paddingHorizontal: "8%",
    marginBottom: 32,
  },
  subtitle: {
    color: "#6b7280",
    lineHeight: 26,
    textAlign: "center",
  },
  mascotContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: "5%",
    marginBottom: 32,
  },
  bubble: {
    position: "absolute",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  bubbleHello: {
    backgroundColor: "#f0f4ff",
    top: "15%",
    left: "8%",
    zIndex: 10,
  },
  bubbleHola: {
    backgroundColor: "#eeeaff",
    top: "5%",
    right: "8%",
    zIndex: 10,
  },
  bubbleChinese: {
    backgroundColor: "#fff0f0",
    top: "45%",
    right: "6%",
    zIndex: 10,
  },
  bubbleTextDark: {
    fontWeight: "600",
    color: "#1a1a2e",
  },
  bubbleTextPurple: {
    fontWeight: "600",
    color: "#6B4EFF",
  },
  bubbleTextRed: {
    fontWeight: "600",
    color: "#dc2626",
  },
  buttonContainer: {
    paddingHorizontal: "8%",
    paddingBottom: 32,
  },
  button: {
    backgroundColor: "#6B4EFF",
    borderRadius: 20,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#6B4EFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 36,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#E2E8F0",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#6B4EFF",
  },
});
