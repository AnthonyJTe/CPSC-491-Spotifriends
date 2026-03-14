import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function ProfileSetupScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.glow} />

      <View style={styles.card}>
        <Text style={styles.stepText}>Next step</Text>

        <Text style={styles.title}>Profile setup</Text>

        <Text style={styles.subtitle}>
          You're almost ready! In the next step you'll finish building your
          profile so other users can discover you through music.
        </Text>

        <View style={styles.list}>
          <Text style={styles.listItem}>• Add your top songs</Text>
          <Text style={styles.listItem}>• Complete your profile</Text>
          <Text style={styles.listItem}>• Start spotting friends</Text>
        </View>

        <Pressable
          onPress={() => router.push("/top5")}
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.primaryButtonPressed,
          ]}
        >
          <Text style={styles.primaryButtonText}>Continue</Text>
        </Pressable>

        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backButtonPressed,
          ]}
        >
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

  glow: {
    position: "absolute",
    top: 120,
    alignSelf: "center",
    width: 240,
    height: 240,
    borderRadius: 999,
    backgroundColor: "#7C5CFF",
    opacity: 0.08,
  },

  card: {
    backgroundColor: "#11111A",
    borderWidth: 1,
    borderColor: "#232336",
    borderRadius: 24,
    padding: 22,
    gap: 14,
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
    fontSize: 32,
    fontWeight: "800",
  },

  subtitle: {
    color: "#B8B8C7",
    fontSize: 15,
    lineHeight: 22,
  },

  list: {
    marginTop: 6,
    marginBottom: 10,
    gap: 4,
  },

  listItem: {
    color: "#B8B8C7",
    fontSize: 14,
    fontWeight: "600",
  },

  primaryButton: {
    backgroundColor: "#7C5CFF",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 6,
  },

  primaryButtonPressed: {
    opacity: 0.9,
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
});