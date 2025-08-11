// components/Collapsible.tsx - Fixed Collapsible Component
import React, { PropsWithChildren, useState } from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";

interface CollapsibleProps extends PropsWithChildren {
  title: string;
}

export function Collapsible({ children, title }: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={collapsibleStyles.container}>
      <TouchableOpacity
        style={collapsibleStyles.heading}
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.8}
      >
        <Text
          style={[
            collapsibleStyles.chevron,
            { transform: [{ rotate: isOpen ? "90deg" : "0deg" }] },
          ]}
        >
          ▶
        </Text>
        <Text style={collapsibleStyles.title}>{title}</Text>
      </TouchableOpacity>
      {isOpen && <View style={collapsibleStyles.content}>{children}</View>}
    </View>
  );
}

const collapsibleStyles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  heading: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  chevron: {
    fontSize: 14,
    color: "#6B7280",
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 0,
  },
});

// components/EventCard.tsx - Professional Event Card Component
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
} from "react-native";
import { Event } from "../types";

interface EventCardProps {
  event: Event;
  onPress: (event: Event) => void;
  onBook: (event: Event) => void;
  fadeAnim?: Animated.Value;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onPress,
  onBook,
  fadeAnim = new Animated.Value(1),
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Animated.View style={[eventCardStyles.container, { opacity: fadeAnim }]}>
      <TouchableOpacity
        style={eventCardStyles.card}
        activeOpacity={0.8}
        onPress={() => onPress(event)}
      >
        <View style={eventCardStyles.imageContainer}>
          <Image
            source={{
              uri: event.image || "https://via.placeholder.com/300x150",
            }}
            style={eventCardStyles.image}
          />
          {event.isPopular && (
            <View style={eventCardStyles.popularBadge}>
              <Text style={eventCardStyles.popularText}>🔥 Popular</Text>
            </View>
          )}
          {event.isFree && (
            <View style={eventCardStyles.freeBadge}>
              <Text style={eventCardStyles.freeText}>FREE</Text>
            </View>
          )}
        </View>

        <View style={eventCardStyles.content}>
          <Text style={eventCardStyles.title} numberOfLines={2}>
            {event.title}
          </Text>

          <View style={eventCardStyles.meta}>
            <View style={eventCardStyles.metaRow}>
              <Text style={eventCardStyles.metaIcon}>📅</Text>
              <Text style={eventCardStyles.metaText}>
                {formatDate(event.date)} • {event.time}
              </Text>
            </View>
            <View style={eventCardStyles.metaRow}>
              <Text style={eventCardStyles.metaIcon}>📍</Text>
              <Text style={eventCardStyles.metaText} numberOfLines={1}>
                {event.location}
              </Text>
            </View>
            <View style={eventCardStyles.metaRow}>
              <Text style={eventCardStyles.metaIcon}>👥</Text>
              <Text style={eventCardStyles.metaText}>
                {event.attendees} attending
              </Text>
            </View>
          </View>

          <View style={eventCardStyles.footer}>
            <Text
              style={[
                eventCardStyles.price,
                event.isFree && eventCardStyles.freePrice,
              ]}
            >
              {event.price}
            </Text>
            <TouchableOpacity
              style={eventCardStyles.bookButton}
              onPress={() => onBook(event)}
            >
              <Text style={eventCardStyles.bookButtonText}>Book Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const eventCardStyles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
  },
  image: {
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
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
    lineHeight: 24,
  },
  meta: {
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
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: 18,
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
});

// components/LoadingSpinner.tsx - Professional Loading Component
import React from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";

interface LoadingSpinnerProps {
  size?: "small" | "large";
  color?: string;
  text?: string;
  style?: any;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "large",
  color = "#2563EB",
  text = "Loading...",
  style,
}) => {
  return (
    <View style={[loadingStyles.container, style]}>
      <ActivityIndicator size={size} color={color} />
      {text && <Text style={loadingStyles.text}>{text}</Text>}
    </View>
  );
};

const loadingStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  text: {
    marginTop: 12,
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
});

// components/EmptyState.tsx - Professional Empty State Component
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  onButtonPress?: () => void;
  icon?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No Data Found",
  subtitle = "There are no items to display right now",
  buttonText,
  onButtonPress,
  icon = "📭",
}) => {
  return (
    <View style={emptyStyles.container}>
      <Text style={emptyStyles.icon}>{icon}</Text>
      <Text style={emptyStyles.title}>{title}</Text>
      <Text style={emptyStyles.subtitle}>{subtitle}</Text>
      {buttonText && onButtonPress && (
        <TouchableOpacity style={emptyStyles.button} onPress={onButtonPress}>
          <Text style={emptyStyles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const emptyStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  icon: {
    fontSize: 48,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

// components/SearchBar.tsx - Professional Search Component
import React from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFilter?: () => void;
  showFilter?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = "Search...",
  onFilter,
  showFilter = true,
}) => {
  return (
    <View style={searchStyles.container}>
      <View style={searchStyles.searchContainer}>
        <Text style={searchStyles.searchIcon}>🔍</Text>
        <TextInput
          style={searchStyles.input}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={onChangeText}
        />
      </View>
      {showFilter && onFilter && (
        <TouchableOpacity style={searchStyles.filterButton} onPress={onFilter}>
          <Text style={searchStyles.filterIcon}>⚙️</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const searchStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
  },
  filterButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 12,
    borderRadius: 12,
  },
  filterIcon: {
    fontSize: 16,
  },
});

// components/CategoryChips.tsx - Professional Category Filter Component
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";

interface CategoryChipsProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const renderChip = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        chipStyles.chip,
        selectedCategory === item && chipStyles.selectedChip,
      ]}
      onPress={() => onSelectCategory(item)}
    >
      <Text
        style={[
          chipStyles.chipText,
          selectedCategory === item && chipStyles.selectedChipText,
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={categories}
      horizontal
      showsHorizontalScrollIndicator={false}
      renderItem={renderChip}
      keyExtractor={(item: string) => item}
      style={chipStyles.container}
    />
  );
};

const chipStyles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  chip: {
    backgroundColor: "#E5E7EB",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  selectedChip: {
    backgroundColor: "#2563EB",
  },
  chipText: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "600",
  },
  selectedChipText: {
    color: "#FFFFFF",
  },
});

