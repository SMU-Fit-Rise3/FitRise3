import { Tabs } from 'expo-router';
import { Image, StyleSheet } from 'react-native';
import { icons } from '../../constants';

const TabBarIcon = ({ focused, icon, selectedIcon }) => (
  <Image source={focused ? selectedIcon : icon} style={styles.tabIcon} />
);

const Layout = () => {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let icon;
          let selectedIcon;
          switch (route.name) {
            case 'mainScreen':
              icon = icons.icon_home_w;
              selectedIcon = icons.icon_home_p;
              break;
            case 'stressScreen':
              icon = icons.icon_stress_w;
              selectedIcon = icons.icon_stress_p;
              break;
            case 'dietScreen':
              icon = icons.icon_rice_w;
              selectedIcon = icons.icon_rice_p;
              break;
            case 'analysisScreen':
              icon = icons.icon_graph_w;
              selectedIcon = icons.icon_graph_p;
              break;
            case 'calendarScreen':
              icon = icons.icon_calendar_w;
              selectedIcon = icons.icon_calendar_p;
              break;
          }
          return <TabBarIcon focused={focused} icon={icon} selectedIcon={selectedIcon} />;
        },
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#ddd',
          paddingVertical: 10,
        },
      })}
    >
      <Tabs.Screen
        name="mainScreen"
        options={{ headerShown: false }} // 헤더를 숨깁니다
      />
      <Tabs.Screen
        name="stressScreen"
        options={{ headerShown: false }} // 헤더를 숨깁니다
      />
      <Tabs.Screen
        name="dietScreen"
        options={{ headerShown: false }} // 헤더를 숨깁니다
      />
      <Tabs.Screen
        name="analysisScreen"
        options={{ headerShown: false }} // 헤더를 숨깁니다
      />
      <Tabs.Screen
        name="calendarScreen"
        options={{ headerShown: false }} // 헤더를 숨깁니다
      />
    </Tabs>
  );
};

const styles = StyleSheet.create({
  tabIcon: {
    width: 30,
    height: 30,
  },
});

export default Layout;
