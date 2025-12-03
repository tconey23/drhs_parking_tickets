
import { useState, useEffect, useEffectEvent } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, Modal, Touchable } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {makesArray, carColorItems} from '../helpers/business';
import Papa from 'papaparse';
import { Entypo, FontAwesome } from '@expo/vector-icons';
import Camera from './Camera'
import {
  SafeAreaView
} from 'react-native-safe-area-context';
import { submitTicket, getMakes } from '../helpers/supabase';
import { supabase } from '../helpers/supabase';
import { Image } from 'react-native';
import { KeyboardAvoidingView } from 'react-native';

const SHEET_ID = '1mhjy9WNMfre7WOXnCHJwdrXVDM2XJf6-onL2a5jN8dI';
const GID = '0';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${GID}`;

const TICKETS_ID = '1OUFVE12Di_KyTVHfn3NJZ5yIKHCiS2mp6QwXsVrf7M8';
const TICKETS_GID = 0;
const TICKETS_SHEET_URL = `https://docs.google.com/spreadsheets/d/${TICKETS_ID}/gviz/tq?tqx=out:csv&gid=${TICKETS_GID}`;

const MIN_TICKET = 280;
const MAX_TICKET = 500;

const allTicketNumbers = Array.from(
  { length: MAX_TICKET - MIN_TICKET + 1 },
  (_, i) => MIN_TICKET + i
);

const ticketItems = allTicketNumbers.map(n => ({
  label: String(n),
  value: n,
}));

const FONT_SIZE = 18

