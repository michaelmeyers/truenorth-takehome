/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react'
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View
} from 'react-native'

import { Colors } from 'react-native/Libraries/NewAppScreen'
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
  useQuery,
  ApolloError
} from '@apollo/client'
import { Float } from 'react-native/Libraries/Types/CodegenTypes'

const client = new ApolloClient({
  uri: 'https://swapi-graphql.netlify.app/.netlify/functions/index',
  cache: new InMemoryCache()
})

const GET_STARSHIPS = gql`
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
interface Starship {
  costInCredits: Float
  crew: string
  id: string
  length: Float
  model: string
  name: string
  passengers: string
  starshipClass: string
}

interface StarshipData {
  allStarships: {
    starships: Starship[]
  }
}

interface StarshipQuery {
  loading: boolean
  error?: ApolloError | undefined
  data: StarshipData | undefined
}

interface StarShipItem {
  starship: Starship
}

function StarshipItem (props: StarShipItem): JSX.Element {
  const starship: Starship = props.starship
  const {
    costInCredits,
    crew,
    length,
    model,
    name,
    passengers,
    starshipClass
  } = starship

  const shipTableData = [
    {
      name: 'Model',
      value: model
    },
    {
      name: 'Class',
      value: starshipClass
    },
    {
      name: 'Crew #',
      value: crew
    },
    {
      name: 'Passenger #',
      value: passengers
    },
    {
      name: 'Ship Length',
      value: length,
      subValue: 'meters'
    },
    {
      name: 'Cost',
      value: costInCredits,
      subValue: 'credits'
    }
  ]

  return (
    <View style={styles.itemContainer}>
      <View style={styles.displayContainer}>
        <View>
          <Text style={styles.starshipName}>{name}</Text>
        </View>
        <View style={styles.tableView}>
          {shipTableData.map(({ name, value, subValue }) => {
            return (
              <View style={styles.shipTableView}>
                <View style={styles.shipTableLabel}>
                  <Text style={styles.tableText}>{name}</Text>
                </View>
                <View style={styles.shipTableValue}>
                  {subValue ? (
                    <Text>
                      <Text style={styles.tableText}>
                        {value?.toLocaleString()}
                      </Text>
                      <Text style={styles.tableSubText}>{' ' + subValue}</Text>
                    </Text>
                  ) : (
                    <Text style={styles.tableText}>{value}</Text>
                  )}
                </View>
              </View>
            )
          })}
        </View>
      </View>
    </View>
  )
}

function MainView (): JSX.Element {
  const { loading, error, data }: StarshipQuery = useQuery(GET_STARSHIPS)

  if (!data) {
    return (
      <View>
        <Text>The data is far far away</Text>
      </View>
    )
  }

  const renderItem = ({ item }) => {
    const starship: Starship = item
    return starship && <StarshipItem starship={starship} />
  }

  const { starships } = data?.allStarships

  return (
    <View style={styles.container}>
      <FlatList data={starships} renderItem={renderItem} />
    </View>
  )
}

function App (): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark'

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter
  }

  return (
    <ApolloProvider client={client}>
      <SafeAreaView style={{ backgroundColor: Colors.darker }}>
        <StatusBar barStyle={'light-content'} backgroundColor={Colors.darker} />
        <MainView />
      </SafeAreaView>
    </ApolloProvider>
  )
}

const styles = StyleSheet.create({
  container: {},
  itemContainer: {
    paddingVertical: 10,
    paddingHorizontal: 10
  },
  displayContainer: {
    backgroundColor: 'grey',
    borderRadius: 5,
    padding: 10
  },
  tableView: {
    borderColor: 'black',
    borderBottomWidth: 1
  },
  shipTableView: {
    borderColor: 'black',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    flexDirection: 'row',
    padding: 2
  },
  shipTableLabel: {
    flex: 1,
    alignItems: 'flex-start'
  },
  shipTableValue: {
    flex: 2,
    alignItems: 'flex-end'
  },
  tableText: {
    fontSize: 11
  },
  tableSubText: {
    fontSize: 8,
    color: '#222222'
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400'
  },
  starshipName: {
    fontSize: 20,
    fontWeight: 'bold'
  }
})

export default App
