import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Header, List} from '../../components';
import {colors} from '../../utils';
import {DummyDoctor4, DummyDoctor6, DummyDoctor5} from '../../assets';

const ChooseDoctor = ({navigation, route}) => {
  return (
    <View style={styles.page}>
      <Header
        type="dark"
        title={'Pilih Dokter Anak'}
        onPress={() => navigation.goBack()}
      />
      <List
        name={'Alexander Jannie'}
        profile={DummyDoctor4}
        desc={'Wanita'}
        type={'next'}
      />
      <List
        name={'John McParker Seve'}
        profile={DummyDoctor5}
        desc={'Pria'}
        type={'next'}
      />
      <List
        name={'Nairobi Putri Hayza'}
        profile={DummyDoctor6}
        desc={'Wanita'}
        type={'next'}
      />
    </View>
  );
};

export default ChooseDoctor;

const styles = StyleSheet.create({
  page: {backgroundColor: colors.white, flex: 1},
});
