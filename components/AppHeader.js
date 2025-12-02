import {useState, useEffect} from 'react'
import { StyleSheet, Text, View, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Menu from './Menu';


const AppHeader = ({setResetForm}) => {

    const insets = useSafeAreaInsets()

  return (
    <View style={{
        height: '8%', 
        width: '100%', 
        alignItems: 'center ', 
        justifyContent: 'center', 
        flexDirection: 'row',
        borderBottomColor: '#00000079',
        borderBottomWidth: 0.2
        }}>

    <View style={{width: '30%', height: '100%', alignItems: 'center ', justifyContent: 'center'}}>
      <Image resizeMethod='contain' style={{width: '68%', height: '70%'}} 
        source={{uri: 'https://resources.finalsite.net/images/f_auto,q_auto,t_image_size_6/v1752686058/jeffcopublicschoolsorg/nzyxfvpcysiodo8anlsv/PrimaryLogo.png'}}
      />
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