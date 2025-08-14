import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";

const categories = ["All", "Tech", "Music", "Business", "Sports", "Art"];

export default function CategoryList({
  selectedCategory,
  onCategoryChange,
}: {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ marginBottom: 15 }}
    >
      {categories.map((cat) => (
        <TouchableOpacity
          key={cat}
          style={[
            styles.category,
            selectedCategory === cat && styles.activeCategory,
          ]}
          onPress={() => onCategoryChange(cat)}
        >
          <Text
            style={[
              styles.categoryText,
              selectedCategory === cat && styles.activeCategoryText,
            ]}
          >
            {cat}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  category: {
    backgroundColor: "#eee",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  activeCategory: {
    backgroundColor: "#6200ee",
  },
  categoryText: {
    color: "#333",
    fontSize: 14,
  },
  activeCategoryText: {
    color: "#fff",
  },
});
