import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Image, Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";

export default function PhotosScreen() {
  const { width } = useWindowDimensions();

  // Match your screen padding (24) and spacing between tiles (12)
  const horizontalPadding = 24;
  const tileSpacing = 12;

  // Two tiles per row:
  // total usable width = screen width - left padding - right padding
  // minus spacing between the two tiles
  const tileSize = useMemo(() => {
    const usable = width - horizontalPadding * 2;
    return Math.floor((usable - tileSpacing) / 2);
  }, [width]);

  const [photos, setPhotos] = useState<(string | null)[]>([null, null, null, null]);

  const addMockPhoto = (index: number) => {
    const next = [...photos];
    // Random cat image each tap
    next[index] = "https://cataas.com/cat?width=400";
    setPhotos(next);
  };

  const canContinue = photos.some((p) => p !== null);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Add your photos</Text>

        <View style={styles.grid}>
          {photos.map((photo, index) => {
            const isRightColumn = index % 2 === 1;
            const isLastRow = index >= 2;

            return (
              <Pressable
                key={index}
                onPress={() => addMockPhoto(index)}
                style={[
                  styles.slot,
                  {
                    width: tileSize,
                    height: tileSize,
                    marginRight: isRightColumn ? 0 : tileSpacing,
                    marginBottom: isLastRow ? 0 : tileSpacing,
                  },
                ]}
              >
                {photo ? (
                  <Image source={{ uri: photo }} style={styles.image} resizeMode="cover" />
                ) : (
                  <Text style={styles.plus}>+</Text>
                )}
              </Pressable>
            );
          })}
        </View>

        <Pressable
          disabled={!canContinue}
          onPress={() => router.push("/top5")}
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
    alignItems: "center",
  },
  title: {
    color: "#F2F2F7",
    fontSize: 34,
    fontWeight: "800",
    marginBottom: 18,
    alignSelf: "flex-start",
  },
  grid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 18,
  },
  slot: {
    backgroundColor: "#141426",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2A2A3C",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  plus: {
    fontSize: 40,
    lineHeight: 40,
    color: "#6B6B7A",
    textAlign: "center",
    textAlignVertical: "center",
  },
  primaryButton: {
    width: "100%",
    backgroundColor: "#7C5CFF",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
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
    width: "100%",
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