// components/HapticTab.tsx - Professional Tab Component
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface HapticTabProps {
  name: string;
  label: string;
  icon?: string;
  isActive: boolean;
  onPress: () => void;
}

export const HapticTab: React.FC<HapticTabProps> = ({
  name,
  label,
  icon,
  isActive,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[hapticStyles.tab, isActive && hapticStyles.activeTab]}
      onPress={onPress}
    >
      {icon && <Text style={hapticStyles.icon}>{icon}</Text>}
      <Text style={[hapticStyles.label, isActive && hapticStyles.activeLabel]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const hapticStyles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  activeTab: {
    backgroundColor: "transparent",
  },
  icon: {
    fontSize: 20,
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  activeLabel: {
    color: "#2563EB",
    fontWeight: "600",
  },
});

// components/HelloWave.tsx - Welcome Animation Component
import React, { useEffect } from "react";
import { Text, StyleSheet, Animated } from "react-native";

export const HelloWave: React.FC = () => {
  const waveAnimation = new Animated.Value(0);

  useEffect(() => {
    const wave = () => {
      Animated.sequence([
        Animated.timing(waveAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(waveAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => wave());
    };
    wave();
  }, []);

  const animatedStyle = {
    transform: [
      {
        rotate: waveAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", "20deg"],
        }),
      },
    ],
  };

  return (
    <Animated.Text style={[helloStyles.wave, animatedStyle]}>👋</Animated.Text>
  );
};

const helloStyles = StyleSheet.create({
  wave: {
    fontSize: 28,
    lineHeight: 32,
  },
});

// components/ParallaxScrollView.tsx - Professional Parallax Component
import React, { PropsWithChildren, ReactElement } from "react";
import {
  StyleSheet,
  ScrollView,
  Animated,
  useColorScheme,
  View,
} from "react-native";

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor?: { dark: string; light: string };
}>;

export const ParallaxScrollView: React.FC<Props> = ({
  children,
  headerImage,
  headerBackgroundColor = { light: "#A1CEDC", dark: "#1D3D47" },
}) => {
  const colorScheme = useColorScheme() ?? "light";
  const scrollY = new Animated.Value(0);

  return (
    <View style={parallaxStyles.container}>
      <Animated.View
        style={[
          parallaxStyles.header,
          { backgroundColor: headerBackgroundColor[colorScheme] },
        ]}
      >
        {headerImage}
      </Animated.View>
      <ScrollView
        style={parallaxStyles.scrollView}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <View style={parallaxStyles.content}>{children}</View>
      </ScrollView>
    </View>
  );
};

const parallaxStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 250,
    overflow: "hidden",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    gap: 16,
    overflow: "hidden",
  },
});

// components/ThemedText.tsx - Themed Text Component
import React from "react";
import { Text, StyleSheet, TextProps, useColorScheme } from "react-native";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

export const ThemedText: React.FC<ThemedTextProps> = ({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}) => {
  const theme = useColorScheme() ?? "light";
  const color = theme === "light" ? lightColor : darkColor;

  return (
    <Text
      style={[
        { color: color ?? (theme === "light" ? "#11181C" : "#ECEDEE") },
        type === "default" ? themedTextStyles.default : undefined,
        type === "title" ? themedTextStyles.title : undefined,
        type === "defaultSemiBold"
          ? themedTextStyles.defaultSemiBold
          : undefined,
        type === "subtitle" ? themedTextStyles.subtitle : undefined,
        type === "link" ? themedTextStyles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
};

const themedTextStyles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: "#0a7ea4",
  },
});

// components/ThemedView.tsx - Themed View Component
import React from "react";
import { View, ViewProps, useColorScheme } from "react-native";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export const ThemedView: React.FC<ThemedViewProps> = ({
  style,
  lightColor,
  darkColor,
  ...otherProps
}) => {
  const theme = useColorScheme() ?? "light";
  const backgroundColor = theme === "light" ? lightColor : darkColor;

  return (
    <View
      style={[
        {
          backgroundColor:
            backgroundColor ?? (theme === "light" ? "#fff" : "#151718"),
        },
        style,
      ]}
      {...otherProps}
    />
  );
};

// components/ExternalLink.tsx - External Link Component
import React from "react";
import {
  Text,
  TouchableOpacity,
  Linking,
  Alert,
  StyleSheet,
} from "react-native";

interface ExternalLinkProps {
  href: string;
  children: React.ReactNode;
  style?: any;
}

export const ExternalLink: React.FC<ExternalLinkProps> = ({
  href,
  children,
  style,
}) => {
  const handlePress = async () => {
    try {
      const supported = await Linking.canOpenURL(href);
      if (supported) {
        await Linking.openURL(href);
      } else {
        Alert.alert("Error", "Cannot open this URL");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to open URL");
    }
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Text style={[externalLinkStyles.link, style]}>{children}</Text>
    </TouchableOpacity>
  );
};

const externalLinkStyles = StyleSheet.create({
  link: {
    color: "#0a7ea4",
    textDecorationLine: "underline",
  },
});
