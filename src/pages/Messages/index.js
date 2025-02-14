import {onValue, ref, get} from 'firebase/database';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {List} from '../../components';
import {db} from '../../config';
import {colors, fonts, getData} from '../../utils';

const Messages = ({navigation}) => {
  const [user, setUser] = useState({});
  const [historyChat, setHistoryChat] = useState([]);

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    if (!user?.uid) return;

    const urlHistory = `messages/${user.uid}/`;
    const messagesDB = ref(db, urlHistory);

    onValue(messagesDB, async snapshot => {
      if (snapshot.exists()) {
        const oldData = snapshot.val();
        const data = [];

        const promises = Object.keys(oldData).map(async key => {
          const uidPartner = oldData[key].uidPartner;
          const doctorRef = ref(db, `doctors/${uidPartner}`);

          try {
            const doctorSnap = await get(doctorRef);
            if (doctorSnap.exists()) {
              const doctorData = doctorSnap.val();
              data.push({
                id: key,
                dataDoctor: {...doctorData, uid: uidPartner},
                ...oldData[key],
              });
            }
          } catch (error) {
            console.error('Error fetching doctor data:', error);
          }
        });

        await Promise.all(promises);
        setHistoryChat(data);
      } else {
        setHistoryChat([]);
      }
    });
  }, [user?.uid]);

  const getUserData = async () => {
    const res = await getData('user');
    if (res) {
      setUser(res);
    }
  };

  return (
    <View style={styles.page}>
      <View style={styles.content}>
        <Text style={styles.title}>Messages</Text>
        {historyChat.map(chat => {
          const doctor = chat.dataDoctor; // Pastikan `doctor` memiliki struktur yang benar
          return (
            <List
              key={chat.id}
              profile={{uri: doctor.photo}}
              name={doctor.fullName}
              desc={
                chat.lastContentChat
                  ? String(chat.lastContentChat)
                  : 'No message'
              }
              onPress={() => navigation.navigate('Chatting', doctor)} // Kirim data dokter yang benar
            />
          );
        })}
      </View>
    </View>
  );
};

export default Messages;

const styles = StyleSheet.create({
  page: {backgroundColor: colors.secondary, flex: 1},
  content: {
    backgroundColor: colors.white,
    flex: 1,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: fonts.primary[600],
    color: colors.text.primary,
    marginTop: 30,
    marginLeft: 16,
  },
});
