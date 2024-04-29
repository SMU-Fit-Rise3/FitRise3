import * as React from 'react';
import { ToggleButton } from 'react-native-paper';

const ColorToggleButton = ({ mealTypes, onMealTypeChange }) => {
  const [selectedMealType, setSelectedMealType] = React.useState(mealTypes[0].value);

  const onButtonToggle = (value) => {
    setSelectedMealType(value);
    onMealTypeChange(value);  // 상위 컴포넌트의 상태 업데이트
  };

  return (
    <ToggleButton.Group onValueChange={onButtonToggle} value={selectedMealType}>
      {mealTypes.map((mealType) => (
        <ToggleButton icon={mealType.icon} value={mealType.value} key={mealType.value}>
          {mealType.label}
        </ToggleButton>
      ))}
    </ToggleButton.Group>
  );
};

export default ColorToggleButton;
