import { ActivityIndicator } from "react-native";
import { Container } from "./ui";

export default function Loader() {
  return (
    <Container style={{ justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </Container>
  );
}
