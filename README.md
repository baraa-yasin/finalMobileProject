# 🚚 SwiftShift – تطبيق نقل أثاث

تطبيق موبايل مبني بـ **React Native + Expo** لخدمات نقل الأثاث.

---

## 📁 هيكلية المشروع (File Structure)

```
finalMobileProject/
├── app/                          # صفحات التطبيق (Expo Router)
│   ├── _layout.tsx               # الـ Layout الرئيسي - بلف كل الشاشات بالـ Providers
│   ├── index.tsx                 # الصفحة الرئيسية
│   ├── login.tsx                 # صفحة تسجيل الدخول
│   ├── register.tsx              # صفحة إنشاء حساب
│   ├── booking.tsx               # صفحة حجز نقلة
│   ├── tracking.tsx              # صفحة تتبع الشحنة
│   ├── order-details.tsx         # صفحة تفاصيل الطلب
│   ├── order-history.tsx         # صفحة سجل الطلبات
│   ├── profile.tsx               # صفحة الملف الشخصي
│   ├── company-details.tsx       # صفحة تفاصيل الشركة
│   └── (tabs)/                   # التابات السفلية
│       ├── _layout.tsx
│       ├── index.tsx
│       ├── moves.tsx
│       └── notifications.tsx
│
├── src/
│   ├── api/
│   │   └── firebaseConfig.tsx    # إعدادات Firebase + Auth Persistence بالـ AsyncStorage
│   │
│   ├── components/               # كل الكومبوننتات مقسمة حسب الصفحة
│   │   ├── AppHeader.tsx
│   │   ├── MovesBottomNavigation.tsx
│   │   ├── MovesMenuDrawer.tsx
│   │   ├── Auth/                 # شاشات تسجيل الدخول والتسجيل
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── RegisterScreen.tsx
│   │   │   ├── loginComponents/  # (LoginForm, LoginHeader, LoginFooter, styles, types)
│   │   │   └── registerComponents/ # (RegisterForm, RegisterHeader, RegisterFooter, styles, types)
│   │   ├── Home/
│   │   │   ├── HomeScreen.tsx
│   │   │   └── homeScreenComponents/ # (PromoCard, BookingCard, CompanyDetailsButton, styles)
│   │   ├── Moves/
│   │   │   ├── BookingScreen.tsx
│   │   │   └── BookingScreenComponents/ # (ItemsSection, LocationSection, DriversSection, etc.)
│   │   ├── Profile/
│   │   │   ├── ProfileScreen.tsx
│   │   │   └── profileComponents/
│   │   ├── ShipmentTrackingPage/
│   │   │   ├── ShipmentTracking.tsx
│   │   │   └── shipmentTrackingComponents/
│   │   ├── OrderDetailsPage/
│   │   │   ├── OrderDetails.tsx
│   │   │   └── orderDetailsComponents/
│   │   ├── OrdersList/
│   │   │   ├── OrdersListScreen.tsx
│   │   │   └── orderListComponents/
│   │   ├── Notifications/
│   │   │   ├── NotificationsScreen.tsx
│   │   │   └── notificationsComponents/
│   │   ├── CompanyDetails/
│   │   │   ├── CompanyDetailsScreen.tsx
│   │   │   └── CompanyDetailsComponents/
│   │   └── MyReservePage/
│   │       ├── MyReservePage.tsx
│   │       └── myReserveComponents/
│   │
│   ├── context/
│   │   └── AuthContext.tsx       # Context API للـ Authentication
│   │
│   ├── hooks/                    # Custom Hooks
│   │   ├── useAuthActions.ts
│   │   ├── useCreateOrder.ts
│   │   └── useDrivers.ts
│   │
│   ├── lib/
│   │   ├── apiClient.ts          # Axios instance
│   │   ├── errorHandler.ts       # معالجة الأخطاء
│   │   └── queryClient.ts        # إعدادات React Query
│   │
│   ├── providers/
│   │   └── AppProviders.tsx      # بلف QueryClientProvider + AuthProvider
│   │
│   ├── services/                 # طبقة التعامل مع الـ API/Firebase
│   │   ├── authService.ts
│   │   ├── orderService.ts
│   │   └── driverService.ts
│   │
│   ├── storage/
│   │   └── ordersCache.ts        # SQLite للتخزين المحلي (أوفلاين)
│   │
│   ├── constants/
│   │   └── Theme.ts              # ألوان الثيم
│   │
│   └── utils/
│       ├── orderArrival.ts       # لوجيك وصول الطلب
│       └── timeRemaining.ts      # حساب الوقت المتبقي
```

