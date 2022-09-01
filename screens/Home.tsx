
import React, { FC, useState } from "react";
import { TextInput, View,StyleSheet,Alert,Button} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { routesType } from "../types/types";
import Toast from 'react-native-toast-message';


const Home: FC=()=> {
  const [lots, setLots] = useState<number>(0);

  const navigation = useNavigation<StackNavigationProp<routesType>>();

  const handlePress = () => {
    navigation.navigate("Parking", { lots: lots });
  };
   if(!lots){
   Toast.show({
			type:'error',
			text1: 'Please enter a number',
			visibilityTime:1000,
			
		})
 }
 return (
  <View style={styles.container}>
    <Toast/>
    <TextInput
      placeholder="Enter slots available...."
      placeholderTextColor="grey"
      keyboardType="numeric"
      onChangeText={(text) => setLots(Number(text))}
      style={styles.input}
    />
    <View style={styles.button}>
    <Button  title='Submit' disabled={!lots} 
     onPress={handlePress} 
     color="#A9A9A9"
     />
    </View>
     
  </View>
);
};

export default Home;

const styles = StyleSheet.create({
  container: {
      flex: 1,
      padding: 5,
      justifyContent: "center",
      alignItems: "center"
  },
  input: {
    height: 40,
    paddingLeft: 6,
    borderBottomWidth: 1,
    marginTop: 70,
    borderBottomColor:'#000000',
    marginLeft: 50,
    marginRight:50
    },
    button:{
      alignItems: 'center',
      marginTop: 15,
      color: 'dark grey'
    }
})

 