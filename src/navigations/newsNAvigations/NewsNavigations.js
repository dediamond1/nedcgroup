import React from 'react'


import {createStackNavigator} from '@react-navigation/stack'
import NewsScreen from '../../screens/news/NewsScreen'
import NewsDetailScreen from '../../screens/news/NewsDetailScreen'

const Stack = createStackNavigator()

const NewsNavigations = ()=> {
    return <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name='NEWS_NAV' component={NewsScreen}/>
        <Stack.Screen name='NEWS_DETAILS' component={NewsDetailScreen}/>
    </Stack.Navigator>
}

export default NewsNavigations