---

## 📋 المتطلبات المستخدمة بالمشروع

---

### 1. 📝 React Hook Form

**شو هي؟** مكتبة لإدارة الفورمات بـ React بشكل خفيف وسريع من غير ما تعيد رندر كل شي.

**وين مستخدمة؟**

| الملف | الاستخدام |
|-------|-----------|
| `src/components/Auth/LoginScreen.tsx` | فورم تسجيل الدخول – `useForm<LoginFormValues>` مع `control` و `handleSubmit` و `errors` عشان ندير حقول الإيميل والباسورد |
| `src/components/Auth/RegisterScreen.tsx` | فورم التسجيل – `useForm<RegisterFormValues>` لحقول الاسم والإيميل والباسورد |
| `src/components/Auth/loginComponents/LoginForm.tsx` | الكومبوننت الفرعي اللي بستقبل `control` و `errors` من react-hook-form وبرسم الحقول |
| `src/components/Auth/registerComponents/RegisterForm.tsx` | نفس الفكرة بس لفورم التسجيل |
| `src/components/Moves/BookingScreen.tsx` | فورم الحجز – `useForm<BookingFormValues>` مع `useFieldArray` عشان ندير قائمة المنقولات ديناميكياً (إضافة/حذف قطع) |

**فائدتها:** بتخلي الفورم أسرع لأنها ما بتعمل re-render لكل الكومبوننت لما تتغير قيمة حقل واحد، وبتدير الـ validation بشكل مرتب.

---

### 2. 🔄 TanStack React Query

**شو هي؟** مكتبة لإدارة الداتا اللي بتيجي من السيرفر – بتعمل caching وretry وinvalidation تلقائي.

**وين مستخدمة؟**

| الملف | الاستخدام |
|-------|-----------|
| `src/lib/queryClient.ts` | هون بنعمل instance من `QueryClient` ونحدد الإعدادات الافتراضية مثل `staleTime` و `retry` |
| `src/providers/AppProviders.tsx` | بنلف التطبيق كله بـ `QueryClientProvider` عشان كل الكومبوننتات تقدر تستخدم React Query |
| `src/hooks/useAuthActions.ts` | `useMutation` لعمليات تسجيل الدخول والتسجيل – بتدير حالة الـ loading والـ error تلقائي |
| `src/hooks/useCreateOrder.ts` | `useMutation` لإنشاء طلب جديد – لما ينجح بتعمل `invalidateQueries` لقوائم الطلبات والإشعارات عشان تتحدث |
| `src/hooks/useDrivers.ts` | `useQuery` لجلب السائقين النشيطين – بتعمل cache للنتيجة وما بتطلب من السيرفر كل مرة |

**فائدتها:** بتوفر عليك تكتب `useState` و `useEffect` لكل طلب API، وبتتعامل مع الـ loading والـ error والـ caching تلقائي.

---

### 3. 📱 Device Features (الكاميرا + الموقع + Image Picker)

**شو هي؟** استخدام ميزات الجهاز الأصلية زي الكاميرا والموقع.

**وين مستخدمة؟**

