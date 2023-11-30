/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react'
import { SafeAreaView, StatusBar, useColorScheme } from 'react-native'

import DistanceFromStarwarsLand from './components/DistanceFromStarwarsLand'
import MainView from './components/MainView'

import { Colors } from 'react-native/Libraries/NewAppScreen'
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql
} from '@apollo/client'

const client = new ApolloClient({
  uri: 'https://swapi-graphql.netlify.app/.netlify/functions/index',
  cache: new InMemoryCache()
})

export const GET_STARSHIPS = gql`
  query GetStarships {
    allStarships {
      starships {
        costInCredits
        crew
        id
        length
        model
        name
        passengers
        starshipClass
      }
    }
  }
`

function App (): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark'

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter
  }

  return (
    <ApolloProvider client={client}>
      <SafeAreaView style={{ backgroundColor: Colors.darker }}>
        <StatusBar barStyle={'light-content'} backgroundColor={Colors.darker} />
        <DistanceFromStarwarsLand />
        <MainView />
      </SafeAreaView>
    </ApolloProvider>
  )
}

export default App
