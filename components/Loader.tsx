import { ActivityIndicator } from "react-native";
import { Container } from "./ui";
import Colors from "@/constants/Colors";

export default function Loader() {
  return (
    <Container style={{ justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </Container>
  );
}
