import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

type Song = {
  title: string;
  artist: string;
  coverUrl: string;
};

const MOCK_SONGS: Song[] = [
  {
    title: "GOOD CREDIT",
    artist: "Playboi Carti",
    coverUrl: "https://picsum.photos/seed/cinnamongirl/200",
  },
  {
    title: "Yesterday",
    artist: "The Beatles",
    coverUrl: "https://picsum.photos/seed/yesterday/200",
  },
  {
    title: "Distant Lover",
    artist: "Marvin Gaye",
    coverUrl: "https://picsum.photos/seed/river/200",
  },
  {
    title: "Moonlight on the River",
    artist: "Mac DeMarco",
    coverUrl: "https://picsum.photos/seed/animalcrossing/200",
  },
  {
    title: "Get You",
    artist: "Daniel Caesar, Kali Uchis",
    coverUrl: "https://picsum.photos/seed/saveroom/200",
  },
];

type RowItem = { id: number };

export default function Top5Screen() {
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

  const canContinue = top5.every((s) => s !== null);

  const onPickSong = (index: number) => {
    setTop5((prev) => {
      const next = [...prev];
      next[index] = MOCK_SONGS[index % MOCK_SONGS.length];
      return next;
    });
  };

  const onClearSong = (index: number) => {
    setTop5((prev) => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
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
        style={{ flexGrow: 0 }}   // prevents list from pushing buttons down
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
          onPress={() => router.push("/")}
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
  marginLeft: 12,   // aligns with real song text column
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