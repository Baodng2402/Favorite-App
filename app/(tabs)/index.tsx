import { addFavorite, Favorite, fetchFavorite } from "@/api/favoritesAPI";
import { fetchProducts, Product } from "@/api/productsAPI";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HomePage = () => {
  const router = useRouter();
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [favoritesFromServer, setFavoritesFromServer] = useState<Favorite[]>(
    []
  );

  const brands = Array.from(new Set(products.map((p) => p.brand)));

  // Fetch products và favorites khi tab focus
  useFocusEffect(
    useCallback(() => {
      const fetchAll = async () => {
        try {
          const productsData = await fetchProducts();
          setProducts(productsData.filter((p) => p.price > 0));

          const favs = await fetchFavorite();
          setFavoritesFromServer(favs);
        } catch (error) {
          console.error(error);
        }
      };
      fetchAll();
    }, [])
  );

  const chooseFavorite = async (favorite: {
    id: string;
    artName: string;
    price: number;
    description: string;
    image: string;
    brand: string;
    limitedTimeDeal: number;
  }) => {
    try {
      await addFavorite(favorite);
      // Cập nhật state từ server luôn
      setFavoritesFromServer((prev) => [...prev, { ...favorite }]);
    } catch (error) {
      console.error(error);
    }
  };

  // Lọc sản phẩm theo brand
  const filteredProducts = selectedBrand
    ? products.filter((p) => p.brand === selectedBrand)
    : products;

  return (
    <SafeAreaView style={styles.container}>
      {/* Filter Brand */}
      <View style={styles.brandContainer}>
        {brands.map((brand) => (
          <Pressable
            key={brand}
            onPress={() =>
              setSelectedBrand(brand === selectedBrand ? null : brand)
            }
            style={[
              styles.brandButton,
              { backgroundColor: selectedBrand === brand ? "#e53935" : "#eee" },
            ]}
          >
            <Text
              style={{
                color: selectedBrand === brand ? "#fff" : "#333",
                fontWeight: selectedBrand === brand ? "600" : "500",
              }}
            >
              {brand}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Product List */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
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
            <Pressable
              style={styles.loveBtn}
              onPress={() => {
                if (favoritesFromServer.some((fav) => fav.id === item.id)) {
                  alert("Exists in favorite list");
                } else {
                  chooseFavorite({
                    id: item.id,
                    artName: item.artName,
                    price: item.price,
                    description: item.description,
                    image: item.image,
                    brand: item.brand,
                    limitedTimeDeal: item.limitedTimeDeal,
                  });
                }
              }}
            >
              <MaterialCommunityIcons
                name="cards-heart-outline"
                size={24}
                color={
                  favoritesFromServer.some((fav) => fav.id === item.id)
                    ? "red"
                    : "black"
                }
              />
            </Pressable>
            <Image source={{ uri: item.image }} style={styles.cardImage} />

            <Text style={styles.cardTitle} numberOfLines={2}>
              {item.artName}
            </Text>

            <Text style={styles.cardPrice}>
              {item.price.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </Text>

            {item.limitedTimeDeal > 0 && (
              <Text style={styles.cardDeal}>
                -{(item.limitedTimeDeal * 100).toFixed(0)}%
              </Text>
            )}
          </View>
        )}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
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
    width: "100%",
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
  loveBtn: {
    position: "absolute",
    left: 8,
    top: 8,
    zIndex: 10,
  },
});
