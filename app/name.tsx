import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function NameScreen() {
  const [name, setName] = useState("");

  const canContinue = useMemo(() => name.trim().length >= 2, [name]);

  const onContinue = () => {
    router.push("/photos");
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>What is your name?</Text>

        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Name"
          placeholderTextColor="#6B6B7A"
          autoCapitalize="words"
          style={styles.input}
        />

        <Pressable
          disabled={!canContinue}
          onPress={onContinue}
          style={({ pressed }) => [
            styles.primaryButton,
            !canContinue && styles.primaryButtonDisabled,
            pressed && canContinue && styles.primaryButtonPressed,
          ]}
        >
          <Text style={styles.primaryButtonText}>Continue</Text>
        </Pressable>

        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0B12",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  content: {
    width: "100%",
    gap: 14,
  },
  title: {
    color: "#F2F2F7",
    fontSize: 34,
    fontWeight: "800",
    marginBottom: 6,
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
    backgroundColor: "#7C5CFF",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 6,
  },
  primaryButtonDisabled: {
    backgroundColor: "#2A2A3C",
  },
  primaryButtonPressed: {
    opacity: 0.9,
  },
  primaryButtonText: {
    color: "#F2F2F7",
    fontSize: 16,
    fontWeight: "800",
  },
  backButton: {
    borderWidth: 1,
    borderColor: "#2A2A3C",
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