import React from 'react';
import { ScrollView } from 'react-native';
import OrderListCard from './OrderListCard';
import styles from './styles';
import type { OrderListItem } from './types';

type OrdersListProps = {
  orders: OrderListItem[];
  onOrderPress: (order: OrderListItem) => void;
};

export default function OrdersList({ orders, onOrderPress }: OrdersListProps) {
  return (
    <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
      {orders.map((order) => (
        <OrderListCard key={order.id} order={order} onPress={() => onOrderPress(order)} />
      ))}
    </ScrollView>
  );
}
