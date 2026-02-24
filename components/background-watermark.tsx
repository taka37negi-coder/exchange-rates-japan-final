import { Image, StyleSheet } from "react-native";

export function BackgroundWatermark() {
  return (
    <Image
      source={require("@/assets/images/kappodo-logo.png")}
      style={styles.watermark}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  watermark: {
    position: "absolute",
    width: "60%",
    height: "60%",
    top: "20%",
    left: "20%",
    opacity: 0.1,
    zIndex: 0,
  },
});
