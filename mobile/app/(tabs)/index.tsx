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

// Get device dimensions for responsive design
const { width, height } = Dimensions.get("window");

// Define TypeScript interfaces for better type safety
interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  price: string;
  attendees: number;
  image: string;
  isPopular: boolean;
  isFree: boolean;
}

export default function HomeScreen() {
  // State Management - All app data and UI states
  const [events, setEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Categories for filtering events
  const categories: string[] = ["All", "Tech", "Music", "Business", "Sports", "Arts"];

  // Static events data - In real app, this would come from API
  const initialEvents: Event[] = [
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
      image: "https://via.placeholder.com/300x150/EC4899/FFFFFF?text=Music+Fest",
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
      image: "https://via.placeholder.com/300x150/10B981/FFFFFF?text=Startup+Pitch",
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
      image: "https://via.placeholder.com/300x150/F59E0B/FFFFFF?text=Art+Workshop",
      isPopular: false,
      isFree: false,
    },
  ];

  // Component Lifecycle - Initialize data and animations on mount
  useEffect(() => {
    loadEvents();
    // Fade in animation for smooth UI entrance
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  // Data Loading Function - Simulates API call with loading state
  const loadEvents = async (): Promise<void> => {
    setIsLoading(true);
    // Simulate network delay
    setTimeout(() => {
      setEvents(initialEvents);
      setIsLoading(false);
    }, 1000);
  };

  // Pull-to-refresh handler
  const onRefresh = async (): Promise<void> => {
    setRefreshing(true);
    await loadEvents();
    setRefreshing(false);
  };

  // Data Filtering Logic - Filter events based on search query and category
  const filteredEvents = events.filter((event: Event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Event Card Renderer - Renders individual event item with animations
  const renderEventCard = ({ item, index }: { item: Event; index: number }) => (
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
        {/* Event Image Container with badges */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.image }} style={styles.eventImage} />
          {/* Popular badge overlay */}
          {item.isPopular && (
            <View style={styles.popularBadge}>
              <Text style={styles.popularText}>🔥 Popular</Text>
            </View>
          )}
          {/* Free event badge overlay */}
          {item.isFree && (
            <View style={styles.freeBadge}>
              <Text style={styles.freeText}>FREE</Text>
            </View>
          )}
        </View>

        {/* Event Information Section */}
        <View style={styles.eventDetails}>
          <Text style={styles.eventTitle} numberOfLines={2}>
            {item.title}
          </Text>

          {/* Event metadata with icons */}
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

          {/* Event footer with price and book button */}
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

  // Category Filter Chip Renderer
  const renderCategoryChip = ({ item }: { item: string }) => (
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

  // Event Press Handler - Navigate to event details
  const handleEventPress = (event: Event): void => {
    console.log("Event pressed:", event.title);
    // TODO: Navigate to event details screen
  };

  // Authentication Handlers
  const handleLogin = (): void => {
    console.log("Login pressed");
    // TODO: Navigate to login screen
  };

  const handleExplore = (): void => {
    console.log("Explore pressed");
    // TODO: Navigate to explore screen
  };

  // Main Component Render
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1F2937" />

      {/* Header Section with Search */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.appTitle}>EventApp</Text>
          <Text style={styles.tagline}>Discover & Join Amazing Events</Text>

          {/* Search Input Bar */}
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

      {/* Main Content Area with Pull-to-Refresh */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Categories Filter Section */}
        <Text style={styles.sectionTitle}>Categories</Text>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={renderCategoryChip}
          keyExtractor={(item: string) => item}
          style={styles.categoriesList}
        />

        {/* Events Listing Section */}
        <View style={styles.eventsSection}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === "All"
              ? "All Events"
              : `${selectedCategory} Events`}
            {filteredEvents.length > 0 && (
              <Text style={styles.eventCount}> ({filteredEvents.length})</Text>
            )}
          </Text>

          {/* Conditional Rendering: Loading, Empty, or Events List */}
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
              keyExtractor={(item: Event) => item.id}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
          )}
        </View>
      </ScrollView>

      {/* Floating Action Buttons Container */}
      <View style={styles.fabContainer}>
        {/* FAB buttons can be added here in future */}
      </View>
    </View>
  );
}

// StyleSheet - All component styles organized by section
const styles = StyleSheet.create({
  // Main Container Styles
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  
  // Header Section Styles
  header: {
    paddingTop: (StatusBar.currentHeight || 0) + 20,
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
  
  // Search Bar Styles
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
  
  // Content Area Styles
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
  
  // Category Filter Styles
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
  
  // Events Section Styles
  eventsSection: {
    marginBottom: 100, // Space for potential FAB
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
  
  // Event Image Styles
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
  
  // Event Details Styles
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
  
  // Event Footer Styles
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
  
  // Loading and Empty State Styles
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
  
  // Floating Action Button Styles
  fabContainer: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});