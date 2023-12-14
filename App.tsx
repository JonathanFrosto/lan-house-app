import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Timer from './components/Timer';
import { useState } from 'react';
import * as Notifications from 'expo-notifications';

type Timer = {
  name: string;
  time: number;
  notificationId: string;
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  const [name, setNameValue] = useState<string>('');
  const [time, setTimeValue] = useState<string>('');
  const [timers, setTimers] = useState<Timer[]>([]);

  const handleSubmit = async () => {
    const timeAsNumber = parseInt(time);

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Tempo acabou!",
        body: `Tempo de ${name} acabou.`
      },
      trigger: {
        seconds: timeAsNumber * 60
      }
    })

    setTimers([...timers, { name, time: timeAsNumber, notificationId }])
    setNameValue('')
    setTimeValue('')
  }

  const removeTimer = async (notificationId: string, index: number) => {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    setTimers(timers.filter((timer, currentIndex) => currentIndex !== index))
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style='inverted' />
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            value={name}
            onChangeText={setNameValue}
            style={[styles.input, { flex: 1 }]}
            placeholder='NOME CLIENTE'
            placeholderTextColor='#fff'
          />
          <TextInput
            value={time}
            onChangeText={setTimeValue}
            style={[styles.input, { marginLeft: 10 }]}
            keyboardType='numeric'
            placeholder='TEMPO'
            placeholderTextColor='#fff'
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSubmit} >
          <Text style={styles.buttonText}>ADICIONAR</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.listContainer}>
        {
          timers.map((timer, index) => <Timer key={index} name={timer.name} time={timer.time} remove={() => removeTimer(timer.notificationId, index)} />).reverse()
        }
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 40
  },
  listContainer: {
    paddingVertical: 0,
    paddingHorizontal: 16,
    flex: 1,
    marginBottom: 10
  },

  formContainer: {
    backgroundColor: '#1f1e25',
    width: '100%',
    padding: '4%',
  },
  button: {
    marginTop: 16,
    backgroundColor: '#5fc268',
    height: 60,
    justifyContent: 'center'
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18
  },
  inputContainer: {
    flexDirection: 'row',
  },
  input: {
    height: 60,
    color: '#fff',
    fontSize: 18,
    backgroundColor: '#2e2d33',
    padding: 16
  }
});
