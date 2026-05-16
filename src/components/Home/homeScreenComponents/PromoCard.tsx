import React from 'react';
import { ImageBackground, Text, View } from 'react-native';
import { CheckCircle2 } from 'lucide-react-native';
import styles from './styles';

const PROMO_IMAGE_URI = 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6';

export default function PromoCard() {
  return (
    <View style={styles.promoCard}>
      <ImageBackground
        source={{ uri: PROMO_IMAGE_URI }}
        style={styles.backgroundImage}
        imageStyle={styles.promoBackgroundImage}
      >
        <View style={styles.promoOverlay}>
          <Text style={styles.promoTitle}>انتقال سلس، لمنزل جديد</Text>
          <Text style={styles.promoDesc}>
            نحن نهتم بكل تفاصيل انتقالك، من التعبئة إلى النقل بكل احترافية وأمان.
          </Text>
          <View style={styles.badge}>
            <CheckCircle2 color="#fff" size={16} />
            <Text style={styles.badgeText}>خدمة موثوقة بنسبة 100%</Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}
