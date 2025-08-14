import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import SearchBar from "@/components/SearchBar";
import CategoryList from "@/components/CategoryList";
import EventCard from "@/components/EventCard";

export default function HomeScreen() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch Events whenever category or search changes
  useEffect(() => {
    fetchEvents();
  }, [selectedCategory, searchQuery]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      // Example API URL (replace with your backend)
      let url = `https://your-api.com/events?category=${selectedCategory}`;
      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.appTitle}>EventApp</Text>
      <Text style={styles.subtitle}>Discover & Join Amazing Events</Text>

      {/* Search Bar */}
      <SearchBar onSearch={(text) => setSearchQuery(text)} />

      {/* Categories */}
      <CategoryList
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* All Events */}
      <Text style={styles.sectionTitle}>All Events</Text>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#6200ee"
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <EventCard event={item} />}
          ListEmptyComponent={
            <Text style={styles.noData}>No events found.</Text>
          }
          scrollEnabled={false} // So FlatList works well inside ScrollView
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
  },
  noData: {
    textAlign: "center",
    color: "#888",
    marginTop: 20,
  },
});
