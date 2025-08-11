import React from 'react';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';
import { Platform, GestureResponderEvent } from 'react-native';

interface EventAppTabProps extends BottomTabBarButtonProps {
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
    if (isLiveEvent && tabName === 'events') {
      return Haptics.ImpactFeedbackStyle.Medium;
    }
    if (hasNotification) {
      return Haptics.ImpactFeedbackStyle.Light;
    }
    return Haptics.ImpactFeedbackStyle.Light;
  };

  const handlePressIn = async (ev: GestureResponderEvent) => {
    try {
      // Base haptic
      await Haptics.impactAsync(getHapticFeedback());

      // Special pattern for live events
      if (isLiveEvent && tabName === 'events') {
        setTimeout(async () => {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }, 100);
      }

      // Analytics tracking
      if (trackAnalytics && tabName) {
        console.log('Tab pressed:', {
          tabName,
          hasNotification,
          isLiveEvent,
          platform: Platform.OS,
          timestamp: new Date().toISOString(),
        });
        // Replace with real analytics
        // analytics.track('tab_pressed', { tabName, hasNotification, isLiveEvent });
      }

      props.onPressIn?.(ev);
    } catch (error) {
      console.error('Haptic error:', error);
    }
  };

  const handlePress = (ev: GestureResponderEvent) => {
    try {
      if (hasNotification) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      props.onPress?.(ev);
    } catch (error) {
      console.error('Haptic press error:', error);
    }
  };

  return (
    <PlatformPressable
      {...props}
      onPressIn={handlePressIn}
      onPress={handlePress}
      delayPressIn={0}
    />
  );
}
