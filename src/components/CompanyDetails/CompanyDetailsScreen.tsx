import React from 'react';
import { ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '@/src/components/AppHeader';
import {
  CompanyInfoCard,
  ComplianceCard,
  ContactCard,
  FleetServicesSection,
  HeroSection,
  styles,
} from './CompanyDetailsComponents';

const CompanyDetailsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <AppHeader />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <HeroSection />
        <CompanyInfoCard />
        <FleetServicesSection />
        <ComplianceCard />
        <ContactCard />
      </ScrollView>
    </SafeAreaView>
  );
};

export default CompanyDetailsScreen;
