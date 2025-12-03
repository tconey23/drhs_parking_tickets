import {useState, useEffect} from 'react'
import { StyleSheet, Text, View, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Menu from './Menu';


const AppHeader = ({setResetForm}) => {

    const insets = useSafeAreaInsets() 

  return (
    <View style={{ 
        height: '10%', 
        width: '100%', 
        alignItems: 'center ', 
        justifyContent: 'center', 
        flexDirection: 'row',
        borderBottomColor: '#00000079',
        borderBottomWidth: 0.2,
        marginVertical: 20
        }}>

    <View style={{flex:1, alignItems: 'center ', justifyContent: 'center', padding:10}}>
      <Image style={{width: '55%', height: '100%', margin: 1}} source={require('../assets/DOSS_Logo.png')}/>
    </View>

      <View style={{width: '40%', height: '100%', justifyContent: 'center'}}>
        <Text style={{width: '100%', fontSize: 20, textAlign: 'center', color: 'black'}}>DRHS Parking Tickets</Text>
      </View>

      <View style={{width: '25%'}}>
        <Menu setResetForm={setResetForm}/> 
      </View>
      
    </View>
  )
}

export default AppHeader

const styles = StyleSheet.create({
  headWrap: {
    width: '33%',
    flex:1
  }
})