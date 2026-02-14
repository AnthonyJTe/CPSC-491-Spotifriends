import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const canSubmit = useMemo(() => {
    return email.trim().length > 0 && password.length >= 6;
  }, [email, password]);

  const onLogin = () => {
    // Mock for now: later this becomes Supabase auth
    router.replace("/name");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Log In</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor="#6B6B7A"
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="At least 6 characters"
            placeholderTextColor="#6B6B7A"
            secureTextEntry
            style={styles.input}
          />
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            !canSubmit && styles.primaryButtonDisabled,
            pressed && canSubmit && styles.primaryButtonPressed,
          ]}
          disabled={!canSubmit}
          onPress={onLogin}
        >
          <Text style={styles.primaryButtonText}>Continue</Text>
        </Pressable>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Don&apos;t have an account?</Text>
          <Pressable onPress={() => router.push("/signup")}>
            <Text style={styles.linkText}>Sign up</Text>
          </Pressable>
        </View>

        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0B12",
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  header: {
    marginTop: 18,
    marginBottom: 28,
  },
  title: {
    color: "#F2F2F7",
    fontSize: 34,
    fontWeight: "800",
  },
  form: {
    gap: 14,
  },
  field: {
    gap: 8,
  },
  label: {
    color: "#B8B8C7",
    fontSize: 13,
  },
  input: {
    backgroundColor: "#141426",
    borderWidth: 1,
    borderColor: "#2A2A3C",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#F2F2F7",
    fontSize: 16,
  },
  primaryButton: {
    marginTop: 8,
    backgroundColor: "#7C5CFF",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryButtonPressed: {
    opacity: 0.9,
  },
  primaryButtonDisabled: {
    backgroundColor: "#2A2A3C",
  },
  primaryButtonText: {
    color: "#F2F2F7",
    fontSize: 16,
    fontWeight: "800",
  },
  footerRow: {
    marginTop: 10,
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  footerText: {
    color: "#B8B8C7",
    fontSize: 14,
  },
  linkText: {
    color: "#9A7BFF",
    fontSize: 14,
    fontWeight: "800",
  },
  backButton: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#2A2A3C",
    backgroundColor: "#141426",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  backButtonText: {
    color: "#F2F2F7",
    fontSize: 15,
    fontWeight: "700",
  },
});