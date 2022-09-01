import axios from 'axios';
import React, { FC, useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  Button
} from "react-native";
import { Snackbar } from "react-native-paper";
import { lotsPropsType } from '../types/types';


const Lots: FC<lotsPropsType> = (props) => {
  //all the slot states
  const [slots, setSlots] = useState<any[]>([]);
  const [currentSlot, setCurrentSlot] = useState<number>(0);
  const [freeSlots, setFreeSlots] = useState<any[]>(slots);
  //car registration
  const [register, setRegister] = useState<string>("");
  const [registrationid, setRegistrationid] = useState<any>();
  //Modal 
  const [showModal, setShowModal] = useState<boolean>(false);
  const [closeModal, setCloseModal] = useState<boolean>(false);
  const [showSnack, setShowSnack] = useState<boolean>(false);
  
  //calculation involving time for payment
  const [time, setTime] = useState<number>(0);
  const [hours, setHours] = useState<number>(0);
  const [amount, setAmount] = useState<number>(0);

  //to show entered lots 
  const showLots = () => {
    let slotsArr = [];
    for (let i = 1; i <= props.route.params.lots; i++) {
      slotsArr.push({
        id: i,
        free: true,
        register: "",
        start: new Date(0, 0, 0),
      });
    }
    setSlots(slotsArr);
  };

  useEffect(() => {
    showLots();
  }, []);

  useEffect(() => {
    setFreeSlots(slots.filter((lot) => lot.free));
  }, [slots]);

 
  //assign random lots 
 const getRandomSlots = () => {
    const randomNum = Math.floor(Math.random() * freeSlots.length);
    setCurrentSlot(freeSlots[randomNum].id);
  };

  //to park 
  const park = (random: boolean) => {
    setRegister("");
    if (freeSlots.length > 0) {
      startCount();
      if (random) {
        getRandomSlots();
      }
      if (currentSlot >= 0) {
        setShowModal(true);
      }
    } else {
      setShowSnack(true);
      setTimeout(() => {
        setShowSnack(false);
      }, 1000);
    }
  };

  //to unpark
  const unpark = (register: any) => {
    !slots[currentSlot].free && setCloseModal(true);
    setRegistrationid(register);
  };
  
  //timer for payment processing
  const startCount = () => {
    const start = new Date().getSeconds();
    setTime(start);
  };
  
  //payment processing wrt time
  const calculatePayment = () => {
    const end = new Date().getSeconds();
    const totalTime = (time - end) / (60 * 60);
    if (totalTime / 60 <= 2) {
      setAmount(10);
      setHours(totalTime);
    } else {
      setAmount(10 + (totalTime - 2) * 10);
    }
  };


return(
  <View style={{flex: 1}}>
  

      <View style={styles.container}>
      
        <View style={styles.parkslot}>
        <Button 
        title='Park in the slot'
        onPress={() => park(true)}
        />
        </View>

        {/* the flatlist slots */}

        <TouchableOpacity style={styles.slots}>

          <FlatList
            data={slots}
            numColumns={2}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setCurrentSlot(item.id);
                  !item.free && unpark(item.register),
                    !item.free && setCloseModal(true);
                }}
              >
               
                <View
                  style={{
                    backgroundColor: item.free ? "#ADD8E6" : "#ff0000",
                    padding: 5,
                    borderRadius: 5,
                    height: 100,
                    width: 80,
                    margin: 17,
                    justifyContent: "center",
                    alignItems: "center",
                    borderWidth: 1,
                    shadowColor: "#000",
                    shadowOffset: {
	                   width: 0,
	                   height: 6,
                    },
                    shadowOpacity: 0.37,
                    shadowRadius: 7.49,
                    elevation: 12,
                  }}
                >
                  
                  <Text style={styles.slotText}>Slot {item.id}</Text>
                  <Text style={styles.slotText}>
                    {item.free ? "Free" : `Engaged ${item.register}`}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </TouchableOpacity>
        
         {/* modal for parking */}
        <Modal 
        visible={showModal} 
        animationType="fade"
        >
          <View style={styles.modal}>
            <Text style={styles.info}>Parking Slot No. {currentSlot}</Text>
            <TextInput
              placeholder="Enter registered number.."
              placeholderTextColor="grey"
              onChangeText={(text) => {
                setRegister(text);
              }}
              style={styles.input}
            />

            <View style={styles.buttonRow}>
              
                <View style={styles.buttonpark}>
                <Button title = 'Park'
                
                onPress={() => {
                  if (register.length) {
                    setSlots(
                      slots.map((lot) => {
                        return lot.id === currentSlot
                          ? {
                              ...lot,
                              free: false,
                              register: register,
                              start: new Date(),
                            }
                          : lot;
                      })
                    );
                    setShowModal(false);
                  }
                }}
                />
                
                </View>
                
              <View style={styles.buttonpark}>
                <Button
                title='Close'
                onPress={() => {
                  setShowModal(false);
                }}
                />
             

              </View>
              </View>
            
          </View>
        </Modal>


        {/* second modal for unparking */}
        <Modal
          visible={closeModal}
          onShow={() => {
            calculatePayment();
          }}
          animationType="fade"
        >
          <View style={styles.modal}>
            <Text style={styles.PHead}>
              Payment of Slot {currentSlot}
            </Text>
            <Text style={styles.paymentText}>Time:{hours} mins</Text>
            <Text style={styles.paymentText}>Total Amount:{amount}</Text>

            <View style={styles.buttonRow}>
              <View style={styles.buttonpark}>
                <Button 
                title='UnPark'
                onPress={() => {
                  const flag = false;
                  axios
                    .post("https://httpstat.us/200", {
                      car_registration: registrationid,
                      charge: amount,
                    })
                    .then((res: any) => {});
                  setSlots(
                    slots.map((lot) => {
                      return lot.id === currentSlot
                        ? {
                            ...lot,
                            free: true,
                            register: "",
                            start: new Date(0, 0, 0),
                          }
                        : lot;
                    })
                  );
                  setAmount(0);
                  setHours(0);
                  setCloseModal(false);
                }}
                />
              </View>
              
             <View style={styles.buttonpark}>
              <Button 
              title='Cancel'
              onPress={() => {
                setCloseModal(false);
              }}
              />
             </View>
            
            </View>
          </View>
        </Modal>

        
        
      </View>
      
    <Snackbar
    visible={showSnack}
    onDismiss={() => setShowSnack(false)}
    style={styles.snack}
    
  >
    <Text style={styles.snackText}>Parking is full!</Text>
  </Snackbar>
  </View>
  );
};


