import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Spotifriends</Text>
      <Text style={styles.subtitle}>Spot a friend</Text>

      <View style={styles.buttonRow}>
        <Pressable style={styles.primaryButton} onPress={() => router.push("/login")}>
          <Text style={styles.primaryButtonText}>Log In</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={() => router.push("/signup")}>
          <Text style={styles.secondaryButtonText}>Sign Up</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0B12", // deep midnight
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  title: {
    color: "#7C5CFF", // violet brand color
    fontSize: 40,
    fontWeight: "800",
    letterSpacing: 0.6,
  },

  subtitle: {
    color: "#B8B8C7",
    marginTop: 10,
    fontSize: 16,
  },

  buttonRow: {
    width: "100%",
    marginTop: 32,
    gap: 14,
  },

  primaryButton: {
    backgroundColor: "#7C5CFF", // main violet
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  primaryButtonText: {
    color: "#F2F2F7",
    fontSize: 16,
    fontWeight: "700",
  },

  secondaryButton: {
    borderWidth: 1,
    borderColor: "#2A2A3C",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#141426", // soft surface
  },

  secondaryButtonText: {
    color: "#F2F2F7",
    fontSize: 16,
    fontWeight: "700",
  },
});