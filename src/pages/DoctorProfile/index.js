import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Gap, Header, Profile, ProfileItem} from '../../components';
import {colors} from '../../utils';

const DoctorProfile = ({navigation, route}) => {
  const doctor = route.params;
  return (
    <View style={styles.page}>
      <Header title="Doctor Profile" onPress={() => navigation.goBack()} />
      <Profile
        name={doctor.fullName}
        desc={doctor.profession}
        photo={{uri: doctor.photo}}
      />
      <Gap height={10} />
      <ProfileItem label="Alumnus" value={doctor.university} />
      <ProfileItem label="Tempat Praktik" value={doctor.hospital_address} />
      <ProfileItem label="No. STR" value={doctor.str_number} s />
      <View style={styles.action}>
        <Button
          title="Start Consultation"
          onPress={() => navigation.navigate('Chatting', doctor)}
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
