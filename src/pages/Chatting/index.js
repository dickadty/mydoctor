import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ChatItem, Header, InputChat } from '../../components';
import { colors, fonts } from '../../utils';

const Chatting = ({navigation,route}) => {
  const doctor = route.params;
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
        <Text style={styles.chatDate}>Senin, 21 Maret 2020</Text>
        <ChatItem
          isMe
          text={'Ibu dokter, apakah memakanjeruk tiap hari itu buruk?'}
          date={'4.20 AM'}
        />
        <ChatItem
          date={'4.45 AM'}
          text={'Oh tentu saja tidak karena jeruk itu sangat sehat...'}
          photo={{uri: doctor.photo}}
        />
      </View>
      <InputChat />
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
