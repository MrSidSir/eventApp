import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function EventCard({ event }: { event: any }) {
  return (
    <TouchableOpacity style={styles.card}>
      {event.isPopular && (
        <View style={styles.popularTag}>
          <Text style={styles.popularText}>🔥 Popular</Text>
        </View>
      )}
      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.date}>{event.date}</Text>
      <Text style={styles.location}>{event.location}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  popularTag: {
    backgroundColor: "#ff4d4d",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  popularText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  date: {
    fontSize: 14,
    color: "#666",
    marginVertical: 4,
  },
  location: {
    fontSize: 14,
    color: "#999",
  },
});
