import React from 'react';
import { Image, View } from 'react-native';
import styles from './styles';

const HERO_IMAGE_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA1z0uO3W9XEsetSJVkibwSIz7lOeeotTljFRb5imAcpv7kYlShRR8xJO5nscPuyeLyquFQbdijBgHCVX4g91S8Pu1Nugr230pDdCgxvpTPRoagojitX7OvG1_VFHiolDJU7RLTxoXfVHAbqH-qB8NbnY00Eu5Oj_v50B8f-ZIy2p3mHVqPmPPvMSEcZttf2gikrhxb84u7Aypq_y4Xim-CmzXKOpAG6bRi_xR1RJ41Eo9V33Esl_b15HKXhA8KZ4sgq6mk43pJKUZw';

export default function HeroSection() {
  return (
    <View style={styles.heroContainer}>
      <Image source={{ uri: HERO_IMAGE_URI }} style={styles.heroImage} />
      <View style={styles.heroGradient} />
    </View>
  );
}
