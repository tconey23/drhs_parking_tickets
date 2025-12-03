// App.js
import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  SafeAreaView,
  SafeAreaProvider,
  useSafeAreaInsets
} from 'react-native-safe-area-context';

import InputForm from './components/InputForm.jsx';
import AppHeader from './components/AppHeader.js';
// Supabase import is fine even if unused here
import { supabase } from './helpers/supabase.js';

const SafeArea = () => {
  const insets = useSafeAreaInsets()


  return (
    <View style={{
      width: '100%', 
      justifyContent: 'flex-end', 
      marginTop: insets.top,
      height: '100%'
      }}>
          {/* <AppHeader setResetForm={setResetForm}/>
          <InputForm resetForm={resetForm}/> */} 
    </View>
  ) 
}

export default function App() {
  const [resetForm, setResetForm] = useState(0)
 
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'right', 'bottom', 'left']}>
          <AppHeader setResetForm={setResetForm}/>
          <InputForm resetForm={resetForm} setResetForm={setResetForm}/>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
});