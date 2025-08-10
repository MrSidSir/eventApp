import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  TextInput,
  StatusBar,
  Animated,
  RefreshControl,
} from "react-native";

// TypeScript interfaces for type safety
interface Location {
  id: string;
  name: string;
  count: number;
  emoji: string;
}

interface TrendingTopic {
  id: string;
  name: string;
  color: string;
  count: string;
}

interface Organizer {
  id: string;
  name: string;
  events: number;
  rating: number;
  image: string;
}

export default function ExploreScreen() {
  // State Management - All component state variables
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [events, setEvents] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  // Filter Configuration - Available filter options
  const filters: string[] = [
    "All",
    "Today",
    "This Week",
    "This Month",
    "Free",
    "Paid",
  ];

  // Location Data - Cities/regions with event counts
  const locations: Location[] = [
    { id: "1", name: "Delhi NCR", count: 25, emoji: "🏛️" },
    { id: "2", name: "Mumbai", count: 18, emoji: "🌊" },
    { id: "3", name: "Bangalore", count: 32, emoji: "🌿" },
    { id: "4", name: "Pune", count: 12, emoji: "🎓" },
    { id: "5", name: "Hyderabad", count: 15, emoji: "💎" },
    { id: "6", name: "Chennai", count: 10, emoji: "🏖️" },
  ];

  // Trending Topics Data - Popular event categories
  const trendingTopics: TrendingTopic[] = [
    { id: "1", name: "AI & ML", color: "#8B5CF6", count: "45 events" },
    { id: "2", name: "Startup", color: "#EC4899", count: "32 events" },
    { id: "3", name: "Music Festival", color: "#F59E0B", count: "28 events" },
    { id: "4", name: "Photography", color: "#10B981", count: "22 events" },
    { id: "5", name: "Food & Drink", color: "#EF4444", count: "38 events" },
    { id: "6", name: "Fitness", color: "#3B82F6", count: "19 events" },
  ];

  // Featured Organizers Data - Top event organizers
  const organizers: Organizer[] = [
    { id: "1", name: "TechEvents India", events: 24, rating: 4.8, image: "🏢" },
    { id: "2", name: "Music Masters", events: 18, rating: 4.9, image: "🎵" },
    { id: "3", name: "Startup Hub", events: 15, rating: 4.7, image: "🚀" },
    { id: "4", name: "Art Gallery", events: 12, rating: 4.6, image: "🎨" },
  ];

  // Component Lifecycle - Initialize data and animations
  useEffect(() => {
    loadExploreData();
    // Smooth fade-in animation on component mount
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  // Data Loading Function - Simulates API call for explore data
  const loadExploreData = async (): Promise<void> => {
    // Simulate network delay
    setTimeout(() => {
      // In real app, fetch data from API here
    }, 500);
  };

  // Pull-to-Refresh Handler
  const onRefresh = async (): Promise<void> => {
    setRefreshing(true);
    await loadExploreData();
    setRefreshing(false);
  };

  // Location Card Renderer - Displays city/location with event count
  const renderLocationCard = ({ item }: { item: Location }) => (
    <TouchableOpacity style={styles.locationCard} activeOpacity={0.7}>
      <Text style={styles.locationEmoji}>{item.emoji}</Text>
      <Text style={styles.locationName}>{item.name}</Text>
      <Text style={styles.locationCount}>{item.count} events</Text>
    </TouchableOpacity>
  );

  // Trending Topic Card Renderer - Shows popular event topics
  const renderTrendingTopic = ({ item }: { item: TrendingTopic }) => (
    <TouchableOpacity
      style={[styles.topicCard, { backgroundColor: item.color + "20" }]}
      activeOpacity={0.7}
    >
      <View style={[styles.topicIcon, { backgroundColor: item.color }]} />
      <View style={styles.topicContent}>
        <Text style={styles.topicName}>{item.name}</Text>
        <Text style={styles.topicCount}>{item.count}</Text>
      </View>
    </TouchableOpacity>
  );

  // Organizer Card Renderer - Featured event organizers list
  const renderOrganizerCard = ({ item }: { item: Organizer }) => (
    <TouchableOpacity style={styles.organizerCard} activeOpacity={0.7}>
      <Text style={styles.organizerImage}>{item.image}</Text>
      <View style={styles.organizerInfo}>
        <Text style={styles.organizerName}>{item.name}</Text>
        <Text style={styles.organizerStats}>
          {item.events} events • ⭐ {item.rating}
        </Text>
      </View>
      <TouchableOpacity style={styles.followButton}>
        <Text style={styles.followButtonText}>Follow</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  // Filter Chip Renderer - Quick filter buttons
  const renderFilterChip = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.filterChip,
        selectedFilter === item && styles.selectedFilterChip,
      ]}
      onPress={() => setSelectedFilter(item)}
    >
      <Text
        style={[
          styles.filterText,
          selectedFilter === item && styles.selectedFilterText,
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  // Main Component Render
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1F2937" />

      {/* Header Section with Search */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Explore Events</Text>
          <Text style={styles.headerSubtitle}>
            Find your next amazing experience
          </Text>

          {/* Enhanced Search Bar with Filter Button */}
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search events, organizers, topics..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterIcon}>⚙️</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Main Content with ScrollView and Pull-to-Refresh */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Quick Filters Section */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Quick Filters</Text>
          <FlatList
            data={filters}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderFilterChip}
            keyExtractor={(item: string) => item}
            style={styles.filtersList}
          />
        </Animated.View>

        {/* Browse by Location Section */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Browse by Location</Text>
          <FlatList
            data={locations}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderLocationCard}
            keyExtractor={(item: Location) => item.id}
            style={styles.locationsList}
          />
        </Animated.View>

        {/* Trending Topics Grid Section */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Trending Topics</Text>
          <View style={styles.topicsGrid}>
            {trendingTopics.map((topic: TrendingTopic, index: number) => (
              <TouchableOpacity
                key={topic.id}
                style={[
                  styles.topicCard,
                  { backgroundColor: topic.color + "20" },
                ]}
                activeOpacity={0.7}
              >
                <View
                  style={[styles.topicIcon, { backgroundColor: topic.color }]}
                />
                <View style={styles.topicContent}>
                  <Text style={styles.topicName}>{topic.name}</Text>
                  <Text style={styles.topicCount}>{topic.count}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Featured Organizers Section */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Organizers</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {organizers.map((organizer: Organizer) => (
            <TouchableOpacity
              key={organizer.id}
              style={styles.organizerCard}
              activeOpacity={0.7}
            >
              <Text style={styles.organizerImage}>{organizer.image}</Text>
              <View style={styles.organizerInfo}>
                <Text style={styles.organizerName}>{organizer.name}</Text>
                <Text style={styles.organizerStats}>
                  {organizer.events} events • ⭐ {organizer.rating}
                </Text>
              </View>
              <TouchableOpacity style={styles.followButton}>
                <Text style={styles.followButtonText}>Follow</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Quick Actions Grid Section */}
        <Animated.View
          style={[styles.section, { opacity: fadeAnim, marginBottom: 100 }]}
        >
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard}>
              <Text style={styles.actionIcon}>📅</Text>
              <Text style={styles.actionText}>Create Event</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Text style={styles.actionIcon}>🎫</Text>
              <Text style={styles.actionText}>My Tickets</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Text style={styles.actionIcon}>❤️</Text>
              <Text style={styles.actionText}>Saved Events</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Text style={styles.actionIcon}>🏆</Text>
              <Text style={styles.actionText}>Rewards</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Bottom Navigation Placeholder */}
      <View style={styles.bottomNav}>
        {/* Navigation items can be added here */}
      </View>
    </View>
  );
}

// StyleSheet - Organized by component sections for maintainability
const styles = StyleSheet.create({
  // Main Container Styles
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  // Header Section Styles
  header: {
    backgroundColor: "#1F2937",
    paddingTop: (StatusBar.currentHeight || 0) + 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  headerSubtitle: {
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
  filterButton: {
    padding: 5,
  },
  filterIcon: {
    fontSize: 16,
  },

  // Content Area Styles
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 15,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  seeAllText: {
    fontSize: 14,
    color: "#2563EB",
    fontWeight: "600",
  },

  // Filter Chips Styles
  filtersList: {
    marginBottom: 10,
  },
  filterChip: {
    backgroundColor: "#E5E7EB",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  selectedFilterChip: {
    backgroundColor: "#2563EB",
  },
  filterText: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "600",
  },
  selectedFilterText: {
    color: "#FFFFFF",
  },

  // Location Cards Styles
  locationsList: {
    marginBottom: 10,
  },
  locationCard: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 12,
    marginRight: 12,
    alignItems: "center",
    minWidth: 100,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  locationName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
    textAlign: "center",
  },
  locationCount: {
    fontSize: 12,
    color: "#6B7280",
  },

  // Trending Topics Grid Styles
  topicsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  topicCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    width: "48%",
  },
  topicIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  topicContent: {
    flex: 1,
  },
  topicName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  topicCount: {
    fontSize: 12,
    color: "#6B7280",
  },

  // Organizer Card Styles
  organizerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  organizerImage: {
    fontSize: 32,
    marginRight: 12,
  },
  organizerInfo: {
    flex: 1,
  },
  organizerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  organizerStats: {
    fontSize: 14,
    color: "#6B7280",
  },
  followButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  followButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },

  // Quick Actions Grid Styles
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    width: "48%",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },

  // Bottom Navigation Styles
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
});
