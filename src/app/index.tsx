import { useAuth } from "@clerk/expo";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppStore } from "../store/useAppStore";
import { languages } from "../data/languages";

export default function Index() {
  const router = useRouter();
  const { signOut, isSignedIn } = useAuth();
  const { selectedLanguageId } = useAppStore();

  const currentLanguage = languages.find((lang) => lang.id === selectedLanguageId);

  const handleGoToOnboarding = async () => {
    if (isSignedIn) {
      await signOut();
    }
    router.replace("/onboarding");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-5xl font-extrabold text-lingua-purple mb-8">
          lingua
        </Text>

        {currentLanguage && (
          <View className="items-center mb-8 bg-[#F6F7FB] border border-[#E5E7EB] rounded-2xl px-6 py-4">
            <Text className="text-text-secondary text-sm font-semibold mb-1">
              Active Language
            </Text>
            <Text className="text-2xl font-bold text-text-primary">
              {currentLanguage.flagEmoji} {currentLanguage.name} ({currentLanguage.nativeName})
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.selectBtn}
          onPress={() => router.push("/language-select")}
          activeOpacity={0.7}
        >
          <Text style={styles.linkText}>Choose Language 🌐</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.link}
          onPress={handleGoToOnboarding}
          activeOpacity={0.7}
        >
          <Text style={styles.linkText}>Go to Onboarding (Sign Out) →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  selectBtn: {
    marginTop: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    backgroundColor: "#6C4EF5",
    borderRadius: 14,
    width: "80%",
    alignItems: "center",
  },
  link: {
    marginTop: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    backgroundColor: "#5b21b6",
    borderRadius: 14,
    width: "80%",
    alignItems: "center",
  },
  linkText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
