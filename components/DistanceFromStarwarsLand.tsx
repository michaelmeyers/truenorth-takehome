import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Platform, Button } from 'react-native'
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions'

interface DistanceFromStarwarsLandProps {}

function DistanceFromStarwarsLand (
  props: DistanceFromStarwarsLandProps
): JSX.Element {
  const requestLocationPermission = async () => {
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
    request(permission).then(result => {
      setLocationPermission(result)
    })
  }

  const checkLocationPermission = async () => {
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
    check(permission).then(result => {
      setLocationPermission(result)
      return result
    })
  }

  const getGeolocation = () => {
    console.log('TIME TO TO FETCH THE LOCATION')
  }

  const [locationPermission, setLocationPermission] = useState<string>('')

  useEffect(() => {
    checkLocationPermission()
  }, [])

  useEffect(() => {
    // LOOKS LIKE WE CANNOT REQUEST AGAIN?  I GUESS THIS LIBRARY DOES NOT WORK THAT WAY?  MAYBE ADD A NOTE TO TELL THEM TO TURN IT ON
    switch (locationPermission) {
      case RESULTS.UNAVAILABLE:
      case RESULTS.DENIED:
        requestLocationPermission()
        break
      case RESULTS.BLOCKED:
        break
      case RESULTS.LIMITED:
      case RESULTS.GRANTED:
        getGeolocation()
        break
      default:
        requestLocationPermission()
    }
  }, [locationPermission])

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text>{`${locationPermission}`}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    backgroundColor: 'red',
    height: 50
  },
  row: {
    flexDirection: 'row'
  }
})

export default DistanceFromStarwarsLand
