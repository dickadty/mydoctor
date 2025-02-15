import {onValue, push, ref, set} from 'firebase/database';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ChatItem, Header, InputChat} from '../../components';
import {db} from '../../config';
import {colors, fonts, getChatTime, getData, setDateChat} from '../../utils';
import {ScrollView} from 'react-native-gesture-handler';

const Chatting = ({navigation, route}) => {
  const doctor = route.params;
  const [chatContent, setChatContent] = useState('');
  const [user, setUser] = useState({});
  const [chatData, setChatData] = useState([]);

  useEffect(() => {
    getUserData();
    if (user?.uid && doctor?.uid) {
      const chatID = `${user.uid}_${doctor.uid}`;
      const chatRef = ref(db, `chatting/${chatID}/allChat/`);

      onValue(
        chatRef,
        snapshot => {
          if (snapshot.exists()) {
            const dataSnapshot = snapshot.val();
            const allDataChat = [];

            Object.keys(dataSnapshot).map(key => {
              const dataChat = dataSnapshot[key];
              const newDataChat = [];

              Object.keys(dataChat).map(itemChat => {
                newDataChat.push({
                  id: itemChat,
                  data: dataChat[itemChat],
                });
              });
              allDataChat.push({
                id: key,
                data: newDataChat,
              });
            });
            setChatData(allDataChat);
            console.log('data chat:', allDataChat);
          } else {
            console.log('Belum ada chat');
          }
        },
        {
          onlyOnce: false,
        },
      );
    }
  }, [doctor.uid, user.uid]);

  const getUserData = () => {
    getData('user').then(res => {
      setUser(res);
    });
  };

  const sendChat = () => {
    const day = new Date();

    const data = {
      sendBy: user.uid,
      chatContent: chatContent,
      chatDate: day.getTime(),
      chatTime: getChatTime(day),
    };
    const chatID = `${user.uid}_${doctor.uid}`;
    const chatRef = ref(db, `chatting/${chatID}/allChat/${setDateChat(day)}`);
    const messageUserRef = ref(db, `messages/${user.uid}/${chatID}`);
    const messageDoctorRef = ref(db, `messages/${doctor.uid}/${chatID}`);
    const dataHistoryChatForUser = {
      lastContentChat: chatContent,
      lastChatDate: day.getTime(),
      uidPartner: doctor.uid,
    };
    const dataHistoryChatForDoctor = {
      lastContentChat: chatContent,
      lastChatDate: day.getTime(),
      uidPartner: user.uid,
    };
    push(chatRef, data)
      .then(() => {
        setChatContent('');

        set(messageUserRef, dataHistoryChatForUser)
          .then(() => {
            console.log('History chat for user updated');
          })
          .catch(error => {
            console.error('Error setting history chat for user:', error);
          });
        set(messageDoctorRef, dataHistoryChatForDoctor)
          .then(() => {
            console.log('History chat for doctor updated');
          })
          .catch(error => {
            console.error('Error setting history chat for doctor:', error);
          });
      })
      .catch(error => {
        console.error('Error sending chat:', error);
      });
  };

  return (
    <View style={styles.page}>
      <Header
        type="dark-profile"
        title={doctor.fullName}
        name={doctor.fullName}
        desc={doctor.profession}
        photo={{uri: doctor.photo}}
        onPress={() => navigation.goBack()}
      />

      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {chatData.map(chat => {
            return (
              <View key={chat.id}>
                <Text style={styles.chatDate}>{String(chat.id)}</Text>
                {chat.data.map(itemChat => {
                  const isMe = itemChat.data.sendBy === user.uid;
                  return (
                    <ChatItem
                      key={itemChat.id}
                      isMe={isMe}
                      text={itemChat.data.chatContent}
                      date={itemChat.data.chatTime}
                      photo={isMe ? null : {uri: doctor.photo}}
                    />
                  );
                })}
              </View>
            );
          })}
        </ScrollView>
      </View>
      <InputChat
        value={chatContent}
        onChangeText={value => setChatContent(value)}
        onButtonPress={sendChat}
        targetChat={doctor}
      />
    </View>
  );
};

export default Chatting;

const styles = StyleSheet.create({
  page: {backgroundColor: colors.white, flex: 1},
  content: {flex: 1},
  chatDate: {
    fontSize: 11,
    fontFamily: fonts.primary.normal,
    color: colors.text.secondary,
    marginVertical: 20,
    textAlign: 'center',
  },
});
