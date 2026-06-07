import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-5xl font-extrabold text-lingua-purple mb-4">
          lingua
        </Text>

        <TouchableOpacity
          style={styles.link}
          onPress={() => router.push("/onboarding")}
          activeOpacity={0.7}
        >
          <Text style={styles.linkText}>Go to Onboarding →</Text>
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
  link: {
    marginTop: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    backgroundColor: "#5b21b6",
    borderRadius: 14,
  },
  linkText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
