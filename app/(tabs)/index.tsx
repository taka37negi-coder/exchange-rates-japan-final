import { View, Text, Pressable, ActivityIndicator, Platform, RefreshControl } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { QuickSelectButtons } from "@/components/quick-select-buttons";
import { CurrencyList } from "@/components/currency-list";
import { NumberPad } from "@/components/number-pad";
import { BackgroundWatermark } from "@/components/background-watermark";
import { useState, useEffect, useCallback } from "react";
import {
  fetchExchangeRates,
  convertCurrencies,
  formatLastUpdateTime,
  type ExchangeRateResponse,
  type CurrencyConversion,
} from "@/lib/exchange-rates";
import { useResponsiveLayout } from "@/hooks/use-responsive-layout";
import * as Haptics from "expo-haptics";
import { ScrollView } from "react-native";

export default function HomeScreen() {
  const [jpyAmount, setJpyAmount] = useState(10000);
  const [exchangeData, setExchangeData] = useState<ExchangeRateResponse | null>(null);
  const [conversions, setConversions] = useState<CurrencyConversion[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showNumberPad, setShowNumberPad] = useState(false);
  const [lastUpdateText, setLastUpdateText] = useState("");
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  
  const { isLandscape, isTablet } = useResponsiveLayout();

  // Fetch exchange rates
  const loadExchangeRates = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      const data = await fetchExchangeRates();
      setExchangeData(data);
      
      // Calculate conversions
      const converted = convertCurrencies(jpyAmount, data.rates);
      setConversions(converted);
      
      // Update last update text
      setLastUpdateText(formatLastUpdateTime(data.time_last_update_unix));
    } catch (error) {
      console.error("Failed to load exchange rates:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [jpyAmount]);

  // Initial load
  useEffect(() => {
    loadExchangeRates();
  }, []);

  // Update conversions when amount changes
  useEffect(() => {
    if (exchangeData) {
      const converted = convertCurrencies(jpyAmount, exchangeData.rates);
      setConversions(converted);
    }
  }, [jpyAmount, exchangeData]);

  // Update last update text every minute
  useEffect(() => {
    if (!exchangeData) return;
    
    const interval = setInterval(() => {
      setLastUpdateText(formatLastUpdateTime(exchangeData.time_last_update_unix));
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [exchangeData]);

  // Update current date/time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  // Auto-refresh exchange rates every 30 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Auto-refreshing exchange rates...");
      loadExchangeRates(false);
    }, 30 * 60 * 1000); // 30 minutes
    
    return () => clearInterval(interval);
  }, [loadExchangeRates]);

  const formatCurrentDateTime = () => {
    return currentDateTime.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatLastUpdateTimeDisplay = () => {
    if (!exchangeData) return "";
    const date = new Date(exchangeData.time_last_update_unix * 1000);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleAmountSelect = (amount: number) => {
    setJpyAmount(amount);
  };

  const handleCustomAmountPress = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowNumberPad(true);
  };

  const handleRefresh = () => {
    loadExchangeRates(true);
  };

  if (loading) {
    return (
      <ScreenContainer className="justify-center items-center">
        <ActivityIndicator size="large" color="#1E3A8A" />
        <Text className="text-2xl text-muted mt-4">Loading exchange rates...</Text>
      </ScreenContainer>
    );
  }

  // Landscape layout for iPad
  if (isLandscape && isTablet) {
    return (
      <ScreenContainer className="px-8 pt-8">
        <BackgroundWatermark />
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          <View className="gap-6 pb-6">
            {/* Date and Time Header */}
            <View className="items-center bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-2xl font-bold text-foreground">
                {formatCurrentDateTime()}
              </Text>
              <Text className="text-lg text-muted mt-1">
                Last Updated: {formatLastUpdateTimeDisplay()}
              </Text>
            </View>

            {/* Header */}
            <View className="items-center">
              <Text className="text-5xl font-bold text-primary text-center">
                Today's Exchange Rates in Japan
              </Text>
            </View>

            {/* Main Content - Two Column Layout */}
            <View className="flex-row gap-8 flex-1">
              {/* Left Column - Input Section */}
              <View className="flex-1 gap-6">
                {/* Amount Display */}
                <Pressable
                  onPress={handleCustomAmountPress}
                  style={({ pressed }) => [
                    {
                      transform: [{ scale: pressed ? 0.98 : 1 }],
                      opacity: pressed ? 0.9 : 1,
                    },
                  ]}
                  className="bg-surface rounded-3xl p-10 border-2 border-primary"
                >
                  <Text className="text-2xl text-muted text-center mb-3">Japanese Yen</Text>
                  <Text className="text-8xl font-bold text-center text-foreground">
                    ¥{jpyAmount.toLocaleString()}
                  </Text>
                  <Text className="text-lg text-muted text-center mt-4">
                    Tap to enter custom amount
                  </Text>
                </Pressable>

                {/* Quick Select Buttons */}
                <View>
                  <Text className="text-2xl font-semibold text-foreground mb-4 text-center">
                    Quick Select
                  </Text>
                  <QuickSelectButtons
                    onSelect={handleAmountSelect}
                    selectedAmount={jpyAmount}
                  />
                </View>

                {/* Last Updated */}
                {exchangeData && (
                  <View className="items-center py-4 mt-auto">
                    <Text className="text-base text-muted">
                      Last updated: {lastUpdateText}
                    </Text>
                    <Text className="text-sm text-muted mt-1">
                      Rates by Exchange Rate API
                    </Text>
                  </View>
                )}
              </View>

              {/* Right Column - Conversion Results */}
              <View className="flex-1">
                <Text className="text-2xl font-semibold text-foreground mb-4 text-center">
                  Conversion Results
                </Text>
                <CurrencyList conversions={conversions} />
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Number Pad Modal */}
        <NumberPad
          visible={showNumberPad}
          onClose={() => setShowNumberPad(false)}
          onConfirm={handleAmountSelect}
          initialAmount={jpyAmount}
        />
      </ScreenContainer>
    );
  }

  // Portrait layout (default)
  return (
    <ScreenContainer className="px-6 pt-6">
      <BackgroundWatermark />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View className="gap-6 pb-6">
          {/* Date and Time Header */}
          <View className="items-center bg-surface rounded-2xl p-4 border border-border">
            <Text className={`${isTablet ? "text-2xl" : "text-xl"} font-bold text-foreground text-center`}>
              {formatCurrentDateTime()}
            </Text>
            <Text className={`${isTablet ? "text-lg" : "text-base"} text-muted mt-1`}>
              Last Updated: {formatLastUpdateTimeDisplay()}
            </Text>
          </View>

          {/* Header */}
          <View className="items-center">
            <Text className={`${isTablet ? "text-5xl" : "text-4xl"} font-bold text-primary text-center`}>
              Today's Exchange Rates
            </Text>
            <Text className={`${isTablet ? "text-3xl" : "text-2xl"} font-semibold text-primary text-center mt-1`}>
              in Japan
            </Text>
          </View>

          {/* Amount Display */}
          <Pressable
            onPress={handleCustomAmountPress}
            style={({ pressed }) => [
              {
                transform: [{ scale: pressed ? 0.98 : 1 }],
                opacity: pressed ? 0.9 : 1,
              },
            ]}
            className="bg-surface rounded-3xl p-8 border-2 border-primary"
          >
            <Text className={`${isTablet ? "text-2xl" : "text-xl"} text-muted text-center mb-2`}>
              Japanese Yen
            </Text>
            <Text className={`${isTablet ? "text-8xl" : "text-7xl"} font-bold text-center text-foreground`}>
              ¥{jpyAmount.toLocaleString()}
            </Text>
            <Text className={`${isTablet ? "text-lg" : "text-base"} text-muted text-center mt-3`}>
              Tap to enter custom amount
            </Text>
          </Pressable>

          {/* Quick Select Buttons */}
          <View>
            <Text className={`${isTablet ? "text-2xl" : "text-lg"} font-semibold text-foreground mb-3 text-center`}>
              Quick Select
            </Text>
            <QuickSelectButtons
              onSelect={handleAmountSelect}
              selectedAmount={jpyAmount}
            />
          </View>

          {/* Conversion Results */}
          <View className="flex-1">
            <Text className={`${isTablet ? "text-2xl" : "text-lg"} font-semibold text-foreground mb-3 text-center`}>
              Conversion Results
            </Text>
            <CurrencyList conversions={conversions} />
          </View>

          {/* Last Updated */}
          {exchangeData && (
            <View className="items-center py-4">
              <Text className={`${isTablet ? "text-base" : "text-sm"} text-muted`}>
                Last updated: {lastUpdateText}
              </Text>
              <Text className={`${isTablet ? "text-sm" : "text-xs"} text-muted mt-1`}>
                Rates by Exchange Rate API
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Number Pad Modal */}
      <NumberPad
        visible={showNumberPad}
        onClose={() => setShowNumberPad(false)}
        onConfirm={handleAmountSelect}
        initialAmount={jpyAmount}
      />
    </ScreenContainer>
  );
}
