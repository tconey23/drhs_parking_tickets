import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Pressable,
} from 'react-native'; 

const Camera = ({onPictureTaken}) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [takingPhoto, setTakingPhoto] = useState(false)
  const cameraRef = useRef()

  useEffect(() => {
    if(takingPhoto){
      setTimeout(() => {
        setTakingPhoto(false)
      }, 10)
    }
  },[takingPhoto])

  const handleTakePhoto = async () => {
    if (!cameraRef.current) return;
    try {
      setTakingPhoto(true)
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
      });
      // console.log('📸 photo uri:', photo.uri);
      onPictureTaken?.(photo);
      // optionally close after capture
      // onClose?.();
    } catch (e) {
      console.warn('Error taking picture', e);
    }
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={'back'}/>
      <Pressable
        style={[StyleSheet.absoluteFill,{backgroundColor: takingPhoto ? 'white' : ''}]}
        onPress={handleTakePhoto}
        android_disableSound={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    marginVertical: 30
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    height: '80%',
  },
  buttonContainer: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    flex: 1,
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default Camera