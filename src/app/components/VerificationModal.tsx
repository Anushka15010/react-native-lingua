import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
  console.log("VERIFICATION MODAL LOADED");
  interface VerificationModalProps {
    visible: boolean;
    email: string;
    onClose: () => void;
  }
  
  const CODE_LENGTH = 6;
  
  export default function VerificationModal({
    visible,
    email,
    onClose,
  }: VerificationModalProps) {
    const router = useRouter();
    const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
    const inputRefs = useRef<(TextInput | null)[]>([]);
  
    // Reset code when modal opens
    useEffect(() => {
      if (visible) {
        setCode(Array(CODE_LENGTH).fill(""));
        // Auto-focus first input after animation
        setTimeout(() => {
          inputRefs.current[0]?.focus();
        }, 300);
      }
    }, [visible]);
  
    const handleChange = (text: string, index: number) => {
      // Only allow single digit
      const digit = text.replace(/[^0-9]/g, "").slice(-1);
  
      const newCode = [...code];
      newCode[index] = digit;
      setCode(newCode);
  
      if (digit) {
        if (index < CODE_LENGTH - 1) {
          // Move to next box
          inputRefs.current[index + 1]?.focus();
        } else {
          // Last digit entered — check if all filled
          const fullCode = newCode.join("");
          if (fullCode.length === CODE_LENGTH && !newCode.includes("")) {
            Keyboard.dismiss();
            setTimeout(() => {
              onClose();
              router.replace("/");
            }, 200);
          }
        }
      }
    };
  
    const handleKeyPress = (e: any, index: number) => {
      if (e.nativeEvent.key === "Backspace") {
        if (code[index] === "" && index > 0) {
          // Move to previous box and clear it
          const newCode = [...code];
          newCode[index - 1] = "";
          setCode(newCode);
          inputRefs.current[index - 1]?.focus();
        } else {
          const newCode = [...code];
          newCode[index] = "";
          setCode(newCode);
        }
      }
    };
  
    const maskedEmail = email
      ? email.replace(/(.{2}).+(@.+)/, "$1•••$2")
      : "your email";
  
    return (
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <KeyboardAvoidingView
          style={styles.overlay}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <TouchableOpacity
            style={styles.backdrop}
            activeOpacity={1}
            onPress={() => {
              Keyboard.dismiss();
            }}
          />
  
          <View style={styles.sheet}>
            {/* Handle bar */}
            <View style={styles.handle} />
  
            {/* Close button */}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={{ fontSize: 18, color: "#9090A8" }}>✕</Text>
            </TouchableOpacity>
  
            {/* Icon */}
            <View style={styles.iconWrap}>
            <Text style={{ fontSize: 28 }}>✉️</Text>
            </View>
  
            {/* Title */}
            <Text style={styles.title}>Check your email</Text>
            <Text style={styles.subtitle}>
              We sent a 6-digit code to{"\n"}
              <Text style={styles.emailText}>{maskedEmail}</Text>
            </Text>
  
            {/* Code Boxes */}
            <View style={styles.codeRow}>
              {Array(CODE_LENGTH)
                .fill(0)
                .map((_, i) => (
                  <TextInput
                    key={i}
                    ref={(ref) => {
                      inputRefs.current[i] = ref;
                    }}
                    style={[
                      styles.codeBox,
                      code[i] ? styles.codeBoxFilled : {},
                    ]}
                    value={code[i]}
                    onChangeText={(text) => handleChange(text, i)}
                    onKeyPress={(e) => handleKeyPress(e, i)}
                    keyboardType="number-pad"
                    maxLength={1}
                    selectTextOnFocus
                    caretHidden
                    textAlign="center"
                  />
                ))}
            </View>
  
            {/* Resend */}
            <View style={styles.resendRow}>
              <Text style={styles.resendText}>Didn't receive it? </Text>
              <TouchableOpacity>
                <Text style={styles.resendLink}>Resend code</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  }
  
  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: "flex-end",
    },
    backdrop: {
        ...StyleSheet.absoluteFill,
        backgroundColor: "rgba(0,0,0,0.45)",
      },
    sheet: {
      backgroundColor: "#FFFFFF",
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      paddingHorizontal: 28,
      paddingTop: 12,
      paddingBottom: 48,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.12,
      shadowRadius: 20,
      elevation: 20,
    },
    handle: {
      width: 40,
      height: 4,
      backgroundColor: "#E0E0EA",
      borderRadius: 2,
      marginBottom: 20,
    },
    closeButton: {
      position: "absolute",
      top: 20,
      right: 24,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: "#F4F4F8",
      alignItems: "center",
      justifyContent: "center",
    },
    iconWrap: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: "#EEE9FF",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 16,
    },
    title: {
      fontSize: 22,
      fontWeight: "700",
      color: "#1C1C1E",
      marginBottom: 8,
      textAlign: "center",
    },
    subtitle: {
      fontSize: 14,
      color: "#9090A8",
      textAlign: "center",
      lineHeight: 20,
      marginBottom: 28,
    },
    emailText: {
      color: "#1C1C1E",
      fontWeight: "600",
    },
    codeRow: {
      flexDirection: "row",
      gap: 10,
      marginBottom: 24,
    },
    codeBox: {
      width: 48,
      height: 56,
      borderRadius: 14,
      borderWidth: 1.5,
      borderColor: "#DDDDE8",
      backgroundColor: "#F8F8FF",
      fontSize: 22,
      fontWeight: "700",
      color: "#1C1C1E",
      textAlign: "center",
    },
    codeBoxFilled: {
      borderColor: "#5B4FCF",
      backgroundColor: "#EEE9FF",
    },
    resendRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    resendText: {
      fontSize: 14,
      color: "#9090A8",
    },
    resendLink: {
      fontSize: 14,
      color: "#5B4FCF",
      fontWeight: "600",
    },
  });
  