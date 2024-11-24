import { View, ScrollView, StyleSheet } from 'react-native'
import React from 'react'
import { Text } from './ui'
import { houseImages } from '@/constants/data';
import HouseTile from './HouseTile';
import { House } from '@/lib/types';

export default function HousesCarousel() {
  return (
    <View>
        <Text type="title" style={styles.sectionTitle}>
          Houses:
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.housesContainer}
        >
          {Object.keys(houseImages).map((houseName) => (
            <HouseTile houseName={houseName as House} key={houseName} />
          ))}
        </ScrollView>
        <Text type="title" style={styles.sectionTitle}>
          Characters:
        </Text>
      </View>
  )
}

const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 0,
    },
    sectionTitle: {
      marginBottom: 10,
    },
    housesContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 20,
      padding: 5,
      gap: 20,
      height: 185,
    },
  });
  