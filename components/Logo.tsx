import { Image } from 'expo-image'
import { useColorScheme } from 'react-native'

export default function Logo() {
  const theme = useColorScheme()

  if(theme === "dark") return (
    <Image source={require("@/assets/images/potterverse_logo_dark.svg")} style={{
      height: 45,
      aspectRatio: 5.32
  }}/>
  )
  return (
    <Image source={require("@/assets/images/potterverse_logo.svg")} style={{
        height: 45,
        aspectRatio: 5.32
    }}/>
  )
}