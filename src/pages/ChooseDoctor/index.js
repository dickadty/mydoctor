import { onValue, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Header, List } from '../../components';
import { db } from '../../config';
import { colors } from '../../utils';

const ChooseDoctor = ({navigation, route}) => {
  const item = route.params;
  const [listDoctor, setListDoctor] = useState([]);

  useEffect(() => {
    getCallDoctorByCategory(item.category);
  }, [item.category]);

  const getCallDoctorByCategory = category => {
    const callDoctorByCategory = ref(db, 'doctors/');
    onValue(callDoctorByCategory, snapshot => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const parseArray = Object.keys(data)
          .filter(key => data[key].category === category)
          .map(key => ({
            id: key,
            ...data[key],
          }));

        setListDoctor(parseArray);
      } else {
        setListDoctor([]);
      }
    });
  };

  return (
    <View style={styles.page}>
      <Header
        type="dark"
        title={`Pilih ${item.category}`}
        onPress={() => navigation.goBack()}
      />
      {listDoctor.map(doctor => (
        <List
          key={doctor.id}
          type="next"
          profile={{uri: doctor.photo}}
          name={doctor.fullName}
          desc={doctor.gender}
          onPress={() => navigation.navigate('DoctorProfile', doctor)}
        />
      ))}
    </View>
  );
};

export default ChooseDoctor;

const styles = StyleSheet.create({
  page: {backgroundColor: colors.white, flex: 1},
});
