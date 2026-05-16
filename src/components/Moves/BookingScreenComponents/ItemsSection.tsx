import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Control, Controller, FieldArrayWithId } from 'react-hook-form';
import { Archive, Plus, Trash2 } from 'lucide-react-native';
import styles from './styles';
import type { BookingFormValues } from './types';

type ItemsSectionProps = {
  control: Control<BookingFormValues>;
  fields: FieldArrayWithId<BookingFormValues, 'items', 'id'>[];
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
};

export default function ItemsSection({ control, fields, onAddItem, onRemoveItem }: ItemsSectionProps) {
  return (
    <>
      <View style={styles.sectionHeader}>
        <TouchableOpacity style={styles.addButton} onPress={onAddItem}>
          <Plus color="#fff" size={20} />
        </TouchableOpacity>
        <View style={styles.rowReverse}>
          <Text style={styles.sectionTitle}>تفاصيل المنقولات</Text>
          <Archive color="#333" size={20} />
        </View>
      </View>

      {fields.map((field, index) => (
        <View key={field.id} style={styles.card}>
          <Text style={styles.inputLabel}>اسم القطعة #{index + 1}</Text>
          <Controller
            control={control}
            name={`items.${index}.name`}
            render={({ field: inputField }) => (
              <TextInput
                style={styles.input}
                placeholder="مثلا: كنب، ثلاجة..."
                textAlign="right"
                value={inputField.value}
                onChangeText={inputField.onChange}
              />
            )}
          />

          <View style={styles.row}>
            <View style={styles.flex1}>
              <Text style={styles.inputLabel}>الكمية</Text>
              <Controller
                control={control}
                name={`items.${index}.quantity`}
                render={({ field: inputField }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="1"
                    textAlign="center"
                    keyboardType="numeric"
                    value={inputField.value}
                    onChangeText={inputField.onChange}
                  />
                )}
              />
            </View>
            <View style={styles.itemGap} />
            <View style={styles.flex1}>
              <Text style={styles.inputLabel}>الوزن (كجم)</Text>
              <Controller
                control={control}
                name={`items.${index}.weight`}
                render={({ field: inputField }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="50"
                    textAlign="center"
                    keyboardType="numeric"
                    value={inputField.value}
                    onChangeText={inputField.onChange}
                  />
                )}
              />
            </View>
          </View>

          <View style={styles.row}>
            {(['length', 'width', 'height'] as const).map((name) => (
              <Controller
                key={name}
                control={control}
                name={`items.${index}.${name}`}
                render={({ field: inputField }) => (
                  <TextInput
                    style={[styles.input, styles.flex1, name === 'width' && styles.widthInput]}
                    placeholder={name === 'length' ? 'طول' : name === 'width' ? 'عرض' : 'ارتفاع'}
                    textAlign="center"
                    keyboardType="numeric"
                    value={inputField.value}
                    onChangeText={inputField.onChange}
                  />
                )}
              />
            ))}
            <TouchableOpacity style={styles.deleteBtn} onPress={() => onRemoveItem(index)}>
              <Trash2 color="#FF5252" size={20} />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </>
  );
}
