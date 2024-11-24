import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from '@/components/ui';
import Colors from '@/constants/Colors';
import { getHouseColor } from '@/lib/utils';
import { useThemeColor } from '@/hooks/useThemeColor';

type FilterOption = {
  label: string;
  value: string;
};

type FilterCategory = {
  name: string;
  options: FilterOption[];
};

type CategoryFiltersProps = {
  selectedFilters: Record<string, string>;
  handleFilterPress: (category: string, value: string) => void;
};

const filterCategories: FilterCategory[] = [
  {
    name: 'house',
    options: [
      { label: 'Gryffindor', value: 'gryffindor' },
      { label: 'Hufflepuff', value: 'hufflepuff' },
      { label: 'Ravenclaw', value: 'ravenclaw' },
      { label: 'Slytherin', value: 'slytherin' },
    ],
  },
  {
    name: 'blood status',
    options: [
      { label: 'Pure blood', value: 'pure-blood' },
      { label: 'Half blood', value: 'half-blood' },
      { label: 'Muggle born', value: 'muggle-born' },
    ],
  },
  {
    name: 'species',
    options: [
      { label: 'Human', value: 'human' },
      { label: 'Ghost', value: 'ghost' },
      { label: 'Goblin', value: 'goblin' },
      { label: 'House elf', value: 'house-elf' },
    ],
  },
  {
    name: 'gender',
    options: [
      { label: 'Male', value: 'male' },
      { label: 'Female', value: 'female' },
    ],
  },
];

const CategoryFilters: React.FC<CategoryFiltersProps> = ({ selectedFilters, handleFilterPress }) => {
  const backgroundColor = useThemeColor({light: "#efeee9",dark: "#232323"}, "background")

  return (
    <View style={styles.container}>
      {filterCategories.map((category) => (
        <View key={category.name} style={styles.categoryContainer}>
          <Text type="subtitle" style={styles.categoryTitle}>
            {category.name}
          </Text>
          <View style={styles.optionsContainer}>
            {category.options.map((option) => (
              <Pressable
                key={option.value}
                style={[
                  styles.filterOption,
                  {backgroundColor},
                  selectedFilters[category.name] === option.value && styles.selectedOption,
                  category.name === 'house' && selectedFilters[category.name] === option.value && {
                    backgroundColor: getHouseColor(option.value) ?? undefined,
                  },
                ]}
                onPress={() => handleFilterPress(category.name, option.value)}
              >
                <Text
                  style={[
                    styles.filterOptionText,
                    selectedFilters[category.name] === option.value && styles.selectedOptionText,
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 0,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryTitle: {
    marginBottom: 10,
    textTransform: "capitalize",
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterOption: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: Colors.primary,
  },
  filterOptionText: {
    color: Colors.gray,
    fontSize: 14,
  },
  selectedOptionText: {
    color: Colors.light.background,
  },
});

export default CategoryFilters;
