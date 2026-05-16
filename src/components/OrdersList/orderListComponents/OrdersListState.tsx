import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { ReceiptText } from 'lucide-react-native';
import styles from './styles';

type OrdersListStateProps = {
  type: 'loading' | 'empty';
};

export default function OrdersListState({ type }: OrdersListStateProps) {
  return (
    <View style={styles.centerState}>
      {type === 'loading' ? (
        <ActivityIndicator size="large" color="#145300" />
      ) : (
        <>
          <View style={styles.emptyIcon}>
            <ReceiptText color="#9ca3af" size={30} />
          </View>
          <Text style={styles.emptyTitle}>لا توجد طلبات سابقة</Text>
          <Text style={styles.emptyText}>الطلبات المكتملة أو الملغاة ستظهر هنا بشكل مختصر.</Text>
        </>
      )}
    </View>
  );
}
