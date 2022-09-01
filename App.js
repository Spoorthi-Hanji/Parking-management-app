
import { StatusBar} from 'react-native'
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Home from './screens/Home';
import Parking from './screens/Parking';
import { Provider as PaperProvider } from 'react-native-paper'


const Stack = createStackNavigator();

function App() {
  return (
    <PaperProvider>
      <StatusBar style="auto"/>
      <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Parking management app" component={Home} />
        <Stack.Screen
            name="Parking" component={Parking}/>
      </Stack.Navigator>
    </NavigationContainer>

    </PaperProvider>
    
  );
}

export default App;