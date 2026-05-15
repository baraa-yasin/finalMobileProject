import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";

type NavigationItem = {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  route: string;
};

export const navItems: NavigationItem[] = [
  { icon: "home", label: "الرئيسية", route: "/" },
  { icon: "local-shipping", label: "نقلاتي", route: "/moves" },
  { icon: "notifications-none", label: "التنبيهات", route: "/notifications" },
  { icon: "account-circle", label: "الحساب", route: "/profile" },
];

export default function MovesBottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.bottomNavigation}>
      {navItems.map((item) => {
        // نتحقق من الصفحة الحالية لتفعيل الزر المناسب
        const isActive = pathname === item.route;

        return (
          <TouchableOpacity 
            key={item.label} 
            style={styles.navItem}
            onPress={() => router.push(item.route as any)}
          >
            <MaterialIcons
              name={item.icon}
              size={26}
              color={isActive ? "#0b3a00" : "#a1a1aa"}
            />

            <Text style={[styles.navLabel, isActive && styles.activeNavLabel]}>
              {item.label}
            </Text>

            {isActive && <View style={styles.activeDot} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNavigation: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 82,
    backgroundColor: "rgba(255,255,255,0.94)",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingBottom: 10,
    paddingHorizontal: 16,
    flexDirection: "row-reverse",
    justifyContent: "space-around",
    alignItems: "center",
    elevation: 12,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  navLabel: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: "700",
    color: "#a1a1aa",
  },
  activeNavLabel: {
    color: "#0b3a00",
  },
  activeDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#0b3a00",
    marginTop: 4,
  },
});
