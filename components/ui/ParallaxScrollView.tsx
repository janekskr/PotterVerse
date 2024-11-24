import type { PropsWithChildren, ReactElement } from 'react';
import { Dimensions, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';

import { ThemedView } from './ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerHeight?: number
  style?: ViewStyle;
  minHeight?:boolean;
}>;

export default function ParallaxScrollView({
  children,
  headerImage,
  headerHeight = 250,
  minHeight,
  style,
}: Props) {
  const backgroundColor = useThemeColor({ light: undefined, dark: undefined }, 'background');
  
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);

  const { height: screenHeight } = Dimensions.get('window');
  const contentMinHeight = screenHeight - headerHeight - 60;

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-headerHeight, 0, headerHeight],
            [-headerHeight / 2, 0, headerHeight * 0.75]
          ),
        },
        {
          scale: interpolate(scrollOffset.value, [-headerHeight, 0, headerHeight], [2, 1, 1]),
        },
      ],
    };
  });


  return (
    <ThemedView style={styles.container}>
      <Animated.ScrollView ref={scrollRef} scrollEventThrottle={16}>
        <Animated.View
          style={[
            styles.header,
            {height: headerHeight},
            headerAnimatedStyle,
          ]}>
          {headerImage}
        </Animated.View>
        <Animated.View style={[styles.content, {backgroundColor}, minHeight && {minHeight: contentMinHeight}, style]}>
          {children}
        </Animated.View>
      </Animated.ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    padding: 32,
    gap: 16,
    overflow: 'hidden',
  },
});

