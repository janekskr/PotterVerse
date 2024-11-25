import { ColorValue } from "react-native";
import Colors  from "@/constants/Colors";

export function getHouseColor(houseName: string | null) {
    if(!houseName) return null
    const color = Colors[houseName.toLowerCase() as keyof typeof Colors] as ColorValue
    return color
}

export const isObjectEmpty = (object:object) => Object.keys(object).length === 0