import {createUserWithEmailAndPassword} from 'firebase/auth';
import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Button, Gap, Header, Input} from '../../components';
import {auth, db} from '../../config';
import {colors, showError, showSuccess, useForm, storeData} from '../../utils';
import {set, ref} from 'firebase/database';

const Register = ({navigation}) => {
  const [form, setForm] = useForm({
    fullName: '',
    profession: '',
    email: '',
    password: '',
  });

  const onContinue = () => {
    console.log(form);
    createUserWithEmailAndPassword(auth, form.email, form.password)
      .then(userCredential => {
        console.log('userCredential', userCredential);

        const data = {
          fullName: form.fullName,
          profession: form.profession,
          email: form.email,
          uid: userCredential.user.uid,
        };
        set(ref(db, `users/${userCredential.user.uid}`), data)
          .then(() => {
            showSuccess('Register Success');
            storeData('user', data);
            console.log('success:', storeData);
            setForm('reset');
            navigation.navigate('UploadPhoto', data);
          })
          .catch(error => {
            showError(error.message);
          });
      })
      .catch(error => {
        showError(error.message);
      });
  };

  return (
    <View style={styles.page}>
      <Header onPress={() => navigation.goBack()} title="Daftar Akun" />
      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Input
            label="Full Name"
            value={form.fullName}
            onChangeText={value => setForm('fullName', value)}
          />
          <Gap height={24} />
          <Input
            label="Pekerjaan"
            value={form.profession}
            onChangeText={value => setForm('profession', value)}
          />
          <Gap height={24} />
          <Input
            label="Email"
            value={form.email}
            onChangeText={value => setForm('email', value)}
          />
          <Gap height={24} />
          <Input
            label="Password"
            value={form.password}
            onChangeText={value => setForm('password', value)}
            secureTextEntry
          />
          <Gap height={40} />
          <Button title="Continue" onPress={onContinue} />
        </ScrollView>
      </View>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  page: {backgroundColor: colors.white, flex: 1},
  content: {padding: 40, paddingTop: 0},
});
