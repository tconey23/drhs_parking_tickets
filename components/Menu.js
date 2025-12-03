import { Entypo } from '@expo/vector-icons';
import {useEffect, useState} from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context' 
import {View, Text, StyleSheet, Button, TouchableOpacity, Modal} from 'react-native' 


const Menu = ({setResetForm}) => {
    const [openMenu, setOpenMenu] = useState(false) 
    const insets = useSafeAreaInsets()

  return ( 
    <View style={styles.container}>
      <TouchableOpacity style={styles.burger} onPress={() => setOpenMenu(prev => !prev)}>
        <Entypo name='menu' type='entypo' size={30}/>
      </TouchableOpacity>

      <Modal
        visible={!!openMenu}
        transparent
        onRequestClose={() => {
            setOpenMenu(false)
        }}
        animationType='fade'
        >
        <SafeAreaView style={{marginTop: insets.top, backgroundColor: '#0000001d', flex:1}}>
        <View style={styles.dropMenu}>

            <TouchableOpacity style={styles.button} onPress={() => setOpenMenu(false)}>
                <Text>Close</Text>
            </TouchableOpacity>

            <View>
            <TouchableOpacity style={styles.menuButtons} onPress={() => {
              setResetForm(prev => prev +1)
              setOpenMenu(false)
              }}>
                <Text>Refresh</Text>
            </TouchableOpacity>
            </View>

        </View>
      </SafeAreaView>
      </Modal>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    paddingTop: 8,
    paddingLeft: 8,
    zIndex: 1000,
    elevation: 1000, // Android
  },
  button: {
    backgroundColor: 'lightblue',
    width: '33%',
    height: 30,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00000089',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity:1,
    shadowRadius: 3,
    margin:10
  },
  dropMenu: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: '#000000a3',
    zIndex: 10000,
    alignItems: 'center',
  },
  menuButtons: {
    backgroundColor: 'lightblue',
    width: '100%',
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00000089',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity:1,
    shadowRadius: 3,
    margin:10,
    padding:10
  },
  burger: {
    padding: 10,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
  },
})

export default Menu