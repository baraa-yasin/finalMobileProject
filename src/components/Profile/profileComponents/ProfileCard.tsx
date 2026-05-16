import React, { useState } from 'react';
import { ActivityIndicator, Image as RNImage, Modal, Text, TouchableOpacity, View } from 'react-native';
import { Camera, Image as ImageIcon, Mail, X, User } from 'lucide-react-native';
import styles from './styles';

type ProfileCardProps = {
  name: string;
  email: string;
  photoUri: string | null;
  savingImage: boolean;
  onPickImage: () => void;
  onTakePhoto: () => void;
};

export default function ProfileCard({
  name,
  email,
  photoUri,
  savingImage,
  onPickImage,
  onTakePhoto,
}: ProfileCardProps) {
  const [previewVisible, setPreviewVisible] = useState(false);

  return (
    <View style={styles.content}>
      <View style={styles.profileCard}>
        <View style={styles.avatarWrap}>
          <TouchableOpacity
            activeOpacity={photoUri ? 0.86 : 1}
            onPress={() => {
              if (photoUri) setPreviewVisible(true);
            }}
          >
            {photoUri ? (
              <RNImage source={{ uri: photoUri }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarFallback}>
                <User color="#0b3a00" size={46} />
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.cameraButton} onPress={onTakePhoto} disabled={savingImage}>
            {savingImage ? <ActivityIndicator size="small" color="#fff" /> : <Camera color="#fff" size={20} />}
          </TouchableOpacity>

          <TouchableOpacity style={styles.galleryButton} onPress={onPickImage} disabled={savingImage}>
            <ImageIcon color="#145300" size={20} />
          </TouchableOpacity>
        </View>

        <Text style={styles.name}>{name}</Text>

        <View style={styles.infoRow}>
          <Mail color="#145300" size={18} />
          <Text style={styles.infoText}>{email || 'لا يوجد بريد إلكتروني'}</Text>
        </View>
      </View>

      <Modal visible={previewVisible} transparent animationType="fade" onRequestClose={() => setPreviewVisible(false)}>
        <View style={styles.previewOverlay}>
          <TouchableOpacity style={styles.previewCloseButton} onPress={() => setPreviewVisible(false)}>
            <X color="#fff" size={24} />
          </TouchableOpacity>
          {photoUri ? <RNImage source={{ uri: photoUri }} style={styles.previewImage} resizeMode="contain" /> : null}
        </View>
      </Modal>
    </View>
  );
}
