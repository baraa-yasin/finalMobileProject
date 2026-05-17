import React from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '@/src/components/AppHeader';
import MovesBottomNavigation from '@/src/components/MovesBottomNavigation';
import { BookingCard, CompanyDetailsButton, PromoCard, styles } from './homeScreenComponents';

type HomeScreenProps = {
  onNavigate: (path: string) => void;
};

const HomeScreen = ({ onNavigate }: HomeScreenProps) => {
  return (
    <SafeAreaView style={styles.container}>
      <AppHeader />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <PromoCard />
        <BookingCard onNavigate={onNavigate} />
        <CompanyDetailsButton onNavigate={onNavigate} />
      </ScrollView>

      <MovesBottomNavigation />
    </SafeAreaView>
  );
};

export default HomeScreen;
