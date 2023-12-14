import moment from "moment";
import { useEffect, useState } from "react";
import {View, Text, StyleSheet, TouchableOpacity } from "react-native";

type Props = {
  name: string;
  time: number;
  remove: () => void;
}

const Timer = (props : Props) => {
  const [timeRemaining, setTimeRemaining] = useState(props.time)
  let backgroundStyle = timeRemaining == 0 ? styles.itemStopped : styles.itemRunning

  useEffect(() => {
    if (timeRemaining > 0) {
      setTimeout(() => {
        setTimeRemaining((prevTime) => prevTime -1)
      }, 1000 * 60)
    } 
  }, [timeRemaining]);

  return (
    <TouchableOpacity style={[styles.item, backgroundStyle]} onLongPress={props.remove}>
      <Text style={styles.itemText}>{props.name}</Text>
      <Text style={styles.itemText}>{moment.utc(timeRemaining * 1000 * 60).format('HH:mm')}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16
  },
  itemRunning: {
    backgroundColor: '#5fc268',
  },
  itemStopped: {
    backgroundColor: '#EB3326',
  },
  itemText: {
    fontSize: 30,
    fontWeight: '600',
    color: '#fff'
  },
})

export default Timer;