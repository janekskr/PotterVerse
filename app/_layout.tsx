import ReactQueryProvider from "@/components/provider/ReactQueryProvider";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import "react-native-reanimated";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    HarryP: require("../assets/fonts/HarryP.ttf"),
    MagicSchoolOne: require("../assets/fonts/MagicSchoolOne.ttf"),
    MagicSchoolTwo: require("../assets/fonts/MagicSchoolTwo.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
    <ReactQueryProvider>
        <Stack screenOptions={{headerShadowVisible: false}}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="character/[id]"/>
          <Stack.Screen name="house/[houseName]" options={{headerTransparent: true, title: ""}}/>
          <Stack.Screen name="search" options={{headerShown: false}} />
        </Stack>
      </ReactQueryProvider>
    </ThemeProvider>
  );
}
