import { View, Text, Pressable, Modal, Platform } from "react-native";
import * as Haptics from "expo-haptics";
import { useState } from "react";

interface NumberPadProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void;
  initialAmount: number;
}

export function NumberPad({ visible, onClose, onConfirm, initialAmount }: NumberPadProps) {
  const [input, setInput] = useState(initialAmount.toString());

  const handleNumberPress = (num: string) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (num === "clear") {
      setInput("0");
    } else if (num === "backspace") {
      setInput((prev) => {
        const newValue = prev.slice(0, -1);
        return newValue === "" ? "0" : newValue;
      });
    } else {
      setInput((prev) => {
        if (prev === "0") return num;
        // Limit to 10 digits
        if (prev.length >= 10) return prev;
        return prev + num;
      });
    }
  };

  const handleConfirm = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    const amount = parseInt(input, 10);
    if (!isNaN(amount) && amount > 0) {
      onConfirm(amount);
      onClose();
    }
  };

  const handleClose = () => {
    setInput(initialAmount.toString());
    onClose();
  };

  const buttons = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["clear", "0", "backspace"],
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <Pressable
        className="flex-1 bg-black/50 justify-center items-center"
        onPress={handleClose}
      >
        <Pressable
          className="bg-background rounded-3xl p-8 w-[90%] max-w-[500px]"
          onPress={(e) => e.stopPropagation()}
        >
          <Text className="text-3xl font-bold text-center text-foreground mb-2">
            Enter Amount
          </Text>
          
          <View className="bg-surface rounded-2xl p-6 mb-6">
            <Text className="text-6xl font-bold text-center text-foreground">
              ¥{parseInt(input, 10).toLocaleString()}
            </Text>
          </View>

          <View className="gap-3 mb-6">
            {buttons.map((row, rowIndex) => (
              <View key={rowIndex} className="flex-row gap-3">
                {row.map((btn) => (
                  <Pressable
                    key={btn}
                    onPress={() => handleNumberPress(btn)}
                    style={({ pressed }) => [
                      {
                        transform: [{ scale: pressed ? 0.95 : 1 }],
                        opacity: pressed ? 0.7 : 1,
                      },
                    ]}
                    className="flex-1 bg-surface rounded-2xl py-6 items-center justify-center min-h-[80px]"
                  >
                    <Text className="text-3xl font-semibold text-foreground">
                      {btn === "clear"
                        ? "C"
                        : btn === "backspace"
                        ? "⌫"
                        : btn}
                    </Text>
                  </Pressable>
                ))}
              </View>
            ))}
          </View>

          <View className="flex-row gap-3">
            <Pressable
              onPress={handleClose}
              style={({ pressed }) => [
                {
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
              className="flex-1 bg-surface rounded-2xl py-5"
            >
              <Text className="text-xl font-semibold text-center text-foreground">
                Cancel
              </Text>
            </Pressable>
            
            <Pressable
              onPress={handleConfirm}
              style={({ pressed }) => [
                {
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                  opacity: pressed ? 0.9 : 1,
                },
              ]}
              className="flex-1 bg-primary rounded-2xl py-5"
            >
              <Text className="text-xl font-semibold text-center text-white">
                Confirm
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
