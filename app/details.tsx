import data from "@/data/data.json";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function DetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const product = data.find((p) => p.id === id);

  if (!product) {
    return (
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Product not exists</Text>
          <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // đảm bảo feedbacks luôn là mảng
  const feedbacks = product.feedbacks ?? [];

  // tính trung bình rating
  const averageRating = feedbacks.length
    ? feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length
    : 0;

  // nhóm feedback theo rating
  const ratingGroups: { rating: number; count: number }[] = [5, 4, 3, 2, 1].map((r) => ({
    rating: r,
    count: feedbacks.filter((f) => f.rating === r).length,
  }));

  return (
    <View style={styles.overlay}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          {/* Image */}
          <Image source={{ uri: product.image }} style={styles.image} />

          {/* Info */}
          <Text style={styles.title}>{product.artName}</Text>
          <Text style={styles.price}>
            {product.price.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </Text>
          {product.limitedTimeDeal > 0 && (
            <Text style={styles.deal}>-{Math.round(product.limitedTimeDeal * 100)}%</Text>
          )}
          <Text style={styles.description}>Description: {product.description}</Text>
          <Text style={styles.brand}>Brand: {product.brand}</Text>

          {/* Feedback Section */}
          <View style={styles.feedbackSection}>
            <Text style={styles.feedbackTitle}>Feedback</Text>
            <Text style={styles.average}>
              Average Rating: {averageRating.toFixed(1)} ⭐ ({feedbacks.length} reviews)
            </Text>

            {/* Rating groups */}
            <View style={styles.ratingGroupContainer}>
              {ratingGroups.map((g) => (
                <Text key={g.rating}>
                  {g.rating}⭐: {g.count}
                </Text>
              ))}
            </View>

            {/* Feedback list */}
            {feedbacks.map((f, index) => (
              <View key={index} style={styles.feedbackCard}>
                <Text style={styles.feedbackAuthor}>
                  {f.author} - {f.rating}⭐
                </Text>
                <Text style={styles.feedbackComment}>{f.comment}</Text>
                <Text style={styles.feedbackDate}>{f.date}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// ...styles giữ nguyên


const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  scrollContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  card: {
    width: "95%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 16,
    marginBottom: 16,
    resizeMode: "cover",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
    color: "#111",
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    color: "#e53935",
    marginBottom: 6,
  },
  deal: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2e7d32",
    backgroundColor: "#e8f5e9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    color: "#555",
    textAlign: "center",
    marginBottom: 10,
  },
  brand: {
    fontSize: 16,
    fontWeight: "500",
    color: "#777",
    textAlign: "center",
    marginBottom: 12,
    fontStyle: "italic",
  },
  closeBtn: {
    backgroundColor: "#ff4757",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginTop: 10,
  },
  closeText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  feedbackSection: {
    width: "100%",
    marginTop: 16,
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  average: {
    marginBottom: 8,
    fontWeight: "500",
  },
  ratingGroupContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  feedbackCard: {
    marginBottom: 8,
    padding: 8,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  feedbackAuthor: {
    fontWeight: "600",
  },
  feedbackComment: {
    fontSize: 14,
    color: "#555",
  },
  feedbackDate: {
    fontSize: 12,
    color: "#999",
  },
});
