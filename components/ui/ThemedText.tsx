import { Text, type TextProps, StyleSheet } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "semibold"
  },
  title: {
    fontSize: 32,
    lineHeight: 32,
    fontWeight: "bold"
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
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  const variantStyle = variantStyles[type];

  return (
    <Text
      style={[
        // {fontFamily: "HarryP"},
        { color },
        variantStyle,
        style,
      ]}
      {...rest}
    />
  );
}
