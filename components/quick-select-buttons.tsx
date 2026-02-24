import { View, Text, Pressable, Platform } from "react-native";
import * as Haptics from "expo-haptics";

interface QuickSelectButtonsProps {
  onSelect: (amount: number) => void;
  selectedAmount: number;
}

const QUICK_AMOUNTS = [10000, 20000, 30000, 50000];

export function QuickSelectButtons({ onSelect, selectedAmount }: QuickSelectButtonsProps) {
  const handlePress = (amount: number) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onSelect(amount);
  };

  return (
    <View className="flex-row gap-4 flex-wrap justify-center">
      {QUICK_AMOUNTS.map((amount) => {
        const isSelected = selectedAmount === amount;
        return (
          <Pressable
            key={amount}
            onPress={() => handlePress(amount)}
            style={({ pressed }) => [
              {
                transform: [{ scale: pressed ? 0.97 : 1 }],
                opacity: pressed ? 0.9 : 1,
              },
            ]}
            className={`px-10 py-6 rounded-2xl min-w-[140px] ${
              isSelected ? "bg-primary" : "bg-surface border-2 border-primary"
            }`}
          >
            <Text
              className={`text-3xl font-bold text-center ${
                isSelected ? "text-white" : "text-primary"
              }`}
            >
              ¥{amount.toLocaleString()}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
