import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet } from 'react-native';

const FoodSearchScreen = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const searchFood = async () => {
    try {
      const response = await fetch('https://platform.fatsecret.com/rest/server.api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 여기에 다른 필요한 헤더를 추가하세요.
        },
        body: JSON.stringify({
          method: 'foods.search',
          search_expression: query,
          format: 'json',
          // 여기에 API 키와 필요한 다른 매개변수를 추가하세요.
        }),
      });

      const json = await response.json();
      setResults(json.foods.food);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for food"
        value={query}
        onChangeText={setQuery}
      />
      <Button title="Search" onPress={searchFood} />
      <FlatList
        data={results}
        keyExtractor={(item) => item.food_id.toString()}
        renderItem={({ item }) => (
          <Text style={styles.item}>{item.food_name}</Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  searchInput: {
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
});

export default FoodSearchScreen;