| الملف | الفيتشر | الاستخدام |
|-------|---------|-----------|
| `src/components/Profile/ProfileScreen.tsx` | **الكاميرا 📷** | دالة `takePhoto` بتستخدم `expo-image-picker` → `launchCameraAsync` عشان المستخدم يصور صورة بروفايل من الكاميرا مباشرة |
| `src/components/Profile/ProfileScreen.tsx` | **معرض الصور 🖼️** | دالة `pickImage` بتستخدم `launchImageLibraryAsync` عشان يختار صورة من المعرض |
| `src/components/Moves/BookingScreen.tsx` | **الموقع 📍** | دالة `openMap` بتستخدم `expo-location` → `requestForegroundPermissionsAsync` عشان تاخذ إذن الموقع، و `reverseGeocodeAsync` لتحويل الإحداثيات لعنوان |

**فائدتها:** بتخلي التطبيق يتفاعل مع هاردوير الجهاز مباشرة – المستخدم يقدر يصور صورة أو يحدد موقعه على الخريطة.

---

### 4. 🎨 UI/UX

**شو هي؟** تصميم واجهة المستخدم وتجربة المستخدم.

**وين مستخدمة؟**

| الملف | الاستخدام |
|-------|-----------|
| `src/components/AppHeader.tsx` | الهيدر الموحد لكل الصفحات فيه لوغو + زر قائمة + زر إشعارات |
| `src/components/MovesBottomNavigation.tsx` | نافبار سفلي مع أيقونات وتأثير active dot |
| `src/components/MovesMenuDrawer.tsx` | درج جانبي (Side Drawer) بموديل شفاف |
| `src/constants/Theme.ts` | ألوان الثيم الأساسية موحدة بمكان واحد |
| كل مجلد `styles.ts` | ستايلات منفصلة بملفات خاصة بكل كومبوننت عشان يكون الكود نظيف |

**فائدتها:** تجربة مستخدم سلسة ومتناسقة بكل الشاشات مع ثيم موحد.

---

### 5. 💾 SQLite (صفحة أوفلاين)

**شو هي؟** قاعدة بيانات محلية على الجهاز بتشتغل بدون إنترنت.

**وين مستخدمة؟**

| الملف | الاستخدام |
|-------|-----------|
| `src/storage/ordersCache.ts` | الملف الأساسي – بيعمل جدول `orders_cache` بالـ SQLite، وفيه: `cacheOrders` (تخزين)، `getCachedOrderHistory` (جلب السجل)، `getCachedOrderById` (جلب طلب)، `updateCachedOrderStatus` (تحديث حالة) |
| `src/services/orderService.ts` | بعد ما ينحفظ الطلب على Firebase، بنادي `cacheOrders` عشان ننسخه محلياً |
| `src/components/OrdersList/OrdersListScreen.tsx` | **الصفحة اللي بتشتغل أوفلاين** – أول شي بتجيب الطلبات من SQLite وبتعرضها، وبعدين بتحاول تجيب من Firebase. إذا ما في إنترنت بتضل الداتا المحلية موجودة |
| `src/components/OrderDetailsPage/OrderDetails.tsx` | إذا فشل جلب الطلب من Firebase بيروح يجيبه من الكاش المحلي بـ `getCachedOrderById` |
| `src/utils/orderArrival.ts` | بنادي `updateCachedOrderStatus` لما الطلب يوصل عشان نحدث الحالة محلياً |

**فائدتها:** المستخدم يقدر يشوف طلباته حتى لو ما في إنترنت – الداتا متخزنة محلياً.

---

### 6. 🧪 Test Case

**ملاحظة:** حالياً ما في ملفات تيست بالمشروع. لازم تضيف على الأقل تيست لكومبوننت واحد (مثلاً `LoginScreen` أو `AppHeader`).

---

### 7. 🌐 Axios

**شو هي؟** مكتبة HTTP client لإرسال طلبات للسيرفر.

**وين مستخدمة؟**

