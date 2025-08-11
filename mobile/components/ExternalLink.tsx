import { Href, Link } from 'expo-router';
import { openBrowserAsync } from 'expo-web-browser';
import { type ComponentProps } from 'react';
import { Platform } from 'react-native';

type Props = Omit<ComponentProps<typeof Link>, 'href'> & {
  href: Href & string;
  // Event app specific props
  eventId?: string;
  trackAnalytics?: boolean;
  linkType?: 'event-website' | 'ticket-purchase' | 'venue-map' | 'social-media' | 'sponsor' | 'general';
  requireAuth?: boolean;
};

export function ExternalLink({ 
  href, 
  eventId,
  trackAnalytics = true,
  linkType = 'general',
  requireAuth = false,
  ...rest 
}: Props) {
  
  const handlePress = async (event: any) => {
    // Track analytics for event app
    if (trackAnalytics) {
      // You can replace this with your analytics service
      console.log(`External link clicked: ${linkType}`, {
        href,
        eventId,
        platform: Platform.OS,
        timestamp: new Date().toISOString()
      });
    }

    // Check authentication if required
    if (requireAuth) {
      // Add your auth check logic here
      // const isAuthenticated = await checkUserAuth();
      // if (!isAuthenticated) {
      //   // Redirect to login or show auth modal
      //   return;
      // }
    }

    if (Platform.OS !== 'web') {
      // Prevent the default behavior of linking to the default browser on native
      event.preventDefault();
      
      // Open the link in an in-app browser with event app styling
      await openBrowserAsync(href, {
        // Customize browser appearance for event app
        controlsColor: '#6366f1', // Event app primary color
        toolbarColor: '#1f2937',  // Dark toolbar
        secondaryToolbarColor: '#374151',
        showTitle: true,
        enableBarCollapsing: true,
        showInRecents: true,
      });
    }
  };

  return (
    <Link
      target="_blank"
      {...rest}
      href={href}
      onPress={handlePress}
    />
  );
}