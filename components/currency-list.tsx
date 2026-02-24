import { View, Text, ScrollView } from "react-native";
import { CurrencyConversion, formatCurrencyAmount } from "@/lib/exchange-rates";

interface CurrencyListProps {
  conversions: CurrencyConversion[];
}

export function CurrencyList({ conversions }: CurrencyListProps) {
  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="gap-4 pb-4">
        {conversions.map((conversion, index) => (
          <View
            key={conversion.code}
            className="bg-surface rounded-2xl p-8 border-2 border-border"
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-6">
                <Text className="text-6xl">{conversion.flag}</Text>
                <View>
                  <Text className="text-3xl font-bold text-foreground">
                    {conversion.code}
                  </Text>
                  <Text className="text-lg text-muted">{conversion.name}</Text>
                </View>
              </View>
              <View className="items-end">
                <Text className="text-5xl font-semibold text-foreground">
                  {conversion.symbol}
                  {formatCurrencyAmount(conversion.amount, conversion.code)}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
