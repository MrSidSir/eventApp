import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  Alert,
  Image,
  Modal,
} from "react-native";

// Enhanced TypeScript interfaces for better type safety
interface Location {
  id: string;
  name: string;
  count: number;
  imageUrl?: string;
  emoji: string;
  coordinates?: { lat: number; lng: number };
  isActive?: boolean;
}

interface TrendingTopic {
  id: string;
  name: string;
  color: string;
  count: string;
  category?: string;
  trending?: boolean;
  growth?: number;
}

interface Organizer {
  id: string;
  name: string;
  events: number;
  rating: number;
  image: string;
  verified?: boolean;
  followers?: number;
  isFollowing?: boolean;
  description?: string;
}

interface Event {
  id: string;
  title: string;
  organizerId: string;
  organizerName?: string;    // easier display
  locationId: string;
  locationName?: string;     // easier filtering/display
  date: Date;
  category: string;
  price: number;
  isFree: boolean;
  isLive?: boolean;
  attendees?: number;
  imageUrl?: string;         // <-- added (image for event)
  availableTickets?: number; // <-- added
  isBooked?: boolean;        // <-- added flag
}

interface FilterOptions {
  dateRange: "All" | "Today" | "This Week" | "This Month";
  priceType: "All" | "Free" | "Paid";
  location: string;
  category: string;
  sortBy: "date" | "popularity" | "price" | "rating";
}

interface QuickAction {
  id: string;
  title: string;
  icon: string;
  route?: string;
  onPress?: () => void;
  badge?: number;
  isEnabled?: boolean;
}

