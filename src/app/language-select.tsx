import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../constants/images";
import { languages } from "../data/languages";
import { useAppStore } from "../store/useAppStore";

const flagUrls: Record<string, string> = {
  es: "https://flagcdn.com/w160/es.png",
  fr: "https://flagcdn.com/w160/fr.png",
  ja: "https://flagcdn.com/w160/jp.png",
  ko: "https://flagcdn.com/w160/kr.png",
  de: "https://flagcdn.com/w160/de.png",
  zh: "https://flagcdn.com/w160/cn.png",
};

export default function LanguageSelectScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { selectedLanguageId, setSelectedLanguageId } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [tempSelectedId, setTempSelectedId] = useState<string | null>(
    selectedLanguageId
  );

  const filteredLanguages = languages.filter(
    (lang) =>
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConfirm = () => {
    if (tempSelectedId) {
      setSelectedLanguageId(tempSelectedId);
      router.push("/");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={28} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Choose a language</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#6B7280" style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Search languages"
            placeholderTextColor="#6B7280"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Section Header */}
          <Text style={styles.sectionTitle}>Popular</Text>

          {/* Languages List */}
          {filteredLanguages.map((lang) => {
            const isSelected = tempSelectedId === lang.id;
            return (
              <TouchableOpacity
                key={lang.id}
                onPress={() => setTempSelectedId(lang.id)}
                activeOpacity={0.9}
                style={[
                  styles.languageCard,
                  isSelected ? styles.languageCardSelected : styles.languageCardNormal,
                ]}
              >
                <View style={styles.cardLeft}>
                  {/* Flag Container */}
                  <View style={styles.flagCircle}>
                    <Image
                      source={{ uri: flagUrls[lang.id] }}
                      style={styles.flagImage}
                      resizeMode="cover"
                    />
                  </View>

                  {/* Name and Learner Count */}
                  <View style={styles.cardTexts}>
                    <Text style={styles.languageName}>{lang.name}</Text>
                    {lang.learnerCount && (
                      <Text style={styles.learnerCount}>{lang.learnerCount}</Text>
                    )}
                  </View>
                </View>

                {/* Right Selection Indicator */}
                {isSelected ? (
                  <Ionicons name="checkmark-circle" size={24} color="#6C4EF5" />
                ) : (
                  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                )}
              </TouchableOpacity>
            );
          })}

          {/* See all languages button */}
          {searchQuery.length === 0 && (
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.seeAllButton}
              onPress={() => alert("All languages are already displayed!")}
            >
              <View style={styles.cardLeft}>
                <Ionicons name="globe-outline" size={24} color="#374151" style={{ marginRight: 16 }} />
                <Text style={styles.seeAllText}>See all languages</Text>
              </View>
            </TouchableOpacity>
          )}

          {filteredLanguages.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No languages match &quot;{searchQuery}&quot;
              </Text>
            </View>
          )}

          {/* Confirmation Button */}
          <View style={styles.confirmButtonContainer}>
            <TouchableOpacity
              onPress={handleConfirm}
              disabled={!tempSelectedId}
              activeOpacity={0.8}
              style={[
                styles.confirmButton,
                !tempSelectedId ? styles.confirmButtonDisabled : {},
              ]}
            >
              <Text style={styles.confirmButtonText}>Confirm Selection</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Earth Illustration Footer */}
        <View style={styles.footerContainer}>
          <Image
            source={images.earth}
            style={{ width: width, height: width * 0.44 }}
            resizeMode="cover"
          />
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
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    flex: 1,
    marginRight: 8,
  },
  headerPlaceholder: {
    width: 36,
  },
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6F7FB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 28,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#0D132B",
    fontFamily: "Poppins-Regular",
    paddingVertical: 0,
    marginLeft: 8,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 0,
  },
  content: {
    paddingHorizontal: 24,
    flex: 1,
  },
  sectionTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  languageCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 3,
    elevation: 1,
  },
  languageCardNormal: {
    borderColor: "#E5E7EB",
    backgroundColor: "#ffffff",
  },
  languageCardSelected: {
    borderColor: "#6C4EF5",
    backgroundColor: "#ffffff",
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  flagCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F0F2F5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  flagImage: {
    width: "100%",
    height: "100%",
  },
  cardTexts: {
    flexDirection: "column",
  },
  languageName: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  learnerCount: {
    fontFamily: "Poppins-Regular",
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  emptyContainer: {
    paddingVertical: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
  confirmButtonContainer: {
    marginTop: 16,
    marginBottom: 12,
  },
  confirmButton: {
    backgroundColor: "#6C4EF5",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#6C4EF5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmButtonDisabled: {
    backgroundColor: "#A5B4FC",
    shadowOpacity: 0,
    elevation: 0,
  },
  confirmButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Poppins-Bold",
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    backgroundColor: "#ffffff",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 3,
    elevation: 1,
  },
  seeAllText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  footerContainer: {
    marginTop: 20,
    alignItems: "center",
    width: "100%",
  },
});