const InputForm = ({resetForm, setResetForm}) => {
  const [date, setDate] = useState(new Date());
  const [ticketNumber, setTicketNumber] = useState(MIN_TICKET);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [pltRows, setPltRows] = useState();
  const [tickRows, setTickRows] = useState();
  const [showDrop, setShowDrop] = useState()
  const [addPhoto, setAddPhoto] = useState(false)
  const [payload, setPayload] = useState()
  const [otherReason, SetOtherReason] = useState(false);
  const [reasons, setReasons] = useState([])
  const [newReason, setNewReason] = useState(null)

  const getReasons = async () => {

    let { data: reasons, error } = await supabase
        .from('reasons')
        .select('*')

        let rsn = reasons?.map((r) => ({
            label: r.label, value: r.value 
        }))

        rsn.push({label: 'Other', value: 'Other'})

        updateField('Reason', 'items', rsn)
  }

  useEffect(() => {
    if(resetForm){
        setTicketNumber(MIN_TICKET) 
        setFormData([...formDefault])
        pullMakes()
        getReasons()
    }
}, [resetForm])

const compilePayload = () => {
  const raw = formData.reduce((acc, entry) => {
    const key = Object.keys(entry)[0];
    const field = entry[key];
    acc[field.key] = field.val;
    return acc;
  }, {});

  // 🔹 If "other" has a value, make it the reason
//   if (raw.other && raw.other.trim() !== "") {
//     raw.reason = raw.other;
//   }

  // Optionally remove "other" so it's not saved as its own field:
  delete raw.other;

  submitTicket(raw);

  setTicketNumber(MIN_TICKET);
  setFormData([...formDefault]);
  pullMakes();
  setResetForm(prev => prev +1)
};
 
const formDefault = [
    { date:    { key: 'date', val: '',          open: false, name: 'Date',            items: [], type: 'date'  } },
    
    { time:    { key: 'time', val: '',          open: false, name: 'Time',            items: [], type: 'time'  } },
    
    { ticket_num:  { key: 'ticket_num', val: ticketNumber,open: false, name: 'Ticket',   items: ticketItems, type: 'drop' } },
    
    { officer:  { key: 'officer', val: '',          open: false, name: 'Officer', items: [
            { label: 'Tiffany Ashraf', value: 'Tiffany Ashraf' },
            { label: 'Ron Perko',      value: 'Ron Perko' },
            { label: 'Tom Coney',      value: 'Tom Coney' },
            ], type: 'drop',
        } 
    },

    { lot:   { key: 'parking_lot', val: '',   open: false, name: 'Lot', items: [{label: 'Main Lot', value: 'Main Lot'}, {label: 'B Lot', value: 'B Lot'}], type: 'drop'  } },
    
    { reason:  { key: 'reason', val: '', open: false, name: 'Reason', items: reasons, type: 'drop'  }},

    { other: { key: 'other', val: '', open: false, name: 'Other Reason', items: [], type: 'text' } },
    
    { make:    { key: 'make', val: '',          open: false, name: 'Make', items: [], type: 'drop'  } },
    
    { model:   { key: 'model', val: '',          open: false, name: 'Model', items: [], type: 'drop'  } },
    
    { color:   { key: 'color', val: '',          open: false, name: 'Color',           items: carColorItems, type: 'drop'  } },
    
    { plate:   { key: 'plate_num', val: '',   open: false, name: 'Plate', items: [], type: 'text'  } },
  ]


  const [formData, setFormData] = useState(formDefault);

const pullMakes = async () => {
  const res = await getMakes() 
  let map = res?.map((r) => (
    {label: r.name, value: r.name}
  ))

  updateField('Make', 'items', map)
}

const pullModels = async (make) => {

    let { data: models, error } = await supabase
        .from('models')
        .select("*")
        .eq('make', make)

        let array = models?.map((m) => ({
            label: m.name, 
            value: m.name
        }))

        updateField('Model', 'items', array)

}


  useEffect(() => {
    pullMakes()
    getReasons()
  }, [])


  const getFieldByName = (data, name) => {
    const wrapper = data.find(w => {
      const field = Object.values(w)[0];
      return field.name === name;
    });
    return wrapper ? Object.values(wrapper)[0] : null;
  };

  // update inner field object by display name
  const updateField = (name, key, value) => {
    setFormData(prev =>
      prev.map(wrapper => {
        const [fieldKey, fieldVal] = Object.entries(wrapper)[0];
        if (fieldVal.name === name) {
          return {
            [fieldKey]: { ...fieldVal, [key]: value },
          };
        }
        return wrapper;
      })
    );
  };

  useEffect(() => {
    const loadPlateSheet = async () => {
      try {
        const res = await fetch(SHEET_URL);
        const text = await res.text();
        const parsed = Papa.parse(text, { skipEmptyLines: true });
        setPltRows(parsed.data);
      } catch (e) {
        console.error('Error loading plate sheet', e);
      }
    };

    loadPlateSheet();

  }, []);

  useEffect(() => {
    const loadTicketSheet = async () => {
      try {
        const res = await fetch(TICKETS_SHEET_URL);
        const text = await res.text();
        const parsed = Papa.parse(text, { skipEmptyLines: true });
        setTickRows(parsed.data);
      } catch (e) {
        console.error('Error loading ticket sheet', e);
      }
    };

    loadTicketSheet();
  }, []);

  // populate Reason + Color options from plate sheet
  useEffect(() => {
    if (!pltRows || pltRows.length < 2) return;

    const header = pltRows[0];
    const body = pltRows.slice(1);

    const reasonColIndex = header.indexOf('Reason');
    const colorColIndex  = header.indexOf('Color');

    if (reasonColIndex !== -1) {
      const reasonItems = body
        .map(r => r[reasonColIndex])
        .filter(Boolean)
        .map(val => ({
          label: String(val),
          value: String(val),
        }));

      updateField('Reason', 'items', reasonItems);
    }

    if (colorColIndex !== -1) {
      const colorItems = body
        .map(r => r[colorColIndex])
        .filter(Boolean)
        .map(val => ({
          label: String(val),
          value: String(val),
        }));

      updateField('Color', 'items', colorItems);
    }
  }, [pltRows]);

  const plateLookup = (plt) => {
    if (!pltRows) return;

    // adjust index 16/5/4/0 as needed
    const foundPlt = pltRows.find(p => p[16] === plt);
    // console.log(foundPlt);

    if (foundPlt) {
      updateField('Student', 'val', `${foundPlt[5]} ${foundPlt[4]}`);
      updateField('Tag', 'val', `${foundPlt[0]}`);
    } else {
      updateField('Student', 'val', '');
      updateField('Tag', 'val', '');
    }
  };

const formatDate = (d) =>
    d.toLocaleDateString('en-US'); // e.g. 12/01/2025

  const formatTime = (d) =>
    d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }); // e.g. 08:15 PM

const onChange = (event, selectedDate) => {
  // On iOS when cancelling, event can be "dismissed"
  if (event?.type === 'dismissed') {
    return;
  }

  const currentDate = selectedDate || date || new Date();
  setDate(currentDate);

  setFormData(prev =>
    prev.map(entry => {
      const key = Object.keys(entry)[0];
      const field = entry[key];

      if (field.name === 'Date') {
        return {
          [key]: {
            ...field,
            val: formatDate(currentDate),
          },
        };
      }

      if (field.name === 'Time') {
        return {
          [key]: {
            ...field,
            val: formatTime(currentDate),
          },
        };
      }

      return entry;
    })
  );
};


