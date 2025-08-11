import React, { useEffect, useState } from "react";
import { Animated, TouchableOpacity, StyleSheet } from "react-native";

interface HelloWaveProps {
  size?: "small" | "medium" | "large";
  speed?: "slow" | "normal" | "fast";
  emoji?: string;
  autoStart?: boolean;
}

export const HelloWave: React.FC<HelloWaveProps> = ({
  size = "medium",
  speed = "normal",
  emoji = "👋",
  autoStart = true,
}) => {
  // 1. Animated.Value create karte hain for rotation animation
  const [waveAnim] = useState(new Animated.Value(0));
  const [isWaving, setIsWaving] = useState(autoStart);

  // 2. Size mapping: emoji ki font size adjust karne ke liye
  const sizeMap = {
    small: 24,
    medium: 40,
    large: 60,
  };

  // 3. Speed mapping: animation duration adjust karne ke liye
  const speedMap = {
    slow: 1500,
    normal: 1000,
    fast: 700,
  };

  // 4. Waving animation sequence: rotation angle ko animate karte hain
  const wave = () => {
    setIsWaving(true);
    Animated.sequence([
      Animated.timing(waveAnim, {
        toValue: 1,
        duration: speedMap[speed],
        useNativeDriver: true,
      }),
      Animated.timing(waveAnim, {
        toValue: -1,
        duration: speedMap[speed],
        useNativeDriver: true,
      }),
      Animated.timing(waveAnim, {
        toValue: 0,
        duration: speedMap[speed],
        useNativeDriver: true,
      }),
    ]).start(() => setIsWaving(false)); // Animation ke end me waving false kar do
  };

  // 5. Auto start: agar autoStart true hai to har 3 second me wave function chalao
  useEffect(() => {
    if (autoStart) {
      const interval = setInterval(() => {
        wave();
      }, 3000);
      return () => clearInterval(interval); // Cleanup interval jab component unmount ho
    }
  }, [autoStart, speed]);

  // 6. Animated interpolation: rotation ko degree me convert karna
  const rotate = waveAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ["-14deg", "0deg", "14deg"],
  });

  // 7. Render Animated Text (emoji) jo rotate hota hai jab wave chal raha hai
  return (
    <TouchableOpacity onPress={wave} activeOpacity={0.7}>
      <Animated.Text
        style={[
          styles.emoji,
          { fontSize: sizeMap[size], transform: [{ rotate }] },
        ]}
        accessibilityLabel="Waving hand"
      >
        {emoji}
      </Animated.Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  emoji: {
    alignSelf: "center",
  },
});
