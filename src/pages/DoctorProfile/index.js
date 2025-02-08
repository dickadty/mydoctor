import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Header, Profile, ProfileItem, Gap} from '../../components';
import {colors} from '../../utils';
import {DummyDoctor10} from '../../assets';

const DoctorProfile = ({navigation}) => {
  return (
    <View style={styles.page}>
      <Header title="Doctor Profile" onPress={() => navigation.goBack()} />
      <Profile
        name={'Nairobi Putri Hayza'}
        desc={'Dokter Anak'}
        photo={DummyDoctor10}
      />
      <Gap height={10} />
      <ProfileItem label="Alumnus" value={'Universits Indonesia, 2022'} />
      <ProfileItem label="Tempat Praktik" value={'Rumah Sakit Umum, Bandung'} />
      <ProfileItem label="No. STR" value={'0000116622081996'} />
      <View style={styles.action}>
        <Button
          title="Start Consultation"
          onPress={() => navigation.navigate('Chatting')}
        />
      </View>
    </View>
  );
};

export default DoctorProfile;

const styles = StyleSheet.create({
  page: {backgroundColor: colors.white, flex: 1},
  action: {paddingHorizontal: 40, paddingTop: 23},
});
