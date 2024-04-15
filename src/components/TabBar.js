import React, {useState} from 'react';
import { useRouter } from "expo-router";
import { icons } from '../../constants';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';

// 각 탭 아이템 컴포넌트
const TabItem = ({ icon, selectedIcon, label, onPress,isSelected }) => (
  <Pressable style={styles.tabItem} onPress={onPress}>
    <Image source={isSelected ? selectedIcon : icon} style={styles.tabIcon} />
    <Text style={[styles.tabLabel, { color: isSelected ? '#380B61' : '#fff' }]}>{label}</Text>
  </Pressable>
);

// 탭바 컴포넌트
const TabBar = () => {
  const [selectedTab, setSelectedTab] = useState('home'); // 선택된 탭을 상태로 관리
  const router = useRouter();
  // 탭 선택 시 실행되는 함수
  const handleTabPress = (label, routeName) => {
    setSelectedTab(label);
    router.push(routeName)
  };

  return (
    <View style={styles.tabBarContainer}>
      <TabItem
        icon={icons.icon_home_w}
        selectedIcon={icons.icon_home_p}
        label="홈"
        isSelected={selectedTab =='home'}
        onPress={() => handleTabPress('home', '/mainScreen')}
      />
      <TabItem
        icon={icons.icon_stress_w}
        selectedIcon={icons.icon_stress_p}
        label="스트레스"
        isSelected={selectedTab =='stress'}
        onPress={() => handleTabPress('stress', '/stressScreen')}
      />
      <TabItem
        icon={icons.icon_rice_w}
        selectedIcon={icons.icon_home_p}
        label="식단"
        isSelected={selectedTab =='diet'}
        onPress={() => handleTabPress('diet', '/dietScreen')}
      />
      <TabItem
        icon={icons.icon_graph_w}
        selectedIcon={icons.icon_graph_p}
        label="분석"
        isSelected={selectedTab =='analysis'}
        onPress={() => handleTabPress('stress', '/analysisScreen')}
      />
      <TabItem
        icon={icons.icon_calendar_w}
        selectedIcon={icons.icon_calendar_p}
        label="캘린더"
        isSelected={selectedTab =='calendar'}
        onPress={() => handleTabPress('stress', '/calendarScreen')}
      />
    </View>
  );
};

// 스타일 시트
const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#ddd',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingVertical: 10,
  },
  tabItem: {
    alignItems: 'center',
  },
  tabIcon: {
    width: 24,
    height: 24,
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default TabBar;