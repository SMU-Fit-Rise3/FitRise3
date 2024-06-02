import { Tabs } from 'expo-router';
import { Image, StyleSheet, Platform, Text } from 'react-native';
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
          let label;
          switch (route.name) {
            case 'mainScreen':
              icon = icons.icon_home_w;
              selectedIcon = icons.icon_home_p;
              label = '홈';
              break;
            case 'stressScreen':
              icon = icons.icon_stress_w;
              selectedIcon = icons.icon_stress_p;
              label = '스트레스';
              break;
            case 'dietScreen':
              icon = icons.icon_rice_w;
              selectedIcon = icons.icon_rice_p;
              label = '식단';
              break;
            case 'analysisScreen':
              icon = icons.icon_graph_w;
              selectedIcon = icons.icon_graph_p;
              label = '분석';
              break;
            case 'calendarScreen':
              icon = icons.icon_calendar_w;
              selectedIcon = icons.icon_calendar_p;
              label = '캘린더';
              break;
          }
          return <TabBarIcon focused={focused} icon={icon} selectedIcon={selectedIcon} />;
        },
        tabBarShowLabel: true,
        tabBarLabel: ({ focused }) => {
          let label;
          switch (route.name) {
            case 'mainScreen':
              label = '홈';
              break;
            case 'stressScreen':
              label = '스트레스';
              break;
            case 'dietScreen':
              label = '식단';
              break;
            case 'analysisScreen':
              label = '분석';
              break;
            case 'calendarScreen':
              label = '캘린더';
              break;
          }
          return <Text style={{ color: focused ? '#000' : '#aaa' }}>{label}</Text>;
        },
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#ddd',
          paddingVertical: 10,
          height: Platform.select({
            ios: 80,
            android: 70,
          }),
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
    width: 25,
    height: 25,
  },
});

export default Layout;