useEffect(() => {
  setFormData(prev =>
    prev.map(entry => {
      const key = Object.keys(entry)[0];
      const field = entry[key];

      if (field.name === 'Date') {
        return {
          [key]: {
            ...field,
            val: formatDate(date),
          },
        };
      }

      if (field.name === 'Time') {
        return {
          [key]: {
            ...field,
            val: formatTime(date),
          },
        };
      }

      return entry;
    })
  );
}, []); // run once on mount

    // 🔹 Handle Make → Models
useEffect(() => {
  const makeField  = getFieldByName(formData, "Make");
  const modelField = getFieldByName(formData, "Model");

  if (makeField?.val && (!modelField?.items || modelField.items.length === 0)) {
    pullModels(makeField.val);
  }
}, [formData]);

// 🔹 Handle Reason → Other Reason visibility & clearing
useEffect(() => {
  const reasField  = getFieldByName(formData, "Reason");
  const otherField = getFieldByName(formData, "Other Reason");

  if (reasField?.val === "Other") {
    if (!otherReason) {
      SetOtherReason(true);
    }
  } else {
    if (otherReason) {
      SetOtherReason(false);
    }
    // Only clear if there's actually text, to avoid infinite updates
    if (otherField?.val) {
      updateField("Other Reason", "val", "");
    }
  }
}, [formData, otherReason]);