export default Lots;


const styles = StyleSheet.create({
  container: {
      flex: 1,
      padding: 10,
    }, 

    parkslot:{
      height : 40,
      width : 150,
      justifyContent : "center",
      borderRadius : 20,
      marginTop: 30,
      marginLeft:100
    },
    //Park in slot text
    getSlotText: {
      color: "black",
      fontWeight: "500",
      fontSize: 18,
    },
    snack: {
      flex: 1,
    justifyContent: 'space-between',
     
    },
    snackText: {
      color: "#f8f8ff",
      fontSize: 15
    },
    modal: {
      justifyContent: 'center',  
      alignItems: 'center',   
      backgroundColor : "#ADD8E6",   
      height: 400 ,  
      width: '80%',  
      borderRadius:10,  
      borderWidth: 1,     
      marginTop: 100,  
      marginLeft: 40,  
      shadowColor: "#000",
      shadowOffset: {
	     width: 0,
	     height: 6,
      },
      shadowOpacity: 0.37,
      shadowRadius: 7.49,
      elevation: 12,
    },
    info: {
      fontSize: 18,
      color: "black",
      fontWeight: "500",
      marginBottom: 10,
    },
    //parking input text field
    input: {
      height: 40,
    paddingLeft: 6,
    borderBottomWidth: 1,
    marginTop: 70,
    borderBottomColor:'#000000',
    marginLeft: 50,
    marginRight:50
    },
    buttonRow: {
      flexDirection: "column",
      justifyContent: "space-around",
      width: "100%",
      alignItems: "center",
    },
    //Parking slot buttons to park and close
    buttonpark:{
      height : 40,
      width : 100,
      justifyContent : "center",
      borderRadius : 20,
      marginTop: 30
     
    },
    //payment styles
    paymentText: {
      fontSize: 15,
      padding: 5,
      color:"black"
    },
    PHead:{
      fontSize: 20,
      padding: 20,
      fontWeight:"bold",
      color:"black"
    },
    //slot styles
    slots: {
      width: "100%",
      paddingLeft: 65,
      
    },
    slotText: {
      color: "black",
      fontSize: 15,
    },

})