| الملف | الاستخدام |
|-------|-----------|
| `src/lib/apiClient.ts` | هون بننشئ Axios instance بـ `baseURL` و `timeout: 15000` وهيدرز افتراضية، مع response interceptor لمعالجة الأخطاء |
| `src/lib/errorHandler.ts` | دالة `getErrorMessage` بتستخدم `isAxiosError` من Axios عشان تعرف إذا الخطأ جاي من طلب HTTP وتستخرج الرسالة المناسبة |

**فائدتها:** بتنظم كل طلبات الـ API بمكان واحد مع إعدادات موحدة وinterceptors.

---

### 8. 🪝 Custom Hooks

**شو هي؟** هوكات مخصصة بنعملها إحنا عشان نعيد استخدام لوجيك معين بأكثر من مكان.

**وين مستخدمة؟**

| الملف | الاستخدام |
|-------|-----------|
| `src/hooks/useAuthActions.ts` | فيه `useLogin` و `useRegister` – كل واحد بيستخدم `useMutation` من React Query عشان يدير عملية المصادقة |
| `src/hooks/useCreateOrder.ts` | `useCreateOrder` – بيدير إنشاء طلب جديد مع invalidation للكاش بعد النجاح |
| `src/hooks/useDrivers.ts` | `useDrivers` – بيجلب السائقين النشيطين بـ `useQuery` مع caching |
| `src/context/AuthContext.tsx` | `useAuthContext` – هوك مخصص يجيب بيانات المستخدم من الـ Context |

**فائدتها:** بتفصل اللوجيك عن الـ UI، وبتخلي الكود قابل لإعادة الاستخدام – أي شاشة بدها بيانات السائقين بتنادي `useDrivers()` وخلص.

---

### 9. 🧠 Context API

**شو هي؟** طريقة React الأصلية لمشاركة بيانات بين كومبوننتات بدون prop drilling.

**وين مستخدمة؟**

| الملف | الاستخدام |
|-------|-----------|
| `src/context/AuthContext.tsx` | `AuthContext` بيحمل: بيانات المستخدم `user`، حالة التحميل `initializing`، ودالة `logout`. بيسمع على `onAuthStateChanged` من Firebase وبيحدث الحالة تلقائي |
| `src/providers/AppProviders.tsx` | بيلف التطبيق كله بـ `AuthProvider` عشان كل شاشة تقدر تستخدم `useAuthContext()` |

**فائدتها:** أي كومبوننت بالتطبيق يقدر يعرف مين المستخدم الحالي وإذا مسجل دخول أو لأ، بدون ما نمرر props من فوق لتحت.

---

### 10. 📦 Async Storage

**شو هي؟** تخزين key-value بسيط على الجهاز (زي localStorage بالويب).

**وين مستخدمة؟**

| الملف | الاستخدام |
|-------|-----------|
| `src/api/firebaseConfig.tsx` | `getReactNativePersistence(AsyncStorage)` – بتخلي Firebase Auth يحفظ جلسة المستخدم محلياً، فلما يفتح التطبيق مرة ثانية يكون لسا مسجل دخول |
| `src/context/AuthContext.tsx` | `AsyncStorage.setItem('auth:lastUserId', ...)` لحفظ آخر user ID، و `removeItem` عند تسجيل الخروج |
| `src/components/Profile/ProfileScreen.tsx` | `AsyncStorage.setItem(getPhotoStorageKey(...), uri)` لحفظ صورة البروفايل محلياً، و `getItem` لاسترجاعها بسرعة |

**فائدتها:** بتحفظ بيانات بسيطة محلياً (جلسة، صورة بروفايل) بشكل سريع بدون قاعدة بيانات.

---

### 11. ⚠️ Error Handling

**شو هي؟** معالجة الأخطاء بطريقة مركزية ومنظمة.

**وين مستخدمة؟**

