import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';

type CachedOrderRow = {
  id: string;
  userId: string;
  status: string | null;
  title: string | null;
  itemCount: number | null;
  scheduledTime: string | null;
  sortTime: number | null;
  payload: string;
};

let dbPromise: Promise<SQLiteDatabase> | null = null;

const serializeDateValue = (value: any): string | null => {
  if (!value) return null;
  const date = value?.toDate ? value.toDate() : value instanceof Date ? value : new Date(value);
  if (!date || Number.isNaN(date.getTime())) return null;
  return date.toISOString();
};

export const normalizeOrderForCache = (order: any) => {
  const normalized = {
    ...order,
    scheduledTime: serializeDateValue(order.scheduledTime) || order.scheduledTime || null,
    createdAt: serializeDateValue(order.createdAt) || order.createdAt || null,
    arrivedAt: serializeDateValue(order.arrivedAt) || order.arrivedAt || null,
    arrivalAt: serializeDateValue(order.arrivalAt) || order.arrivalAt || null,
  };

  return normalized;
};

export const getOrderSortTime = (order: any) => {
  const source = order.arrivedAt || order.createdAt || order.scheduledTime;
  const date = source?.toDate ? source.toDate() : source ? new Date(source) : null;
  return date && !Number.isNaN(date.getTime()) ? date.getTime() : 0;
};

const getOrderTitle = (order: any) => {
  return Array.isArray(order.items) && order.items[0]?.name ? order.items[0].name : 'طلب نقل';
};

const getOrderItemCount = (order: any) => {
  if (!Array.isArray(order.items)) return 1;
  return order.items.reduce((sum: number, item: any) => sum + Number(item.quantity || 1), 0);
};

const getDb = async () => {
  if (!dbPromise) {
    dbPromise = openDatabaseAsync('swiftshift-orders.db');
  }

  const db = await dbPromise;
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS orders_cache (
      id TEXT PRIMARY KEY NOT NULL,
      userId TEXT NOT NULL,
      status TEXT,
      title TEXT,
      itemCount INTEGER,
      scheduledTime TEXT,
      sortTime INTEGER,
      payload TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
  `);

  return db;
};

export const cacheOrders = async (orders: any[], userId: string) => {
  const db = await getDb();

  await db.withTransactionAsync(async () => {
    for (const rawOrder of orders) {
      const order = normalizeOrderForCache({ ...rawOrder, userId });
      await db.runAsync(
        `INSERT OR REPLACE INTO orders_cache
          (id, userId, status, title, itemCount, scheduledTime, sortTime, payload, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          String(order.id),
          userId,
          order.status || null,
          getOrderTitle(order),
          getOrderItemCount(order),
          order.scheduledTime || null,
          getOrderSortTime(order),
          JSON.stringify(order),
          new Date().toISOString(),
        ]
      );
    }
  });
};

export const getCachedOrderHistory = async (userId: string) => {
  const db = await getDb();
  const rows = await db.getAllAsync<CachedOrderRow>(
    `SELECT * FROM orders_cache
     WHERE userId = ? AND status IN ('completed', 'cancelled')
     ORDER BY sortTime DESC`,
    [userId]
  );

  return rows.map((row) => JSON.parse(row.payload));
};

export const getCachedOrderById = async (orderId: string) => {
  const db = await getDb();
  const rows = await db.getAllAsync<CachedOrderRow>(
    'SELECT * FROM orders_cache WHERE id = ? LIMIT 1',
    [orderId]
  );

  return rows[0] ? JSON.parse(rows[0].payload) : null;
};

export const updateCachedOrderStatus = async (orderId: string, status: string) => {
  const cachedOrder = await getCachedOrderById(orderId);
  if (!cachedOrder) return;

  const updatedOrder = normalizeOrderForCache({
    ...cachedOrder,
    status,
    arrivedAt: status === 'completed' ? new Date().toISOString() : cachedOrder.arrivedAt,
    arrivalNotified: status === 'completed' ? true : cachedOrder.arrivalNotified,
  });

  await cacheOrders([updatedOrder], updatedOrder.userId || 'guest');
};
