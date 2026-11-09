import { Text, type TextProps } from 'react-native';
import { colors, type, type TypeVariant } from '../theme';

interface Props extends TextProps {
  variant?: TypeVariant;
  color?: string;
}

/** Text with the app's type scale. Pick a `variant` instead of styling by hand. */
export function Txt({ variant = 'body', color = colors.text, style, ...rest }: Props) {
  return <Text {...rest} style={[type[variant], { color }, style]} />;
}