| الملف | الاستخدام |
|-------|-----------|
| `src/lib/errorHandler.ts` | دالة `getErrorMessage` – بتفحص نوع الخطأ: إذا Axios error بتاخذ الرسالة من `response.data.message`، إذا Error عادي بتاخذ `message`، إذا string بترجعه زي ما هو، وإذا أي شي ثاني بترجع رسالة افتراضية |
| `src/components/Auth/LoginScreen.tsx` | `catch (error) { Alert.alert('خطأ', getErrorMessage(error, '...')) }` |
| `src/components/Auth/RegisterScreen.tsx` | نفس النمط – `getErrorMessage(error)` بالـ catch |
| `src/components/Moves/BookingScreen.tsx` | بالـ `handleCreateOrder` و `handleMapConfirm` – كل عملية ممكن تفشل ملفوفة بـ try/catch |
| `src/components/Profile/ProfileScreen.tsx` | `pickImage` و `takePhoto` – بتعالج أخطاء الكاميرا والمعرض |
| `src/components/OrdersList/OrdersListScreen.tsx` | إذا فشل جلب الطلبات من Firebase بيرجع على الكاش المحلي (fallback) |
| `src/components/OrderDetailsPage/OrderDetails.tsx` | نفس الفكرة – fallback على SQLite cache |
| `src/utils/orderArrival.ts` | `.catch((error) => console.error(...))` للأخطاء اللي بتصير بالخلفية |

**فائدتها:** المستخدم دايماً يشوف رسالة خطأ مفهومة، والتطبيق ما بيكرش – بيتعامل مع الخطأ بلطف.

---

### 12. ⚡ useCallback / useMemo / useRef

**شو هن؟** React hooks للتحسين (optimization) – بيمنعوا إعادة إنشاء دوال/قيم بدون داعي.

#### useCallback
بتحفظ الدالة وما بتعيد إنشاءها إلا إذا تغيرت الـ dependencies:

| الملف | الاستخدام |
|-------|-----------|
| `src/context/AuthContext.tsx` | `logout = useCallback(async () => {...}, [])` – دالة تسجيل الخروج ثابتة |
| `src/components/Auth/LoginScreen.tsx` | `handleLogin = useCallback(...)` |
| `src/components/Auth/RegisterScreen.tsx` | `handleRegister = useCallback(...)` |
| `src/components/Moves/BookingScreen.tsx` | `openMap`, `handleMapConfirm`, `handleRemoveItem`, `openDateTimePicker`, `handleCreateOrder` – كلهم ملفوفين بـ useCallback |
| `src/components/OrdersList/OrdersListScreen.tsx` | `useCallback` جوا `useFocusEffect` لجلب الطلبات |
| `src/components/MyReservePage/MyReservePage.tsx` | `useCallback` جوا `useFocusEffect` لجلب الحجوزات |

#### useMemo
بتحسب قيمة وبتحفظها وما بتعيد الحساب إلا إذا تغيرت الـ dependencies:

| الملف | الاستخدام |
|-------|-----------|
| `src/context/AuthContext.tsx` | `value = useMemo(() => ({ user, initializing, logout }), [...])` – عشان ما يعمل re-render لكل الأطفال بدون سبب |
| `src/components/Moves/BookingScreen.tsx` | `selectedDriver = useMemo(...)` لإيجاد السائق المختار، `routeLine = useMemo(...)` لخط المسار على الخريطة |
| `src/components/OrderDetailsPage/OrderDetails.tsx` | `items = useMemo(...)` لتحضير قائمة المنقولات |
| `src/components/Notifications/NotificationsScreen.tsx` | `unreadCount = useMemo(...)` لحساب عدد الإشعارات غير المقروءة |
| `src/components/MovesMenuDrawer.tsx` | `items = useMemo(...)` لترتيب عناصر القائمة |

#### useRef
بتحفظ reference لعنصر DOM/Native بدون ما تسبب re-render:

| الملف | الاستخدام |
|-------|-----------|
| `src/components/Moves/BookingScreen.tsx` | `mapRef = useRef<MapView \| null>(null)` – ريفرنس للخريطة عشان نقدر نتحكم فيها برمجياً (مثلاً zoom أو animate) |

