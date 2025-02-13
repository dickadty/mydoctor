import {
  get,
  limitToLast,
  onValue,
  orderByChild,
  query,
  ref,
} from 'firebase/database';
import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {ILNullPhoto} from '../../assets';
import {
  DoctorCategory,
  Gap,
  HomeProfile,
  NewsItem,
  RatedDoctor,
} from '../../components';
import {db} from '../../config';
import {colors, fonts, getData, showError} from '../../utils';

const Doctor = ({navigation}) => {
  const [profile, setProfile] = useState({
    fullName: '',
    profession: '',
    photo: ILNullPhoto,
  });
  const [news, setNews] = useState([]);
  const [categoryDoctor, setCategoryDoctor] = useState([]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    getUserData();
    getNews();
    getCategoryDoctor();
    getTopRatedDoctor();
    const unsubscribe = navigation.addListener('focus', () => {
      getUserData();
    });
    return unsubscribe;
  }, [navigation]);

  const getNews = () => {
    const newsRef = ref(db, 'news/');
    onValue(
      newsRef,
      snapshot => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const filterData = data.filter(el => el !== null);
          const parseArray = Object.keys(filterData).map(key => ({
            id: key,
            ...filterData[key],
          }));
          setNews(parseArray);
        } else {
          setNews([]);
        }
      },
      error => {
        console.error('Error fetching news:', error);
      },
    );
  };

  const getCategoryDoctor = () => {
    const categoryDoctorRef = ref(db, 'category_doctor/');
    onValue(
      categoryDoctorRef,
      snapshot => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const filterData = data.filter(el => el !== null);
          const parseArray = Object.keys(filterData).map(key => ({
            id: key,
            ...filterData[key],
          }));
          setCategoryDoctor(parseArray);
        } else {
          setCategoryDoctor([]);
        }
      },
      error => {
        console.error('Error fetching category doctor:', error);
      },
    );
  };

  const getTopRatedDoctor = async () => {
    try {
      const topRatedDoctorRef = query(
        ref(db, 'doctors'),
        orderByChild('rate'),
        limitToLast(3),
      );
      const snapshot = await get(topRatedDoctorRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const parseArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
        }));
        setDoctors(parseArray);
      } else {
        console.log('Tidak ada data dokter.');
        setDoctors([]);
      }
    } catch (err) {
      console.error('Error:', err.message);
      showError(err.message);
    }
  };

  const getUserData = () => {
    getData('user').then(res => {
      if (res) {
        setProfile({
          ...res,
          photo: typeof res.photo === 'string' ? {uri: res.photo} : ILNullPhoto,
        });
      }
    });
  };

  return (
    <View style={styles.page}>
      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.wrapperSection}>
            <Gap height={30} />
            <HomeProfile
              profile={profile}
              onPress={() => navigation.navigate('UserProfile', profile)}
            />
            <Text style={styles.welcome}>
              Mau konsultasi dengan siapa hari ini?
            </Text>
          </View>
          <View style={styles.wrapperScroll}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.category}>
                <Gap width={32} />
                {categoryDoctor.map(item => (
                  <DoctorCategory
                    key={`category${item.id}`}
                    category={item.category}
                    onPress={() => navigation.navigate('ChooseDoctor', item)}
                  />
                ))}
                <Gap width={22} />
              </View>
            </ScrollView>
          </View>
          <View style={styles.wrapperSection}>
            <Text style={styles.sectionLabelTopRate}>Top Rated Doctors</Text>
            {doctors.map(doctor => (
              <RatedDoctor
                key={doctor.id}
                name={doctor.fullName}
                desc={doctor.profession}
                avatar={{uri: doctor.photo}}
                onPress={() => navigation.navigate('DoctorProfile', doctor)}
              />
            ))}
            <Text style={styles.sectionLabelNews}>Good News</Text>
          </View>
          {news.map(item => (
            <NewsItem
              key={`news-${item.id}`}
              title={item.title}
              date={item.date}
              image={item.image}
            />
          ))}
          <Gap height={10} />
        </ScrollView>
      </View>
    </View>
  );
};

export default Doctor;

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.secondary,
    flex: 1,
  },
  content: {
    backgroundColor: colors.white,
    flex: 1,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  wrapperSection: {paddingHorizontal: 16},
  welcome: {
    fontSize: 20,
    fontFamily: fonts.primary[600],
    color: colors.text.primary,
    marginTop: 30,
    marginBottom: 16,
    maxWidth: 209,
  },
  category: {flexDirection: 'row'},
  wrapperScroll: {marginHorizontal: -16},
  sectionLabelNews: {
    fontSize: 16,
    fontFamily: fonts.primary[600],
    color: colors.text.primary,
    marginTop: 20,
    marginBottom: 10,
  },

  sectionLabelTopRate: {
    fontSize: 16,
    fontFamily: fonts.primary[600],
    color: colors.text.primary,
    marginTop: 30,
    marginBottom: 30,
  },
  noNews: {
    textAlign: 'center',
    color: colors.text.secondary,
    fontSize: 14,
    fontFamily: fonts.primary[400],
    marginTop: 10,
  },
});
