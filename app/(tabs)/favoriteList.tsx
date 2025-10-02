import {
  deleteAllFavorite,
  deleteFavorite,
  Favorite,
  fetchFavorite,
} from "@/api/favoritesAPI";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";

import {
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FavoriteList = () => {
  const [Favorites, setFavorites] = useState<Favorite[]>([]);
  const router = useRouter();
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const data = await fetchFavorite();
          setFavorites(data);
        } catch (error) {
          console.error(error);
        }
      };
      fetchData();
    }, [])
  );

  const removeFavorite = async (id: string) => {
    try {
      await deleteFavorite(id);
      setFavorites((previous) => previous.filter((fav) => fav.id !== id));
    } catch (error) {
      console.error(error);
    }
  };
  const removeAllFavorite = async () => {
    try {
      await deleteAllFavorite();
      setFavorites([]);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headContainer}>
        <Text style={styles.title}>Your Favorite</Text>
        <Pressable
          onPress={() =>
            Alert.alert("Remove all", "Are you sure to remove all favorites?", [
              { text: "No" },
              { text: "Yes", onPress: removeAllFavorite },
            ])
          }
        >
          <Text style={styles.removeText}>Remove All</Text>
        </Pressable>
      </View>

      {Favorites.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: 18, color: "#888" }}>Empty</Text>
        </View>
      ) : (
        <FlatList
          data={Favorites}
          keyExtractor={(item) => item.id.toString()}
          extraData={Favorites}
          renderItem={({ item }) => (
            <View style={styles.card} key={item.id}>
              <Pressable
                style={styles.moreBtn}
                onPress={() => router.push(`/details?id=${item.id}`)}
              >
                <MaterialCommunityIcons
                  name="dots-horizontal-circle-outline"
                  size={22}
                  color="#555"
                />
              </Pressable>

              <Image source={{ uri: item.image }} style={styles.cardImage} />

              <Text style={styles.cardTitle} numberOfLines={2}>
                {item.artName}
              </Text>

              <Text style={styles.cardPrice}>
                {(item.price ?? 0).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </Text>

              {item.limitedTimeDeal > 0 && (
                <Text style={styles.cardDeal}>
                  -{(item.limitedTimeDeal * 100).toFixed(0)}%
                </Text>
              )}
              <MaterialCommunityIcons
                name="archive-remove-outline"
                size={28}
                color="red"
                onPress={() => removeFavorite(item.id)}
              />
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default FavoriteList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  headContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    margin: 20,
  },
  removeText: {
    fontSize: 20,
    color: "red",
    fontWeight: "medium",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
  },
  brandContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    margin: 10,
  },
  brandButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 6,
  },
  list: {
    padding: 10,
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    margin: 8,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    position: "relative",
  },
  cardImage: {
    width: "50%",
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 12,
    resizeMode: "cover",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginBottom: 6,
  },
  cardPrice: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#e53935",
    marginBottom: 6,
  },
  cardDeal: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2e7d32",
    backgroundColor: "#e8f5e9",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: "hidden",
  },
  moreBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 10,
  },
});