const addNewReason = async () => {

    const { data, error } = await supabase
        .from('reasons')
        .insert([
            { label: newReason, value: newReason },
        ])
        .select()
        updateField("Reason", "val", newReason)
        setNewReason(null)

        getReasons()
          
}

  return (
    <SafeAreaView>
    <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={200}>

    <ScrollView>
    <View style={styles.container}>
        <Image style={{width: '100%', flex: 1, position: 'absolute', opacity: 0.4, zIndex: -1, resizeMode: 'contain', top: '-20%', left: 0}} source={require('../assets/DRHS_Logo.png')}/>
        <Text>Date: </Text>
        <DateTimePicker
          value={date || new Date()}
          mode="datetime"
          display="default"
          onChange={onChange}
        />


      {formData.map((wrapper, i) => {
          const fObj = Object.values(wrapper)[0];
          
          if (fObj.name === 'Date' || fObj.name === 'Time') {
              return null;
            }
            
            const isDrop = fObj.type === 'drop';
            const isNone = fObj.type === 'none';
            
            let rowZIndex = (formData.length - i) * 500;
            if (fObj.name === activeDropdown) {
                rowZIndex = 999999;
            }
            
            
            let reqIcon = (<FontAwesome 
                name='asterisk'
                type='font-awesome'
                color='#f50'
                size={10}
                style={{position: 'relative', top: 0, left: 0}}
                />)
                
                return (
                    <View
                    key={fObj.name}
                    style={{
                        width: '100%',
                        flexDirection: 'column',
                        marginBottom: 0,
                        zIndex: rowZIndex,
                        position: 'relative',
                    }}
                    >
            {!isNone && !isDrop && fObj.name !== 'Plate' && fObj.name !== 'Other Reason' && (
                <View style={{flexDirection: 'row', alignItems: 'center', width: '80%', height: 50}}> 
                <Text style={{ width: '100%', marginBottom: 0, fontSize: FONT_SIZE}}>
                  {`${fObj.name}: ${fObj.val ?? ''}`}
                </Text>
              </View>
            )}

            {fObj.name === 'Other Reason' && otherReason && (
                <View
                style={{
                    paddingVertical: 10,
                    width: '50%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                }}
                >
                    <Text style={{ fontSize: FONT_SIZE }}>Other reason: </Text>
                    <View style={{ width: '80%', justifyContent: 'space-evenly', alignItems: 'center' }}>
                    <TextInput
                        style={{
                            width: '100%',
                            fontSize: FONT_SIZE,
                            textAlign: 'left',
                            height: 40,
                            backgroundColor: 'whitesmoke',
                            paddingHorizontal: 8,
                        }}
                        value={newReason}
                        onChangeText={(text) => setNewReason(text)}
                        />
                    </View>
                    <TouchableOpacity onPress={addNewReason}>
                        <Text style={{fontSize: FONT_SIZE, marginHorizontal: 10, color: 'blue'}}>Add reason?</Text>
                    </TouchableOpacity>
                </View>
                )}

            {isDrop && (
                <View style={{flexDirection: 'row', alignItems: 'center', width: '80%', height: 50}}> 
                <View style={{minWidth: 10}}>
                    {!fObj.val && reqIcon}
                </View>
                <View style={{justifyContent: 'flex-start', width: '100%'}}>
                    <Text style={{ width: '100%', marginBottom: 0, fontSize: FONT_SIZE, fontWeight: 800}}>
                    {`${fObj.name}: ${fObj.val ?? ''}`}
                    </Text>
                </View>
                <TouchableOpacity onPress={() => {
                    if(showDrop !== fObj.name){
                        setShowDrop(fObj.name)
                    } else {
                        setShowDrop(null)
                    }
                }}>
                  <Text style={{fontSize: FONT_SIZE, marginHorizontal: 10, color: 'blue'}}>{
                      showDrop === fObj.name ? 'Close' : 'Change'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {isDrop && showDrop === fObj.name && ( 
                <DropDownPicker
                key={formData[fObj.name]}
                theme="DARK"
                listMode="SCROLLVIEW"
                scrollViewProps={{
                    nestedScrollEnabled: true,
                }}
                dropDownDirection="BOTTOM"
                open={fObj.open}
                value={fObj.val}
                items={fObj.items}
                onOpen={() => {
                    setActiveDropdown(fObj.name);
                }}
                onClose={() => {
                    if (activeDropdown === fObj.name) {
                        setActiveDropdown(null);
                    }
                }}
                setOpen={(open) => {
                    updateField(fObj.name, "open", open);
                    if (open) {
                        setActiveDropdown(fObj.name);
                    } else if (activeDropdown === fObj.name) {
                        setActiveDropdown(null);
                    }
                }}
                setValue={(valueOrCallback) => {
                  setFormData(prev =>
                    prev.map(entry => {
                      const key = Object.keys(entry)[0];
                      const field = entry[key];

                      if (field.name !== fObj.name) return entry;

                      const currentValue = field.val;
                      const newValue =
                        typeof valueOrCallback === 'function'
                          ? valueOrCallback(currentValue)
                          : valueOrCallback;

                      return {
                        [key]: {
                          ...field,
                          val: newValue,
                        },
                      };
                    })
                  );
                }}

                onSelectItem={() => {
                    setShowDrop(null)
                }}
                textStyle={{
                    fontSize: FONT_SIZE,
                    color: "whitesmoke",
                }}
                zIndex={rowZIndex}
                zIndexInverse={0}
                dropDownContainerStyle={{
                    zIndex: rowZIndex,
                    elevation: rowZIndex,
                }}
                containerStyle={{
                    zIndex: rowZIndex,
                    elevation: rowZIndex,
                }}
                />
            )}

            {fObj.name === 'Plate' && (
                <View
                style={{
                    paddingVertical: 10,
                    width: '80%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start'
                }}
                >
                <Text style={{fontSize: FONT_SIZE}}>License plate: </Text>
                <View style={{width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                    <TextInput
                    style={{ width: '50%', fontSize: FONT_SIZE, textAlign: 'center', height: 30, backgroundColor: 'whitesmoke',}}
                    value={String(fObj.val ?? '')}
                    onChangeText={(text) =>
                        updateField(fObj.name, 'val', text)
                    }
                    onBlur={() => {
                        if (fObj.name === 'Plate') {
                            plateLookup(fObj.val);
                        }
                    }}
                    />
                </View>
              </View>
            )}

            {isNone && (
                <View style={{flexDirection: 'row', marginTop: 10}}>
                <Text style={{ width: '100%', marginBottom: 8, fontSize: FONT_SIZE}}>
                  {`${fObj.name}: ${fObj.val ?? ''}`}
                </Text>
              </View>
            )}
          </View>
        );
    })}

    <View style={{width: '100%', alignItems: 'center'}}>
        <TouchableOpacity style={styles.button} onPress={() => setAddPhoto(prev => !prev)}>
            <Text style={{fontSize: FONT_SIZE, textAlign: 'center'}}>Add photo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, {marginVertical: 50}]} 
        onPress={() => compilePayload()}
        >
            <Text style={{fontSize: FONT_SIZE, textAlign: 'center'}}>Submit</Text>
        </TouchableOpacity>
    </View>

      <Modal
        visible={!!addPhoto}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setAddPhoto(false)}
        >
        <View style={styles.modalContainer}>
          <Camera
            onPictureTaken={(photo) => {
                console.log('Got photo in parent:', photo.uri);
                
                setAddPhoto(false);
            }}
            onClose={() => setAddPhoto(false)}
            />

          <View style={styles.controls}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: 'crimson' }]}
              onPress={() => setAddPhoto(false)}
              >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
    </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default InputForm;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 5,
    justifyContent: 'flex-start',
    height: '100%', 
    backgroundColor: '#ffffff7a',
  },
  button: {
    width: '33%',
    backgroundColor: 'lightblue',
    borderRadius: 20,
    elevation: 2,
    shadowColor: 'gray',
    shadowOffset: [5,2],
    shadowOpacity: 0.8,
    height: 40,
    justifyContent: 'center'
  },
  modalContainer: {
    height: '95%',
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20
  },
});