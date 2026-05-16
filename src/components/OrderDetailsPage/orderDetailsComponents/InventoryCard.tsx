import React from 'react';
import { Text, View } from 'react-native';
import { itemIcon } from './helpers';
import styles from './styles';

type InventoryCardProps = {
  items: any[];
};

export default function InventoryCard({ items }: InventoryCardProps) {
  const itemCount = items.reduce((sum: number, item: any) => sum + Number(item.quantity || 1), 0);

  return (
    <View style={styles.inventoryCard}>
      <View style={styles.cardTitleRow}>
        <Text style={styles.cardTitle}>قائمة المنقولات</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{itemCount} قطع</Text>
        </View>
      </View>

      {items.map((item: any, index: number) => {
        const Icon = itemIcon(item.name);
        return (
          <View key={item.id || `${item.name}-${index}`} style={styles.itemRow}>
            <View style={styles.itemLeft}>
              <View style={styles.itemIconBox}>
                <Icon color="#9ca3af" size={24} />
              </View>
              <Text style={styles.itemName}>{item.name || `عنصر ${index + 1}`}</Text>
            </View>
            <Text style={styles.itemQuantity}>× {item.quantity || 1}</Text>
          </View>
        );
      })}
    </View>
  );
}
