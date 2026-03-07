import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { supabase } from "../lib/supabase";

export default function PhotosScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const { width } = useWindowDimensions();

  const horizontalPadding = 24;
  const tileSpacing = 12;

  const tileSize = useMemo(() => {
    const usable = width - horizontalPadding * 2;
    return Math.floor((usable - tileSpacing) / 2);
  }, [width]);

  const [photos, setPhotos] = useState<(string | null)[]>([null, null, null, null]);

  const openGalleryForSlot = async (index: number) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission needed",
        "Please allow access to your photo library to choose images."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const selectedUri = result.assets[0].uri;

      setPhotos((prev) => {
        const next = [...prev];
        next[index] = selectedUri;
        return next;
      });
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
  };

  const handleSlotPress = (index: number) => {
    if (!photos[index]) {
      openGalleryForSlot(index);
      return;
    }

    Alert.alert("Photo options", "What would you like to do?", [
      {
        text: "Replace photo",
        onPress: () => openGalleryForSlot(index),
      },
      {
        text: "Remove photo",
        style: "destructive",
        onPress: () => removePhoto(index),
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  const canContinue = photos.some((p) => p !== null);

  const uploadPhotosAndContinue = async () => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.log("No authenticated user found");
        return;
      }

      const { error: deleteDbError } = await supabase
        .from("profile_photos")
        .delete()
        .eq("user_id", user.id);

      if (deleteDbError) {
        console.log("Error clearing old photo rows:", deleteDbError.message);
        return;
      }

      for (let i = 0; i < photos.length; i++) {
        const photoUri = photos[i];
        if (!photoUri) continue;

        const base64 = await FileSystem.readAsStringAsync(photoUri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const arrayBuffer = decode(base64);
        const filePath = `${user.id}/photo-${i + 1}.jpg`;

        const { error: uploadError } = await supabase.storage
          .from("profile-photos")
          .upload(filePath, arrayBuffer, {
            contentType: "image/jpeg",
            upsert: true,
          });

        if (uploadError) {
          console.log("Upload error:", uploadError.message);
          return;
        }

        const { error: insertError } = await supabase
          .from("profile_photos")
         .upsert(
          {
           user_id: user.id,
          position: i + 1,
          storage_path: filePath,
          },
          {
            onConflict: "user_id,position",
          }
        );

        if (insertError) {
          console.log("Database insert error:", insertError.message);
          return;
        }
      }

      router.push("/top5");
    } catch (error) {
      console.log("Unexpected photo upload error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.welcomeTitle}>Welcome {name}</Text>
        <Text style={styles.title}>Add your photos</Text>

        <View style={styles.grid}>
          {photos.map((photo, index) => {
            const isRightColumn = index % 2 === 1;
            const isLastRow = index >= 2;

            return (
              <Pressable
                key={index}
                onPress={() => handleSlotPress(index)}
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
          onPress={uploadPhotosAndContinue}
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
    paddingHorizontal: 24,
    paddingTop: 80,
  },

  content: {
    width: "100%",
  },

  welcomeTitle: {
    fontSize: 48,
    fontWeight: "800",
    color: "#8B5CF6",
    marginBottom: 6,
  },

  title: {
    color: "#F2F2F7",
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 30,
  },

  grid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 30,
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
    color: "#6B6B7A",
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