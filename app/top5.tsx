import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { supabase } from "../lib/supabase";

type Song = {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
};

type RowItem = { id: number };

export default function Top5Screen() {
  const params = useLocalSearchParams<{
    top5?: string;
  }>();

  const [top5, setTop5] = useState<(Song | null)[]>([
    null,
    null,
    null,
    null,
    null,
  ]);

  const rows: RowItem[] = useMemo(
    () => Array.from({ length: 5 }, (_, i) => ({ id: i })),
    []
  );

  useEffect(() => {
    if (params.top5) {
      try {
        const parsed = JSON.parse(params.top5) as (Song | null)[];
        if (Array.isArray(parsed) && parsed.length === 5) {
          setTop5(parsed);
        }
      } catch (error) {
        console.log("Failed to parse top5 params:", error);
      }
    }
  }, [params.top5]);

  const canContinue = top5.every((s) => s !== null);

  const onPickSong = (index: number) => {
    router.push({
      pathname: "/song-list",
      params: {
        slot: String(index),
        top5: JSON.stringify(top5),
      },
    });
  };

  const onClearSong = (index: number) => {
    setTop5((prev) => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
  };

  const saveTop5ToDatabase = async () => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        Alert.alert("Error", "No authenticated user found.");
        return;
      }

      const { error: deleteError } = await supabase
        .from("user_top5")
        .delete()
        .eq("user_id", user.id);

      if (deleteError) {
        Alert.alert("Error", deleteError.message);
        return;
      }

      for (let i = 0; i < top5.length; i++) {
        const song = top5[i];
        if (!song) continue;

        const { error: top5Error } = await supabase
          .from("user_top5")
          .upsert(
            {
              user_id: user.id,
              position: i + 1,
              song_id: song.id,
            },
            {
              onConflict: "user_id,position",
            }
          );

        if (top5Error) {
          Alert.alert("Top 5 save error", top5Error.message);
          return;
        }
      }

      Alert.alert("Success", "Your Top 5 was saved.");
      router.push("/");
    } catch (error) {
      console.log("Unexpected Top 5 save error:", error);
      Alert.alert("Error", "Something went wrong while saving your songs.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Your Top 5</Text>
        <Text style={styles.countText}>{top5.filter(Boolean).length}/5</Text>
      </View>

      <FlatList
        data={rows}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        style={{ flexGrow: 0 }}
        renderItem={({ item }) => {
          const index = item.id;
          const song = top5[index];

          return (
            <Pressable style={styles.row} onPress={() => onPickSong(index)}>
              <View style={styles.cover}>
                {song ? (
                  <Image source={{ uri: song.coverUrl }} style={styles.coverImg} />
                ) : (
                  <Text style={styles.plus}>+</Text>
                )}
              </View>

              {song ? (
                <View style={styles.textCol}>
                  <Text style={styles.songTitle} numberOfLines={1}>
                    {song.title}
                  </Text>
                  <Text style={styles.songArtist} numberOfLines={1}>
                    {song.artist}
                  </Text>
                </View>
              ) : (
                <View style={styles.centerTextContainer}>
                  <Text style={styles.centerText}>Choose a song</Text>
                </View>
              )}

              {song ? (
                <Pressable
                  onPress={() => onClearSong(index)}
                  hitSlop={10}
                  style={styles.rightIcon}
                >
                  <Text style={styles.rightIconText}>×</Text>
                </Pressable>
              ) : (
                <View style={styles.rightIcon}>
                  <Text style={styles.rightIconText}>›</Text>
                </View>
              )}
            </Pressable>
          );
        }}
      />

      <View style={styles.buttonBlock}>
        <Pressable
          disabled={!canContinue}
          onPress={saveTop5ToDatabase}
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
    paddingTop: 54,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  title: {
    color: "#F2F2F7",
    fontSize: 34,
    fontWeight: "800",
  },
  countText: {
    color: "#B8B8C7",
    fontSize: 14,
    fontWeight: "700",
  },
  listContent: {
    gap: 12,
    paddingBottom: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#141426",
    borderWidth: 1,
    borderColor: "#2A2A3C",
    borderRadius: 14,
    padding: 12,
  },
  cover: {
    width: 54,
    height: 54,
    borderRadius: 12,
    backgroundColor: "#1C1C34",
    borderWidth: 1,
    borderColor: "#2A2A3C",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  coverImg: {
    width: "100%",
    height: "100%",
  },
  plus: {
    fontSize: 28,
    color: "#6B6B7A",
  },
  textCol: {
    flex: 1,
    marginLeft: 12,
    gap: 2,
  },
  songTitle: {
    color: "#F2F2F7",
    fontSize: 16,
    fontWeight: "800",
  },
  songArtist: {
    color: "#B8B8C7",
    fontSize: 13,
    fontWeight: "600",
  },
  centerTextContainer: {
    flex: 1,
    justifyContent: "center",
    marginLeft: 12,
  },
  centerText: {
    color: "#B8B8C7",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "left",
  },
  rightIcon: {
    width: 34,
    height: 34,
    justifyContent: "center",
    alignItems: "center",
  },
  rightIconText: {
    color: "#9A7BFF",
    fontSize: 22,
    fontWeight: "800",
  },
  buttonBlock: {
    marginTop: 18,
    gap: 14,
  },
  primaryButton: {
    width: "100%",
    backgroundColor: "#7C5CFF",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
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