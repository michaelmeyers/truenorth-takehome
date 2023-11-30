import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Platform, Button } from 'react-native'
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions'
import Geolocation from 'react-native-geolocation-service'

interface DistanceFromStarwarsLandProps {}

interface Coordinate {
  latitude: number
  longitude: number
}

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
    Geolocation.getCurrentPosition(
      position => {
        const coords = {
          latitude: position?.coords?.latitude,
          longitude: position?.coords?.longitude
        }
        if (coords.latitude && coords.longitude) {
          setCurrentCoords(coords)
        }
      },
      error => {
        // See error code charts below.
        console.log('ERROR', error.code, error.message)
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    )
  }

  const [locationPermission, setLocationPermission] = useState<string>('')
  const [currentCoords, setCurrentCoords] = useState<Coordinate | undefined>()

  useEffect(() => {
    checkLocationPermission()
  }, [])

  useEffect(() => {
    if (!currentCoords) {
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
    }
  }, [locationPermission])

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {currentCoords ? (
          <Text>{`Latitude: ${currentCoords?.latitude}   Longitude: ${currentCoords?.longitude}`}</Text>
        ) : (
          <Text>{`${locationPermission}`}</Text>
        )}
        <Button title='Locate' onPress={getGeolocation} />
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
