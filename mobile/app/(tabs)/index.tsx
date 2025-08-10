import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  TextInput,
  Image,
  StatusBar,
  Dimensions,
  Animated,
  RefreshControl,
} from "react-native";
// Removed LinearGradient import - using regular View instead

const { width, height } = Dimensions.get("window");

export default function HomeScreen() {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [refreshing, setRefreshing] = useState(false);

  // Categories for filtering
  const categories = ["All", "Tech", "Music", "Business", "Sports", "Arts"];

  // Enhanced events data with more properties
  const initialEvents = [
    {
      id: "1",
      title: "AI & Machine Learning Summit",
      date: "Aug 20, 2025",
      time: "10:00 AM",
      location: "Tech Hub, Gurgaon",
      category: "Tech",
      price: "₹2,500",
      attendees: 150,
      image: "https://via.placeholder.com/300x150/4F46E5/FFFFFF?text=AI+Summit",
      isPopular: true,
      isFree: false,
    },
    {
      id: "2",
      title: "Summer Music Festival",
      date: "Sep 5, 2025",
      time: "6:00 PM",
      location: "Central Park, Delhi",
      category: "Music",
      price: "Free",
      attendees: 500,
      image:
        "https://via.placeholder.com/300x150/EC4899/FFFFFF?text=Music+Fest",
      isPopular: true,
      isFree: true,
    },
    {
      id: "3",
      title: "Startup Pitch Competition",
      date: "Oct 12, 2025",
      time: "2:00 PM",
      location: "Business Center, Noida",
      category: "Business",
      price: "₹1,000",
      attendees: 200,
      image:
        "https://via.placeholder.com/300x150/10B981/FFFFFF?text=Startup+Pitch",
      isPopular: false,
      isFree: false,
    },
    {
      id: "4",
      title: "Digital Art Workshop",
      date: "Nov 8, 2025",
      time: "11:00 AM",
      location: "Creative Studio, Mumbai",
      category: "Arts",
      price: "₹800",
      attendees: 80,
      image:
        "https://via.placeholder.com/300x150/F59E0B/FFFFFF?text=Art+Workshop",
      isPopular: false,
      isFree: false,
    },
  ];

  useEffect(() => {
    loadEvents();
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const loadEvents = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setEvents(initialEvents);
      setIsLoading(false);
    }, 1000);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEvents();
    setRefreshing(false);
  };

  // Filter events based on search and category
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderEventCard = ({ item, index }) => (
    <Animated.View
      style={[
        styles.eventCard,
        {
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
          opacity: fadeAnim,
        },
      ]}
    >
      <TouchableOpacity
        style={styles.cardContent}
        activeOpacity={0.8}
        onPress={() => handleEventPress(item)}
      >
        {/* Event Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.image }} style={styles.eventImage} />
          {item.isPopular && (
            <View style={styles.popularBadge}>
              <Text style={styles.popularText}>🔥 Popular</Text>
            </View>
          )}
          {item.isFree && (
            <View style={styles.freeBadge}>
              <Text style={styles.freeText}>FREE</Text>
            </View>
          )}
        </View>

        {/* Event Details */}
        <View style={styles.eventDetails}>
          <Text style={styles.eventTitle} numberOfLines={2}>
            {item.title}
          </Text>

          <View style={styles.eventMeta}>
            <View style={styles.metaRow}>
              <Text style={styles.metaIcon}>📅</Text>
              <Text style={styles.metaText}>
                {item.date} • {item.time}
              </Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaIcon}>📍</Text>
              <Text style={styles.metaText} numberOfLines={1}>
                {item.location}
              </Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaIcon}>👥</Text>
              <Text style={styles.metaText}>{item.attendees} attending</Text>
            </View>
          </View>

          <View style={styles.eventFooter}>
            <Text style={[styles.eventPrice, item.isFree && styles.freePrice]}>
              {item.price}
            </Text>
            <TouchableOpacity style={styles.bookButton}>
              <Text style={styles.bookButtonText}>Book Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderCategoryChip = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryChip,
        selectedCategory === item && styles.selectedCategoryChip,
      ]}
      onPress={() => setSelectedCategory(item)}
    >
      <Text
        style={[
          styles.categoryText,
          selectedCategory === item && styles.selectedCategoryText,
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  const handleEventPress = (event) => {
    // Navigate to event details screen
    console.log("Event pressed:", event.title);
  };

  const handleLogin = () => {
    console.log("Login pressed");
  };

  const handleExplore = () => {
    console.log("Explore pressed");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1F2937" />

      {/* Header with Background */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.appTitle}>EventApp</Text>
          <Text style={styles.tagline}>Discover & Join Amazing Events</Text>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search events..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Categories */}
        <Text style={styles.sectionTitle}>Categories</Text>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={renderCategoryChip}
          keyExtractor={(item) => item}
          style={styles.categoriesList}
        />

        {/* Events Section */}
        <View style={styles.eventsSection}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === "All"
              ? "All Events"
              : `${selectedCategory} Events`}
            {filteredEvents.length > 0 && (
              <Text style={styles.eventCount}> ({filteredEvents.length})</Text>
            )}
          </Text>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading events...</Text>
            </View>
          ) : filteredEvents.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No events found</Text>
              <Text style={styles.emptySubtext}>
                Try adjusting your search or category
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredEvents}
              renderItem={renderEventCard}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
          )}
        </View>
      </ScrollView>

      {/* Floating Action Buttons */}
      <View style={styles.fabContainer}>
     
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    paddingTop: StatusBar.currentHeight + 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: "#1F2937",
  },
  headerContent: {
    alignItems: "center",
  },
  appTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  tagline: {
    fontSize: 16,
    color: "#D1D5DB",
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    width: "100%",
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginTop: 20,
    marginBottom: 15,
  },
  eventCount: {
    fontSize: 18,
    fontWeight: "400",
    color: "#6B7280",
  },
  categoriesList: {
    marginBottom: 10,
  },
  categoryChip: {
    backgroundColor: "#E5E7EB",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedCategoryChip: {
    backgroundColor: "#2563EB",
  },
  categoryText: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "600",
  },
  selectedCategoryText: {
    color: "#FFFFFF",
  },
  eventsSection: {
    marginBottom: 100, // Space for FAB
  },
  eventCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardContent: {
    overflow: "hidden",
    borderRadius: 16,
  },
  imageContainer: {
    position: "relative",
  },
  eventImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  popularBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#EF4444",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  freeBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#10B981",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  freeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  eventDetails: {
    padding: 16,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
    lineHeight: 24,
  },
  eventMeta: {
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  metaIcon: {
    fontSize: 14,
    marginRight: 8,
    width: 20,
  },
  metaText: {
    fontSize: 14,
    color: "#6B7280",
    flex: 1,
  },
  eventFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eventPrice: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2563EB",
  },
  freePrice: {
    color: "#10B981",
  },
  bookButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  bookButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#6B7280",
  },
  fabContainer: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  fab: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    flex: 0.48,
    alignItems: "center",
  },
  primaryFab: {
    backgroundColor: "#2563EB",
  },
  secondaryFab: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#2563EB",
  },
  fabText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  fabTextSecondary: {
    color: "#2563EB",
    fontSize: 16,
    fontWeight: "600",
  },
});
