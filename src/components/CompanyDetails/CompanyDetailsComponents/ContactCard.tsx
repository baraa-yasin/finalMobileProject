import React from 'react';
import { Linking, Text, TouchableOpacity, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Mail, MapPin } from 'lucide-react-native';
import styles from './styles';

const SUPPORT_EMAIL = 'swiftshift@gmail.com';
const FACEBOOK_URL = 'https://www.facebook.com/profile.php?id=61589707718313';
const INSTAGRAM_URL = 'https://www.instagram.com/swiftshift114/';

export default function ContactCard() {
  const handleSupportPress = () => {
    Linking.openURL(`mailto:${SUPPORT_EMAIL}`);
  };

  return (
    <View style={styles.contactCard}>
      <Text style={styles.sectionTitle}>تواصل معنا</Text>

      <View style={styles.contactItem}>
        <View style={styles.contactIcon}>
          <MapPin color="#15803d" size={20} />
        </View>
        <View style={styles.contactText}>
          <Text style={styles.contactLabel}>العنوان الرئيسي</Text>
          <Text style={styles.contactValue}>نابلس ، جامعة النجاح الوطنية</Text>
        </View>
      </View>

      <View style={styles.socialRow}>
        <TouchableOpacity style={styles.socialButton} onPress={() => Linking.openURL(FACEBOOK_URL)}>
          <FontAwesome name="facebook" color="#15803d" size={20} />
          <Text style={styles.socialText}>SwiftShift</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton} onPress={() => Linking.openURL(INSTAGRAM_URL)}>
          <FontAwesome name="instagram" color="#15803d" size={20} />
          <Text style={styles.socialText}>SwiftShift</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.socialRow}>
        <TouchableOpacity style={styles.socialButton} onPress={handleSupportPress}>
          <Mail color="#15803d" size={20} />
          <Text style={styles.socialText}>{SUPPORT_EMAIL}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
