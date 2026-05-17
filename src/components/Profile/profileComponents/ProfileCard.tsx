import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image as RNImage,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Camera, Image as ImageIcon, Mail, Pencil, User, X } from 'lucide-react-native';
import styles from './styles';

type ProfileCardProps = {
  name: string;
  email: string;
  photoUri: string | null;
  savingImage: boolean;
  savingName: boolean;
  onPickImage: () => void;
  onTakePhoto: () => void;
  onSaveName: (name: string) => Promise<void>;
};

export default function ProfileCard({
  name,
  email,
  photoUri,
  savingImage,
  savingName,
  onPickImage,
  onTakePhoto,
  onSaveName,
}: ProfileCardProps) {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [editNameVisible, setEditNameVisible] = useState(false);
  const [draftName, setDraftName] = useState(name);

  const openNameEditor = () => {
    setDraftName(name);
    setEditNameVisible(true);
  };

  const handleSaveName = async () => {
    if (!draftName.trim()) return;
    await onSaveName(draftName);
    setEditNameVisible(false);
  };

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

        <TouchableOpacity style={styles.nameButton} onPress={openNameEditor} activeOpacity={0.75}>
          <Pencil color="#145300" size={16} />
          <Text style={styles.name}>{name}</Text>
        </TouchableOpacity>

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

      <Modal visible={editNameVisible} transparent animationType="fade" onRequestClose={() => setEditNameVisible(false)}>
        <View style={styles.editNameOverlay}>
          <View style={styles.editNameCard}>
            <Text style={styles.editNameTitle}>تعديل اسم المستخدم</Text>
            <TextInput
              style={styles.editNameInput}
              value={draftName}
              onChangeText={setDraftName}
              placeholder="اسم المستخدم"
              textAlign="right"
              autoFocus
            />
            <View style={styles.editNameActions}>
              <TouchableOpacity
                style={[styles.editNameButton, styles.cancelNameButton]}
                onPress={() => setEditNameVisible(false)}
                disabled={savingName}
              >
                <Text style={styles.cancelNameText}>إلغاء</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.editNameButton, styles.saveNameButton]}
                onPress={handleSaveName}
                disabled={savingName || !draftName.trim()}
              >
                {savingName ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.saveNameText}>حفظ</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
