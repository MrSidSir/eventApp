import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import SearchBar from "@/components/SearchBar";
import CategoryList from "@/components/CategoryList";
import EventCard from "@/components/EventCard";

export default function HomeScreen() {
  const navigation = useNavigation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchEvents();
  }, [selectedCategory, searchQuery]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      // Replace with your backend API
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

  const handleEventPress = (event) => {
    navigation.navigate("EventDetails", { event });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
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
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleEventPress(item)}>
                <EventCard event={item} />
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.noData}>No events found.</Text>
            }
            scrollEnabled={false}
          />
        )}
      </ScrollView>

      {/* Footer Navigation */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Ionicons name="home" size={24} color="#6200ee" />
          <Text style={styles.footerText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Ionicons name="person" size={24} color="#666" />
          <Text style={styles.footerText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Ionicons name="create" size={24} color="#666" />
          <Text style={styles.footerText}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
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
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
  },
  footerText: {
    fontSize: 12,
    textAlign: "center",
  },
});
