import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { supabase } from "../lib/supabase";

type SongRow = {
  id: string;
  title: string;
  artist: string;
  cover_url: string | null;
};

type SelectedSong = {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
};

export default function SongListScreen() {
  const { slot, top5 } = useLocalSearchParams<{ slot: string; top5?: string }>();
  const [songs, setSongs] = useState<SongRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSongs = async () => {
      const { data, error } = await supabase
        .from("songs")
        .select("id, title, artist, cover_url")
        .order("title", { ascending: true });

      if (error) {
        console.log("Song fetch error:", error.message);
      } else {
        setSongs(data ?? []);
      }

      setLoading(false);
    };

    fetchSongs();
  }, []);

  const handleSelectSong = (song: SongRow) => {
    try {
      const parsedTop5: (SelectedSong | null)[] = top5 ? JSON.parse(top5) : [null, null, null, null, null];
      const slotIndex = Number(slot);

      if (!Number.isNaN(slotIndex) && slotIndex >= 0 && slotIndex < 5) {
        parsedTop5[slotIndex] = {
          id: song.id,
          title: song.title,
          artist: song.artist,
          coverUrl: song.cover_url ?? "",
        };
      }

      router.replace({
        pathname: "/top5",
        params: {
          top5: JSON.stringify(parsedTop5),
        },
      });
    } catch (error) {
      console.log("Song selection error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose a song</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#8B5CF6" style={styles.loader} />
      ) : (
        <FlatList
          data={songs}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Pressable style={styles.row} onPress={() => handleSelectSong(item)}>
              <View style={styles.cover}>
                {item.cover_url ? (
                  <Image source={{ uri: item.cover_url }} style={styles.coverImg} />
                ) : (
                  <Text style={styles.plus}>♪</Text>
                )}
              </View>

              <View style={styles.textCol}>
                <Text style={styles.songTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.songArtist} numberOfLines={1}>
                  {item.artist}
                </Text>
              </View>
            </Pressable>
          )}
        />
      )}

      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backButtonText}>Back</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0B12",
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  title: {
    color: "#F2F2F7",
    fontSize: 34,
    fontWeight: "800",
    marginBottom: 20,
  },
  loader: {
    marginTop: 40,
  },
  listContent: {
    gap: 12,
    paddingBottom: 20,
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
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  coverImg: {
    width: "100%",
    height: "100%",
  },
  plus: {
    color: "#6B6B7A",
    fontSize: 24,
  },
  textCol: {
    flex: 1,
    marginLeft: 12,
  },
  songTitle: {
    color: "#F2F2F7",
    fontSize: 16,
    fontWeight: "800",
  },
  songArtist: {
    color: "#B8B8C7",
    fontSize: 13,
    marginTop: 2,
  },
  backButton: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#2A2A3C",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
    marginBottom: 20,
  },
  backButtonText: {
    color: "#F2F2F7",
    fontSize: 15,
    fontWeight: "700",
  },
});