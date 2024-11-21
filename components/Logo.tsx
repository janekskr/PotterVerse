import { Image } from 'expo-image'

export default function Logo() {
  return (
    <Image source={require("@/assets/images/potterverse_logo.svg")} style={{
        height: 45,
        aspectRatio: 5.32
    }}/>
  )
}