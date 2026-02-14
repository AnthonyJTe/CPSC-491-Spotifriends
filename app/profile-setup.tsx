import { StyleSheet, Text, View } from "react-native";

export default function ProfileSetupScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Profile setup coming next.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B0B12", justifyContent: "center", alignItems: "center" },
  text: { color: "#F2F2F7", fontSize: 18, fontWeight: "700" },
});