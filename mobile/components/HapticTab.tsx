import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';
import { Platform, GestureResponderEvent } from 'react-native';

interface EventAppTabProps extends BottomTabBarButtonProps {
  // Event app specific props
  tabName?: 'events' | 'tickets' | 'schedule' | 'profile' | 'explore' | 'map';
  hasNotification?: boolean;
  isLiveEvent?: boolean;
  trackAnalytics?: boolean;
}

export function HapticTab({ 
  tabName,
  hasNotification = false,
  isLiveEvent = false,
  trackAnalytics = true,
  ...props 
}: EventAppTabProps) {
  
  const getHapticFeedback = () => {
    // Different haptic feedback based on tab type and state
    if (isLiveEvent && tabName === 'events') {
      return Haptics.ImpactFeedbackStyle.Medium; // Stronger feedback for live events
    }
    
    if (hasNotification) {
      return Haptics.ImpactFeedbackStyle.Light; // Light feedback for notifications
    }
    
    // Default feedback for regular tabs
    return Haptics.ImpactFeedbackStyle.Light;
  };

  const handlePressIn = async (ev: GestureResponderEvent) => {
    // Enhanced haptic feedback for both iOS and Android
    if (Platform.OS === 'ios') {
      await Haptics.impactAsync(getHapticFeedback());
    } else if (Platform.OS === 'android') {
      // Add haptic feedback for Android too
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Special haptic pattern for live events
    if (isLiveEvent && tabName === 'events') {
      // Double tap haptic for live events
      setTimeout(async () => {
        if (Platform.OS === 'ios') {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      }, 100);
    }

    // Track tab analytics for event app
    if (trackAnalytics && tabName) {
      console.log('Tab pressed:', {
        tabName,
        hasNotification,
        isLiveEvent,
        platform: Platform.OS,
        timestamp: new Date().toISOString()
      });
      
      // You can replace this with your analytics service
      // analytics.track('tab_pressed', { tabName, hasNotification, isLiveEvent });
    }

    // Call original onPressIn if provided
    props.onPressIn?.(ev);
  };

  const handlePress = (ev: GestureResponderEvent) => {
    // Additional haptic feedback on actual press (not just press in)
    if (hasNotification) {
      // Success haptic when clearing notifications
      if (Platform.OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }

    // Call original onPress if provided
    props.onPress?.(ev);
  };

  return (
    <PlatformPressable
      {...props}
      onPressIn={handlePressIn}
      onPress={handlePress}
      // Add slight delay for better haptic timing
      delayPressIn={0}
    />
  );
}