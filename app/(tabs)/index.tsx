import { StyleSheet } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import {IconSymbol} from "@/components/ui/IconSymbol";

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#116a93', dark: '#1D3D47' }}
      headerImage={
          <IconSymbol
              size={310}
              color="#808080"
              name="cart"
              style={styles.headerImage}
          />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome shopper!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Find Your Products</ThemedText>
        <ThemedText>
          Ask our AI about products available at Idaho Supermarket. Want to know about fresh produce,
          dairy, or special deals? Just type your query below!
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">How to Use</ThemedText>
        <ThemedText>
          Simply type your product-related question in the chat input. Our AI-powered assistant
          will help you find exactly what you're looking for in the store.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Smart Shopping Starts Here</ThemedText>
        <ThemedText>
          Leverage AI to get instant information about product availability, prices,
          and recommendations from Idaho Supermarket.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  }
});