export default function ExploreScreen() {
  // Enhanced State Management
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [showAdvancedFilters, setShowAdvancedFilters] =
    useState<boolean>(false);

  // Advanced filter state
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    dateRange: "All",
    priceType: "All",
    location: "All",
    category: "All",
    sortBy: "date",
  });

  // Dynamic data state
  const [locations, setLocations] = useState<Location[]>([]);
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
  const [organizers, setOrganizers] = useState<Organizer[]>([]);
  const [quickActions, setQuickActions] = useState<QuickAction[]>([]);

  // User preferences and analytics
  const [userPreferences, setUserPreferences] = useState({
    favoriteCategories: [] as string[],
    preferredLocations: [] as string[],
    followedOrganizers: [] as string[],
  });

  // Dynamic filter configuration
  const filters: string[] = useMemo(
    () => [
      "All",
      "Today",
      "This Week",
      "This Month",
      "Free",
      "Paid",
      ...userPreferences.favoriteCategories.slice(0, 3),
    ],
    [userPreferences.favoriteCategories]
  );

  // Initialize data
  useEffect(() => {
    initializeScreen();
  }, []);

  // Search and filter effects
  useEffect(() => {
    handleSearch();
  }, [searchQuery, selectedFilter, filterOptions, events]);

  const initializeScreen = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadLocations(),
        loadTrendingTopics(),
        loadOrganizers(),
        loadEvents(),
        loadQuickActions(),
        loadUserPreferences(),
      ]);

      // Animate screen entrance
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.error("Error initializing screen:", error);
      Alert.alert("Error", "Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Dynamic data loading functions
  const loadLocations = async (): Promise<void> => {
    // In real app, fetch from API
    const mockLocations: Location[] = [
      { id: "1", name: "Delhi NCR", count: 25, emoji: "🏛️", isActive: true },
      { id: "2", name: "Mumbai", count: 18, emoji: "🌊", isActive: true },
      { id: "3", name: "Bangalore", count: 32, emoji: "🌿", isActive: true },
      { id: "4", name: "Pune", count: 12, emoji: "🎓", isActive: true },
      { id: "5", name: "Hyderabad", count: 15, emoji: "💎", isActive: true },
      { id: "6", name: "Chennai", count: 10, emoji: "🏖️", isActive: true },
    ];
    setLocations(mockLocations);
  };

  const loadTrendingTopics = async (): Promise<void> => {
    const mockTopics: TrendingTopic[] = [
      {
        id: "1",
        name: "AI & ML",
        color: "#8B5CF6",
        count: "45 events",
        trending: true,
        growth: 25,
        imageUrl: "https://in.images.search.yahoo.com/images/view;_ylt=Awrx.xqyHJpoFZUCtSW9HAx.;_ylu=c2VjA3NyBHNsawNpbWcEb2lkAzg3MjY0ODMyZWQzNTcxYjM4N2M4OTUyODNiOGI3NTIxBGdwb3MDNDIEaXQDYmluZw--?back=https%3A%2F%2Fin.images.search.yahoo.com%2Fsearch%2Fimages%3Fp%3DAI%2Band%2Bmachine%2Blearing%2Bsummit%2Bimage%2Bpng%2Bdownload%26type%3DE210IN885G0%26fr%3Dmcafee%26fr2%3Dpiv-web%26tab%3Dorganic%26ri%3D42&w=2560&h=1440&imgurl=www.chatgptbotsai.com%2Fwp-content%2Fuploads%2F2023%2F05%2F16268343_rm373batch5-blogbanner-02-scaled.jpg&rurl=https%3A%2F%2Fwww.chatgptbotsai.com%2Funderstanding-the-basics-of-machine-learning%2F&size=424KB&p=AI+and+machine+learing+summit+image+png+download&oid=87264832ed3571b387c895283b8b7521&fr2=piv-web&fr=mcafee&tt=Understanding+the+Basics+of+Machine+Learning+Online+Course&b=0&ni=21&no=42&ts=&tab=organic&sigr=ZmJt6Th1K0zO&sigb=EAe3cEmGyzOQ&sigi=M7GbXiGgSqF6&sigt=s7VpI1M8Mm65&.crumb=ME6bWAqypfL&fr=mcafee&fr2=piv-web&type=E210IN885G0",
      },
      {
        id: "2",
        name: "Startup",
        color: "#EC4899",
        count: "32 events",
        trending: true,
        growth: 15,
        imageUrl: "https://www.vhv.rs/dpng/d/520-5208809_startup-icon-hd-png-download.png"
      },
      {
        id: "3",
        name: "Music Festival",
        color: "#F59E0B",
        count: "28 events",
        growth: 10,
        ImageUrl: "https://www.rocksins.com/wp-content/uploads/2022/11/2022_DownloadFestival_DavidDillon_0287HEADER.jpg"
      },
      {
        id: "4",
        name: "Photography",
        color: "#10B981",
        count: "22 events",
        growth: 8,
        ImageUrl: "https://www.rocksins.com/wp-content/uploads/2022/11/2022_DownloadFestival_DavidDillon_0287HEADER.jpg"
      },
      {
        id: "5",
        name: "Food & Drink",
        color: "#EF4444",
        count: "38 events",
        growth: 20,
        ImageUrl: "https://www.rocksins.com/wp-content/uploads/2022/11/2022_DownloadFestival_DavidDillon_0287HEADER.jpg"
      },
      {
        id: "6",
        name: "Fitness",
        color: "#3B82F6",
        count: "19 events",
        growth: 5,
        ImageUrl: "https://www.rocksins.com/wp-content/uploads/2022/11/2022_DownloadFestival_DavidDillon_0287HEADER.jpg"
      },
    ];
    setTrendingTopics(mockTopics);
  };

  const loadOrganizers = async (): Promise<void> => {
    const mockOrganizers: Organizer[] = [
      {
        id: "1",
        name: "TechEvents India",
        events: 24,
        rating: 4.8,
        image: "🏢",
        verified: true,
        followers: 1200,
      },
      {
        id: "2",
        name: "Music Masters",
        events: 18,
        rating: 4.9,
        image: "🎵",
        verified: true,
        followers: 850,
      },
      {
        id: "3",
        name: "Startup Hub",
        events: 15,
        rating: 4.7,
        image: "🚀",
        verified: false,
        followers: 650,
      },
      {
        id: "4",
        name: "Art Gallery",
        events: 12,
        rating: 4.6,
        image: "🎨",
        verified: true,
        followers: 420,
      },
    ];
    setOrganizers(mockOrganizers);
  };

  const loadEvents = async (): Promise<void> => {
    // Mock events data - in real app, fetch from API
    const mockEvents: Event[] = [];
    setEvents(mockEvents);
  };

  const loadQuickActions = async (): Promise<void> => {
    const mockActions: QuickAction[] = [
      {
        id: "1",
        title: "Create Event",
        icon: "📅",
        route: "/create-event",
        isEnabled: true,
      },
      {
        id: "2",
        title: "My Tickets",
        icon: "🎫",
        route: "/tickets",
        badge: 3,
        isEnabled: true,
      },
      {
        id: "3",
        title: "Saved Events",
        icon: "❤️",
        route: "/saved",
        badge: 5,
        isEnabled: true,
      },
      {
        id: "4",
        title: "Rewards",
        icon: "🏆",
        route: "/rewards",
        badge: 2,
        isEnabled: true,
      },
    ];
    setQuickActions(mockActions);
  };

  const loadUserPreferences = async (): Promise<void> => {
    // Load user preferences from storage/API
    const preferences = {
      favoriteCategories: ["Tech", "Music", "Sports"],
      preferredLocations: ["Delhi NCR", "Mumbai"],
      followedOrganizers: ["1", "2"],
    };
    setUserPreferences(preferences);
  };

  // Enhanced search and filtering
  const handleSearch = useCallback(() => {
    let filtered = [...events];

    // Text search
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Date filter
    const now = new Date();
    switch (filterOptions.dateRange) {
      case "Today":
        filtered = filtered.filter(
          (event) => event.date.toDateString() === now.toDateString()
        );
        break;
      case "This Week":
        const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(
          (event) => event.date >= now && event.date <= weekFromNow
        );
        break;
      case "This Month":
        filtered = filtered.filter(
          (event) =>
            event.date.getMonth() === now.getMonth() &&
            event.date.getFullYear() === now.getFullYear()
        );
        break;
    }

    // Price filter
    switch (filterOptions.priceType) {
      case "Free":
        filtered = filtered.filter((event) => event.isFree);
        break;
      case "Paid":
        filtered = filtered.filter((event) => !event.isFree);
        break;
    }

    // Sort events
    filtered.sort((a, b) => {
      switch (filterOptions.sortBy) {
        case "date":
          return a.date.getTime() - b.date.getTime();
        case "popularity":
          return (b.attendees || 0) - (a.attendees || 0);
        case "price":
          return a.price - b.price;
        default:
          return 0;
      }
    });

    setFilteredEvents(filtered);
  }, [searchQuery, filterOptions, events]);

  // Pull-to-refresh handler
  const onRefresh = async (): Promise<void> => {
    setRefreshing(true);
    await initializeScreen();
    setRefreshing(false);
  };

  // Dynamic action handlers
  const handleLocationPress = (location: Location) => {
    trackAnalytics("location_pressed", {
      locationId: location.id,
      locationName: location.name,
    });
    setFilterOptions((prev) => ({ ...prev, location: location.name }));
    // Navigate to location-specific events or update filters
  };

  const handleTopicPress = (topic: TrendingTopic) => {
    trackAnalytics("topic_pressed", {
      topicId: topic.id,
      topicName: topic.name,
    });
    setFilterOptions((prev) => ({ ...prev, category: topic.name }));
    // Navigate to topic-specific events
  };

  const handleOrganizerPress = (organizer: Organizer) => {
    trackAnalytics("organizer_pressed", { organizerId: organizer.id });
    // Navigate to organizer profile or events
  };

  const handleFollowOrganizer = async (organizerId: string) => {
    try {
      const organizer = organizers.find((org) => org.id === organizerId);
      if (!organizer) return;

      const isCurrentlyFollowing =
        userPreferences.followedOrganizers.includes(organizerId);

      // Update local state optimistically
      setOrganizers((prev) =>
        prev.map((org) =>
          org.id === organizerId
            ? {
                ...org,
                isFollowing: !isCurrentlyFollowing,
                followers: org.followers! + (isCurrentlyFollowing ? -1 : 1),
              }
            : org
        )
      );

      setUserPreferences((prev) => ({
        ...prev,
        followedOrganizers: isCurrentlyFollowing
          ? prev.followedOrganizers.filter((id) => id !== organizerId)
          : [...prev.followedOrganizers, organizerId],
      }));

      trackAnalytics("organizer_follow_toggled", {
        organizerId,
        action: isCurrentlyFollowing ? "unfollow" : "follow",
      });

      // In real app, make API call here
      // await api.toggleFollowOrganizer(organizerId);
    } catch (error) {
      console.error("Error following organizer:", error);
      Alert.alert("Error", "Failed to update follow status");
    }
  };

  const handleQuickAction = (action: QuickAction) => {
    if (!action.isEnabled) return;

    trackAnalytics("quick_action_pressed", {
      actionId: action.id,
      actionTitle: action.title,
    });

    if (action.onPress) {
      action.onPress();
    } else if (action.route) {
      // Navigate to route
      console.log("Navigate to:", action.route);
    }
  };

  // Analytics tracking function
  const trackAnalytics = (event: string, params: Record<string, any>) => {
    console.log("Analytics:", event, params);
    // Integrate with your analytics service (Firebase, Mixpanel, etc.)
  };

  // Advanced filter modal
  const AdvancedFiltersModal = () => (
    <Modal
      visible={showAdvancedFilters}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Advanced Filters</Text>
          <TouchableOpacity onPress={() => setShowAdvancedFilters(false)}>
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          {/* Date Range Filter */}
          <Text style={styles.filterSectionTitle}>Date Range</Text>
          <View style={styles.filterRow}>
            {["All", "Today", "This Week", "This Month"].map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.filterOption,
                  filterOptions.dateRange === option &&
                    styles.selectedFilterOption,
                ]}
                onPress={() =>
                  setFilterOptions((prev) => ({
                    ...prev,
                    dateRange: option as any,
                  }))
                }
              >
                <Text
                  style={[
                    styles.filterOptionText,
                    filterOptions.dateRange === option &&
                      styles.selectedFilterOptionText,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Price Filter */}
          <Text style={styles.filterSectionTitle}>Price</Text>
          <View style={styles.filterRow}>
            {["All", "Free", "Paid"].map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.filterOption,
                  filterOptions.priceType === option &&
                    styles.selectedFilterOption,
                ]}
                onPress={() =>
                  setFilterOptions((prev) => ({
                    ...prev,
                    priceType: option as any,
                  }))
                }
              >
                <Text
                  style={[
                    styles.filterOptionText,
                    filterOptions.priceType === option &&
                      styles.selectedFilterOptionText,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Apply Filters Button */}
          <TouchableOpacity
            style={styles.applyFiltersButton}
            onPress={() => {
              setShowAdvancedFilters(false);
              handleSearch();
            }}
          >
            <Text style={styles.applyFiltersButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );

  // Component renderers with enhanced functionality
  const renderLocationCard = ({ item }: { item: Location }) => (
    <TouchableOpacity
      style={[styles.locationCard, !item.isActive && styles.inactiveCard]}
      activeOpacity={0.7}
      onPress={() => handleLocationPress(item)}
      disabled={!item.isActive}
    >
      <Text style={styles.locationEmoji}>{item.emoji}</Text>
      <Text style={styles.locationName}>{item.name}</Text>
      <Text style={styles.locationCount}>{item.count} events</Text>
      {userPreferences.preferredLocations.includes(item.name) && (
        <View style={styles.preferredBadge}>
          <Text style={styles.preferredBadgeText}>⭐</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderTrendingTopic = ({ item }: { item: TrendingTopic }) => (
    <TouchableOpacity
      style={[styles.topicCard, { backgroundColor: item.color + "20" }]}
      activeOpacity={0.7}
      onPress={() => handleTopicPress(item)}
    >
      <View style={[styles.topicIcon, { backgroundColor: item.color }]}>
        {item.trending && <Text style={styles.trendingIndicator}>🔥</Text>}
      </View>
      <View style={styles.topicContent}>
        <Text style={styles.topicName}>{item.name}</Text>
        <Text style={styles.topicCount}>{item.count}</Text>
        {item.growth && item.growth > 0 && (
          <Text style={styles.growthIndicator}>+{item.growth}% this week</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderOrganizerCard = ({ item }: { item: Organizer }) => (
    <TouchableOpacity
      style={styles.organizerCard}
      activeOpacity={0.7}
      onPress={() => handleOrganizerPress(item)}
    >
      <View style={styles.organizerImageContainer}>
        <Text style={styles.organizerImage}>{item.image}</Text>
        {item.verified && <Text style={styles.verifiedBadge}>✓</Text>}
      </View>
      <View style={styles.organizerInfo}>
        <Text style={styles.organizerName}>{item.name}</Text>
        <Text style={styles.organizerStats}>
          {item.events} events • ⭐ {item.rating} • {item.followers} followers
        </Text>
      </View>
      <TouchableOpacity
        style={[
          styles.followButton,
          item.isFollowing && styles.followingButton,
        ]}
        onPress={() => handleFollowOrganizer(item.id)}
      >
        <Text
          style={[
            styles.followButtonText,
            item.isFollowing && styles.followingButtonText,
          ]}
        >
          {item.isFollowing ? "Following" : "Follow"}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderQuickAction = ({ item }: { item: QuickAction }) => (
    <TouchableOpacity
      style={[styles.actionCard, !item.isEnabled && styles.disabledActionCard]}
      activeOpacity={0.7}
      onPress={() => handleQuickAction(item)}
      disabled={!item.isEnabled}
    >
      <View style={styles.actionIconContainer}>
        <Text style={styles.actionIcon}>{item.icon}</Text>
        {item.badge && item.badge > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.badge}</Text>
          </View>
        )}
      </View>
      <Text
        style={[
          styles.actionText,
          !item.isEnabled && styles.disabledActionText,
        ]}
      >
        {item.title}
      </Text>
    </TouchableOpacity>
  );

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

      {/* Header Section with Enhanced Search */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Explore Events</Text>
          <Text style={styles.headerSubtitle}>
            Find your next amazing experience
          </Text>

          {/* Enhanced Search Bar with Advanced Filter Button */}
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search events, organizers, topics..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setShowAdvancedFilters(true)}
            >
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
            data={locations.filter((loc) => loc.isActive)}
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
            {trendingTopics.map((topic: TrendingTopic) => (
              <TouchableOpacity
                key={topic.id}
                style={[
                  styles.topicCard,
                  { backgroundColor: topic.color + "20" },
                ]}
                activeOpacity={0.7}
                onPress={() => handleTopicPress(topic)}
              >
                <View
                  style={[styles.topicIcon, { backgroundColor: topic.color }]}
                >
                  {topic.trending && (
                    <Text style={styles.trendingIndicator}>🔥</Text>
                  )}
                </View>
                <View style={styles.topicContent}>
                  <Text style={styles.topicName}>{topic.name}</Text>
                  <Text style={styles.topicCount}>{topic.count}</Text>
                  {topic.growth && topic.growth > 0 && (
                    <Text style={styles.growthIndicator}>
                      +{topic.growth}% this week
                    </Text>
                  )}
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
          {organizers.map((organizer: Organizer) =>
            renderOrganizerCard({ item: organizer })
          )}
        </Animated.View>

        {/* Quick Actions Grid Section */}
        <Animated.View
          style={[styles.section, { opacity: fadeAnim, marginBottom: 100 }]}
        >
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <FlatList
            data={quickActions}
            numColumns={2}
            renderItem={renderQuickAction}
            keyExtractor={(item) => item.id}
            columnWrapperStyle={styles.actionsRow}
          />
        </Animated.View>
      </ScrollView>

      {/* Advanced Filters Modal */}
      <AdvancedFiltersModal />

      {/* Bottom Navigation Placeholder */}
      <View style={styles.bottomNav}>
        {/* Navigation items can be added here */}
      </View>
    </View>
  );
}

// Enhanced StyleSheet with new styles
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
    position: "relative",
  },
  inactiveCard: {
    opacity: 0.5,
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
  preferredBadge: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "#FEF3C7",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  preferredBadgeText: {
    fontSize: 10,
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
    justifyContent: "center",
    alignItems: "center",
  },
  trendingIndicator: {
    fontSize: 12,
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
  growthIndicator: {
    fontSize: 10,
    color: "#059669",
    fontWeight: "600",
    marginTop: 2,
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
  organizerImageContainer: {
    position: "relative",
    marginRight: 12,
  },
  organizerImage: {
    fontSize: 32,
  },
  verifiedBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "#10B981",
    color: "white",
    fontSize: 10,
    width: 16,
    height: 16,
    borderRadius: 8,
    textAlign: "center",
    lineHeight: 16,
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
    fontSize: 12,
    color: "#6B7280",
  },
  followButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  followingButton: {
    backgroundColor: "#E5E7EB",
  },
  followButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  followingButtonText: {
    color: "#374151",
  },

  // Quick Actions Grid Styles
  actionsRow: {
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
  disabledActionCard: {
    opacity: 0.5,
    backgroundColor: "#F3F4F6",
  },
  actionIconContainer: {
    position: "relative",
    marginBottom: 8,
  },
  actionIcon: {
    fontSize: 24,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  disabledActionText: {
    color: "#9CA3AF",
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#EF4444",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "600",
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  closeButton: {
    fontSize: 18,
    color: "#6B7280",
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
    marginTop: 20,
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  filterOption: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedFilterOption: {
    backgroundColor: "#2563EB",
  },
  filterOptionText: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "500",
  },
  selectedFilterOptionText: {
    color: "#FFFFFF",
  },
  applyFiltersButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 30,
  },
  applyFiltersButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
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
