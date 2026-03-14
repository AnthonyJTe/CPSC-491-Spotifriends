import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { supabase } from "../lib/supabase";

const normalizeName = (value: string) =>
  value.replace(/\s+/g, " ").trim();

export default function NameScreen() {
  const [name, setName] = useState("");
  const [touched, setTouched] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const cleanName = normalizeName(name);
  const nameTooShort = touched && cleanName.length > 0 && cleanName.length < 2;

  const canContinue = useMemo(() => {
    return cleanName.length >= 2 && !loading;
  }, [cleanName, loading]);

  const onContinue = async () => {
    setTouched(true);
    setErrorMessage("");

    if (cleanName.length < 2) {
      setErrorMessage("Please enter at least 2 characters.");
      return;
    }

    try {
      setLoading(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setErrorMessage("We couldn’t find your account. Please log in again.");
        setLoading(false);
        return;
      }

      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        display_name: cleanName,
      });

      if (error) {
        console.log("Profile save error:", error.message);
        setErrorMessage("We couldn’t save your name. Please try again.");
        setLoading(false);
        return;
      }

      setLoading(false);
      router.push({
        pathname: "/photos",
        params: { name: cleanName },
      });
    } catch (error) {
      console.log("Unexpected profile save error:", error);
      setErrorMessage("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.glow} />

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.stepText}>Step 1 of onboarding</Text>
          <Text style={styles.title}>What is your name?</Text>
          <Text style={styles.subtitle}>
            This is how your profile will appear to other users.
          </Text>

          <View style={styles.field}>
            <Text style={styles.label}>Display name</Text>
            <TextInput
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (errorMessage) setErrorMessage("");
              }}
              onBlur={() => setTouched(true)}
              placeholder="Name"
              placeholderTextColor="#6B6B7A"
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="done"
              editable={!loading}
              maxLength={30}
              style={[styles.input, (nameTooShort || errorMessage) && styles.inputError]}
              onSubmitEditing={onContinue}
            />

            {nameTooShort ? (
              <Text style={styles.helperError}>
                Name must be at least 2 characters.
              </Text>
            ) : (
              <Text style={styles.helperText}>
                Keep it short and recognizable.
              </Text>
            )}
          </View>

          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}

          <Pressable
            disabled={!canContinue}
            onPress={onContinue}
            style={({ pressed }) => [
              styles.primaryButton,
              !canContinue && styles.primaryButtonDisabled,
              pressed && canContinue && styles.primaryButtonPressed,
            ]}
          >
            {loading ? (
              <ActivityIndicator color="#F2F2F7" />
            ) : (
              <Text style={styles.primaryButtonText}>Continue</Text>
            )}
          </Pressable>

          <Pressable
            onPress={() => router.back()}
            disabled={loading}
            style={({ pressed }) => [
              styles.backButton,
              pressed && !loading && styles.backButtonPressed,
              loading && styles.buttonDisabled,
            ]}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0B12",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  glow: {
    position: "absolute",
    top: 120,
    alignSelf: "center",
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: "#7C5CFF",
    opacity: 0.08,
  },
  content: {
    width: "100%",
  },
  card: {
    width: "100%",
    gap: 14,
    backgroundColor: "#11111A",
    borderWidth: 1,
    borderColor: "#232336",
    borderRadius: 24,
    padding: 20,
  },
  stepText: {
    color: "#9A7BFF",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  title: {
    color: "#F2F2F7",
    fontSize: 34,
    fontWeight: "800",
    marginBottom: 2,
  },
  subtitle: {
    color: "#B8B8C7",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 4,
  },
  field: {
    gap: 8,
  },
  label: {
    color: "#B8B8C7",
    fontSize: 13,
    fontWeight: "600",
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
  inputError: {
    borderColor: "#FF6B6B",
  },
  helperText: {
    color: "#6B6B7A",
    fontSize: 12,
    lineHeight: 18,
  },
  helperError: {
    color: "#FF8B8B",
    fontSize: 12,
    lineHeight: 18,
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 14,
    fontWeight: "600",
    marginTop: -2,
  },
  primaryButton: {
    backgroundColor: "#7C5CFF",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
    minHeight: 52,
  },
  primaryButtonDisabled: {
    backgroundColor: "#2A2A3C",
  },
  primaryButtonPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  primaryButtonText: {
    color: "#F2F2F7",
    fontSize: 16,
    fontWeight: "800",
  },
  backButton: {
    borderWidth: 1,
    borderColor: "#2A2A3C",
    backgroundColor: "#141426",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  backButtonPressed: {
    opacity: 0.9,
  },
  backButtonText: {
    color: "#F2F2F7",
    fontSize: 15,
    fontWeight: "700",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});