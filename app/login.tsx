import { router } from "expo-router";
import { useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { supabase } from "../lib/supabase";

const isValidEmail = (value: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
};

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const passwordRef = useRef<TextInput>(null);

  const cleanEmail = email.trim();
  const emailHasError = emailTouched && cleanEmail.length > 0 && !isValidEmail(cleanEmail);
  const passwordHasError = passwordTouched && password.length > 0 && password.length < 6;
  const authHasError = !!errorMessage;

  const canSubmit = useMemo(() => {
    return isValidEmail(cleanEmail) && password.length >= 6 && !loading;
  }, [cleanEmail, password, loading]);

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 8,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -8,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const clearAuthError = () => {
    if (errorMessage) setErrorMessage("");
  };

  const onLogin = async () => {
  setEmailTouched(true);
  setPasswordTouched(true);
  clearAuthError();

  if (!isValidEmail(cleanEmail)) {
    setErrorMessage("Please enter a valid email address.");
    triggerShake();
    return;
  }

  if (password.length < 6) {
    setErrorMessage("Password must be at least 6 characters.");
    triggerShake();
    return;
  }

  setLoading(true);

  const { data, error } = await supabase.auth.signInWithPassword({
    email: cleanEmail,
    password,
  });

  if (error) {
    setLoading(false);
    console.log("Login error:", error.message);

    if (error.message.toLowerCase().includes("invalid login credentials")) {
      setErrorMessage("Incorrect email or password. Please try again.");
    } else {
      setErrorMessage(error.message);
    }

    triggerShake();
    return;
  }

  const user = data.user;

  if (!user) {
    setLoading(false);
    setErrorMessage("No user found after login.");
    triggerShake();
    return;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    setLoading(false);
    setErrorMessage(profileError.message);
    triggerShake();
    return;
  }

  const { data: photos, error: photosError } = await supabase
    .from("profile_photos")
    .select("id")
    .eq("user_id", user.id);

  if (photosError) {
    setLoading(false);
    setErrorMessage(photosError.message);
    triggerShake();
    return;
  }

  const { data: top5, error: top5Error } = await supabase
    .from("user_top5")
    .select("position")
    .eq("user_id", user.id);

  if (top5Error) {
    setLoading(false);
    setErrorMessage(top5Error.message);
    triggerShake();
    return;
  }

  setLoading(false);

  console.log("Login success:", user.id);

  if (!profile) {
    router.replace("/name");
    return;
  }

  if (!photos || photos.length === 0) {
    router.replace("/photos");
    return;
  }

  if (!top5 || top5.length < 5) {
    router.replace("/top5");
    return;
  }

  router.replace("/home");
};

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.glow} />

      <Animated.View
        style={[
          styles.content,
          {
            transform: [{ translateX: shakeAnim }],
          },
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Log In</Text>
          <Text style={styles.subtitle}>Welcome back to Spotifriends.</Text>
        </View>

        <View style={styles.formCard}>
          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  clearAuthError();
                }}
                onBlur={() => setEmailTouched(true)}
                placeholder="you@example.com"
                placeholderTextColor="#6B6B7A"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                textContentType="emailAddress"
                autoComplete="email"
                returnKeyType="next"
                editable={!loading}
                style={[
                  styles.input,
                  (emailHasError || authHasError) && styles.inputError,
                ]}
                onSubmitEditing={() => passwordRef.current?.focus()}
              />
              {emailHasError ? (
                <Text style={styles.helperError}>Enter a valid email address.</Text>
              ) : (
                <Text style={styles.helperText}>Use the email tied to your account.</Text>
              )}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>
              <View
                style={[
                  styles.passwordWrap,
                  (passwordHasError || authHasError) && styles.inputError,
                ]}
              >
                <TextInput
                  ref={passwordRef}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    clearAuthError();
                  }}
                  onBlur={() => setPasswordTouched(true)}
                  placeholder="At least 6 characters"
                  placeholderTextColor="#6B6B7A"
                  secureTextEntry={!showPassword}
                  editable={!loading}
                  style={styles.passwordInput}
                  textContentType="password"
                  autoComplete="password"
                  returnKeyType="go"
                  onSubmitEditing={onLogin}
                />

                <Pressable
                  onPress={() => setShowPassword((prev) => !prev)}
                  hitSlop={10}
                  disabled={loading}
                  style={styles.passwordToggle}
                >
                  <Text style={styles.passwordToggleText}>
                    {showPassword ? "Hide" : "Show"}
                  </Text>
                </Pressable>
              </View>

              {passwordHasError ? (
                <Text style={styles.helperError}>Password must be at least 6 characters.</Text>
              ) : (
                <Text style={styles.helperText}>Keep it secure and easy to remember.</Text>
              )}
            </View>

            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}

            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                (!canSubmit || loading) && styles.primaryButtonDisabled,
                pressed && canSubmit && !loading && styles.primaryButtonPressed,
              ]}
              disabled={!canSubmit || loading}
              onPress={onLogin}
            >
              {loading ? (
                <ActivityIndicator color="#F2F2F7" />
              ) : (
                <Text style={styles.primaryButtonText}>Continue</Text>
              )}
            </Pressable>

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Don&apos;t have an account?</Text>
              <Pressable
                onPress={() => router.push("/signup")}
                disabled={loading}
                hitSlop={8}
              >
                <Text style={[styles.linkText, loading && styles.linkDisabled]}>
                  Sign up
                </Text>
              </Pressable>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.backButton,
                pressed && !loading && styles.backButtonPressed,
                loading && styles.buttonDisabled,
              ]}
              onPress={() => router.back()}
              disabled={loading}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </Pressable>
          </View>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0B12",
    paddingHorizontal: 24,
    paddingTop: 40,
    justifyContent: "center",
  },
  glow: {
    position: "absolute",
    top: 110,
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
  header: {
    marginBottom: 22,
  },
  title: {
    color: "#F2F2F7",
    fontSize: 34,
    fontWeight: "800",
  },
  subtitle: {
    color: "#B8B8C7",
    fontSize: 15,
    marginTop: 8,
    lineHeight: 22,
  },
  formCard: {
    backgroundColor: "#11111A",
    borderWidth: 1,
    borderColor: "#232336",
    borderRadius: 24,
    padding: 20,
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
  passwordWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#141426",
    borderWidth: 1,
    borderColor: "#2A2A3C",
    borderRadius: 12,
    paddingLeft: 14,
    paddingRight: 12,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    color: "#F2F2F7",
    fontSize: 16,
  },
  passwordToggle: {
    marginLeft: 10,
    paddingVertical: 6,
  },
  passwordToggleText: {
    color: "#9A7BFF",
    fontSize: 13,
    fontWeight: "800",
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
    marginTop: -2,
    fontWeight: "600",
  },
  primaryButton: {
    marginTop: 8,
    backgroundColor: "#7C5CFF",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
  },
  primaryButtonPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
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
    justifyContent: "center",
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
  linkDisabled: {
    opacity: 0.6,
  },
  backButton: {
    marginTop: 4,
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