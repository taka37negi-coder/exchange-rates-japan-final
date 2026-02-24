# Today's Exchange Rates in Japan - Design Document

## Overview
A currency exchange rate app designed for foreign tourists in Japan, optimized for iPad displays (both portrait and landscape). The app should be placed at store counters or entrances, providing clear, large, and easy-to-read exchange rate information.

## Target Device
- **Primary**: iPad (both orientations supported)
- **Display**: Large screen optimized for visibility from a distance
- **Usage Context**: Store-front kiosk, counter display

## Design Philosophy
- **Modern & Clean**: Professional appearance suitable for retail environments
- **High Visibility**: Extra-large fonts for readability from distance
- **Intuitive**: Minimal learning curve for international tourists
- **Trust**: Navy or gold accent colors to convey reliability

## Screen List

### 1. Home Screen (Main Exchange Rate Display)
**Primary Content:**
- Current JPY amount input (large, prominent)
- Real-time exchange rates for 8 currencies
- Last update timestamp
- Quick amount selection buttons

**Functionality:**
- Display real-time conversion rates from JPY to 8 currencies
- Allow quick selection of common amounts
- Allow custom amount input via number pad
- Auto-refresh rates periodically

## Key User Flows

### Flow 1: Quick Amount Selection
1. User opens app → sees default 10,000 JPY conversion
2. User taps "20,000円" button
3. App immediately shows conversion for all 8 currencies
4. User reads desired currency amount

### Flow 2: Custom Amount Input
1. User opens app → sees default 10,000 JPY conversion
2. User taps on amount input area
3. Number pad appears
4. User enters custom amount (e.g., 15,500)
5. App shows real-time conversion for all 8 currencies
6. User dismisses number pad or taps outside

### Flow 3: Viewing Updated Rates
1. App automatically fetches latest rates every 30 minutes
2. "Last updated" timestamp shows when rates were fetched
3. User can manually refresh if needed (pull-to-refresh gesture)

## Layout Structure

### Portrait Mode (9:16)
```
┌─────────────────────────┐
│   Today's Exchange      │
│   Rates in Japan        │
├─────────────────────────┤
│                         │
│   [Input Amount]        │
│   ¥ 10,000             │
│                         │
│   [Quick Select]        │
│   [10K] [20K] [30K]    │
│                         │
├─────────────────────────┤
│   Conversion Results    │
│                         │
│   🇺🇸 USD  $XX.XX       │
│   🇪🇺 EUR  €XX.XX       │
│   🇰🇷 KRW  ₩XX,XXX      │
│   🇨🇳 CNY  ¥XX.XX       │
│   🇹🇼 TWD  NT$XX.XX     │
│   🇬🇧 GBP  £XX.XX       │
│   🇦🇺 AUD  A$XX.XX      │
│   🇲🇾 MYR  RMXX.XX      │
│                         │
│   Last updated: XX:XX   │
└─────────────────────────┘
```

### Landscape Mode (16:9)
```
┌───────────────────────────────────────────┐
│  Today's Exchange Rates in Japan          │
├──────────────────┬────────────────────────┤
│                  │                        │
│  [Input Amount]  │   Conversion Results   │
│  ¥ 10,000       │                        │
│                  │   🇺🇸 USD  $XX.XX      │
│  [Quick Select]  │   🇪🇺 EUR  €XX.XX      │
│  [10K] [20K]    │   🇰🇷 KRW  ₩XX,XXX     │
│  [30K] [50K]    │   🇨🇳 CNY  ¥XX.XX      │
│                  │   🇹🇼 TWD  NT$XX.XX    │
│  [Custom Input]  │   🇬🇧 GBP  £XX.XX      │
│                  │   🇦🇺 AUD  A$XX.XX     │
│                  │   🇲🇾 MYR  RMXX.XX     │
│                  │                        │
│                  │   Last updated: XX:XX  │
└──────────────────┴────────────────────────┘
```

## Color Scheme

### Primary Colors
- **Background**: Clean white (#FFFFFF)
- **Primary Accent**: Navy Blue (#1E3A8A) - conveys trust and professionalism
- **Secondary Accent**: Gold (#F59E0B) - for highlights and important elements
- **Text Primary**: Dark Gray (#1F2937)
- **Text Secondary**: Medium Gray (#6B7280)

### Usage
- Navy blue for headers, buttons, and primary actions
- Gold for selected states and emphasis
- White background for maximum readability
- High contrast for accessibility

## Typography

### Font Sizes (optimized for iPad)
- **App Title**: 32-40px (bold)
- **Input Amount**: 56-72px (extra bold)
- **Currency Code**: 24-28px (bold)
- **Converted Amount**: 36-48px (semi-bold)
- **Quick Select Buttons**: 20-24px (medium)
- **Last Updated**: 14-16px (regular)

### Font Family
- System default (SF Pro on iOS) for optimal performance and native feel

## Components

### 1. Amount Input Display
- Large, centered display of current JPY amount
- Tap to activate custom input
- Clear visual feedback when active

### 2. Quick Select Buttons
- Large, touch-friendly buttons (minimum 60x60 points)
- Common amounts: 10,000円, 20,000円, 30,000円, 50,000円
- Clear active state with navy background and white text

### 3. Currency Conversion List
- Each row shows:
  - Country flag emoji
  - Currency code (USD, EUR, etc.)
  - Converted amount with proper formatting
- Large font size for readability
- Subtle dividers between rows

### 4. Number Pad (Custom Input)
- Large buttons (minimum 70x70 points)
- Numbers 0-9, decimal point, clear, and confirm
- Modal overlay with semi-transparent background
- Dismiss by tapping outside or confirm button

### 5. Last Updated Indicator
- Small text at bottom
- Shows time since last rate fetch
- Subtle color to not distract from main content

## Target Currencies
1. **USD** - United States Dollar
2. **EUR** - Euro
3. **KRW** - South Korean Won
4. **CNY** - Chinese Yuan
5. **TWD** - Taiwan Dollar
6. **GBP** - British Pound
7. **AUD** - Australian Dollar
8. **MYR** - Malaysian Ringgit

## Technical Considerations

### API Integration
- Use ExchangeRate-API or similar reliable service
- Fetch rates on app launch
- Auto-refresh every 30 minutes
- Cache rates locally for offline viewing
- Show last update timestamp

### Performance
- Instant calculation and display (no loading spinners for conversion)
- Smooth animations for amount changes
- Optimize for iPad screen sizes

### Accessibility
- High contrast ratios for all text
- Large touch targets (minimum 44x44 points)
- Support for dynamic type (if user has accessibility settings)
- VoiceOver support for screen readers

## Language
- **Primary Language**: English
- All UI text in English
- Currency symbols and codes are international standards
- Amount formatting follows locale conventions (e.g., comma separators)
