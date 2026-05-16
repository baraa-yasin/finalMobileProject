import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ArrowLeft, Building2 } from 'lucide-react-native';
import styles from './styles';

type CompanyDetailsButtonProps = {
  onNavigate: (path: string) => void;
};

export default function CompanyDetailsButton({ onNavigate }: CompanyDetailsButtonProps) {
  return (
    <TouchableOpacity
      style={styles.companyDetailsButton}
      onPress={() => onNavigate('/company-details')}
      activeOpacity={0.9}
    >
      <ArrowLeft color="#1f3f1a" size={20} />
      <View style={styles.companyDetailsTextWrap}>
        <Text style={styles.companyDetailsButtonText}>تفاصيل الشركة</Text>
        <Text style={styles.companyDetailsSubText}>تعرف اكثر عن سويفت شيفت لخدمات اللوجستية</Text>
      </View>
      <View style={styles.companyDetailsIconBox}>
        <Building2 color="#1f3f1a" size={20} />
      </View>
    </TouchableOpacity>
  );
}
