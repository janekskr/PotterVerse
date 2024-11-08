import { Text, type TextProps, StyleSheet } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type Weights = "black" | "bold" | "italic" | "light" | "semibold" | "medium" | "extrabold" | "regular"

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
  weight?: Weights
};

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
  },
  title: {
    fontSize: 32,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
  },
});

const variantStyles = {
  default: styles.default,
  defaultSemiBold: styles.defaultSemiBold,
  title: styles.title,
  subtitle: styles.subtitle,
  link: styles.link,
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  weight= "regular",
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  const variantStyle = variantStyles[type];

  return (
    <Text
      style={[
        {fontFamily: `Poppins-${weight}`},
        { color },
        variantStyle,
        style,
      ]}
      {...rest}
    />
  );
}