**فائدتهن:** بيحسنوا أداء التطبيق وبيمنعوا re-renders ما إلها لزوم.

---

### 13. 🔐 Authentication (Secure Store / Firebase Auth)

**شو هي؟** نظام مصادقة المستخدمين (تسجيل دخول/تسجيل/خروج).

**وين مستخدمة؟**

| الملف | الاستخدام |
|-------|-----------|
| `src/api/firebaseConfig.tsx` | تهيئة Firebase Auth مع `getReactNativePersistence(AsyncStorage)` – بيحفظ جلسة المستخدم بشكل آمن محلياً |
| `src/services/authService.ts` | `loginUser` (بيستخدم `signInWithEmailAndPassword`)، `registerUser` (بيستخدم `createUserWithEmailAndPassword` + بيحفظ بيانات المستخدم بـ Firestore)، `logoutUser` (بيستخدم `signOut`) |
| `src/context/AuthContext.tsx` | بيسمع على `onAuthStateChanged` – لما المستخدم يسجل دخول أو خروج بيتحدث الـ state تلقائي |
| `src/hooks/useAuthActions.ts` | `useLogin` و `useRegister` – بيلفوا الـ service functions بـ `useMutation` |
| `src/components/Auth/LoginScreen.tsx` | شاشة تسجيل الدخول – بتستخدم `useLogin` |
| `src/components/Auth/RegisterScreen.tsx` | شاشة التسجيل – بتستخدم `useRegister` |
| `src/components/MovesMenuDrawer.tsx` | زر تسجيل الخروج بالقائمة الجانبية |

**فائدتها:** المستخدم يسجل مرة وحدة ويضل مسجل حتى لو سكر التطبيق، والبيانات محمية.

---

### 14. 🧹 Clean Code & Best Practices

**وين ظاهرة؟**

| الممارسة | الشرح |
|----------|-------|
| **فصل الطبقات** | `services/` للبيزنس لوجيك، `hooks/` للهوكات، `components/` للـ UI، `lib/` للأدوات المشتركة |
| **كومبوننتات فرعية** | كل شاشة مقسمة لملفات صغيرة (مثلاً `LoginHeader`, `LoginForm`, `LoginFooter`) بدل ملف واحد كبير |
| **ملفات index.ts** | كل مجلد فرعي فيه `index.ts` بيعمل re-export عشان الـ imports تكون نظيفة |
| **ملفات styles.ts** | الستايلات منفصلة بملفات خاصة مش مخلوطة مع اللوجيك |
| **ملفات types.ts** | الأنواع (TypeScript types) بملفات منفصلة |
| **TypeScript** | المشروع كله مكتوب بـ TypeScript مع أنواع واضحة |
| **تسمية واضحة** | أسماء الملفات والدوال واضحة ومعبرة (مثلاً `useCreateOrder`, `getErrorMessage`, `cacheOrders`) |

---

## 🛠️ التقنيات والمكتبات

| المكتبة | الاستخدام |
|---------|-----------|
| React Native + Expo | إطار العمل الأساسي |
| Expo Router | نظام التنقل بين الشاشات |
| Firebase Auth | مصادقة المستخدمين |
| Firebase Firestore | قاعدة بيانات سحابية |
| React Hook Form | إدارة الفورمات |
| TanStack React Query | إدارة البيانات والكاش |
| Axios | طلبات HTTP |
| Expo SQLite | قاعدة بيانات محلية (أوفلاين) |
| Async Storage | تخزين محلي بسيط |
| Expo Location | خدمات الموقع |
| Expo Image Picker | الكاميرا ومعرض الصور |
| React Native Maps | عرض الخرائط |
| Lucide Icons | أيقونات |

---

## 🚀 تشغيل المشروع

```bash
npm install
npx expo start
```
