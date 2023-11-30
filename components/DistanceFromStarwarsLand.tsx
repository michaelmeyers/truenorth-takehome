import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Platform, Button } from 'react-native'
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions'
import Geolocation from 'react-native-geolocation-service'
import { getDistance, convertDistance } from 'geolib'

interface DistanceFromStarwarsLandProps {}

interface Coordinate {
  latitude: number
  longitude: number
}

const StarwarsLandCoords: Coordinate = {
  latitude: 33.814831976267016,
  longitude: -117.92057887641796
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
      error => {},
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

  const convertTwoCoordsIntoDistanceInMiles = (
    coord1: Coordinate | undefined,
    coord2: Coordinate | undefined
  ) => {
    if (!coord1 || !coord2) {
      return undefined
    }

    const distanceInMeters = getDistance(coord1, coord2)
    return Math.trunc(convertDistance(distanceInMeters, 'mi'))
  }

  const distanceInMiles = convertTwoCoordsIntoDistanceInMiles(
    currentCoords,
    StarwarsLandCoords
  )
  return currentCoords ? (
    <View style={styles.container}>
      <View style={styles.row}>
        {currentCoords && (
          <Text>
            <Text style={styles.starwarsText}>STARWARS LAND</Text>
            <Text
              style={styles.distanceText}
            >{`  ${distanceInMiles} mile(s) away`}</Text>
          </Text>
        )}
      </View>
    </View>
  ) : (
    <View />
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    height: 50
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  starwarsText: {
    color: '#ffe81f',
    fontSize: 20
  },
  distanceText: {
    flex: 1,
    alignSelf: 'flex-end',
    fontSize: 15,
    color: 'white'
  }
})

export default DistanceFromStarwarsLand
