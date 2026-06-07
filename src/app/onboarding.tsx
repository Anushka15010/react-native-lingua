import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const mascotLogo = require("../assets/images/moscot-logo.png");
const mascotWelcome = require("../assets/images/mascot-welcome.png");

const SCREEN_WIDTH = Dimensions.get("window").width;
const MAX_WIDTH = 430;

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.centerWrapper}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          style={styles.scroll}
        >
          <View style={styles.logoRow}>
            <Image
              source={mascotLogo}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.logoText}>lingua</Text>
          </View>

          <View style={styles.headingContainer}>
            <Text style={styles.headingDark}>Your AI language </Text>
            <Text style={styles.headingPurple}>teacher.</Text>
          </View>

          <View style={styles.subtitleContainer}>
            <Text style={styles.subtitle}>
              Real conversations, personalized{"\n"}lessons, anytime, anywhere.
            </Text>
          </View>

          <View style={styles.mascotContainer}>
            <View style={[styles.bubble, styles.bubbleHello]}>
              <Text style={styles.bubbleTextDark}>Hello!</Text>
            </View>
            <View style={[styles.bubble, styles.bubbleHola]}>
              <Text style={styles.bubbleTextPurple}>Hola!</Text>
            </View>
            <View style={[styles.bubble, styles.bubbleChinese]}>
              <Text style={styles.bubbleTextRed}>你好!</Text>
            </View>
            <Image
              source={mascotWelcome}
              style={styles.mascotImage}
              resizeMode="contain"
            />
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/")}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>Get Started</Text>
            <Text style={styles.buttonArrow}>›</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  centerWrapper: {
    flex: 1,
    width: "100%",
    maxWidth: MAX_WIDTH,
    backgroundColor: "#ffffff",
    alignSelf: "center",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    marginBottom: 32,
  },
  logoImage: {
    width: 40,
    height: 40,
    marginRight: 8,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
  headingContainer: {
    paddingHorizontal: 32,
    marginBottom: 12,
  },
  headingDark: {
    fontSize: 36,
    fontWeight: "800",
    color: "#111827",
    lineHeight: 44,
  },
  headingPurple: {
    fontSize: 36,
    fontWeight: "800",
    color: "#5b21b6",
    lineHeight: 44,
  },
  subtitleContainer: {
    paddingHorizontal: 32,
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    lineHeight: 24,
  },
  mascotContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    height: 320,
    marginHorizontal: 16,
  },
  mascotImage: {
    width: 260,
    height: 270,
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
    top: 40,
    left: 16,
    zIndex: 10,
  },
  bubbleHola: {
    backgroundColor: "#eeeaff",
    top: 10,
    right: 16,
    zIndex: 10,
  },
  bubbleChinese: {
    backgroundColor: "#fff0f0",
    top: 120,
    right: 10,
    zIndex: 10,
  },
  bubbleTextDark: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1a1a2e",
  },
  bubbleTextPurple: {
    fontSize: 15,
    fontWeight: "600",
    color: "#5b21b6",
  },
  bubbleTextRed: {
    fontSize: 15,
    fontWeight: "600",
    color: "#dc2626",
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 8,
  },
  button: {
    backgroundColor: "#5b21b6",
    borderRadius: 18,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#5b21b6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  buttonArrow: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "700",
    marginLeft: 10,
    lineHeight: 24,
  },
});
