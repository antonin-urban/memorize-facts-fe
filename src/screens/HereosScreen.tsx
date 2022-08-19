import { ParamListBase } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useContext, useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import { AppContext } from '../components/AppContext';
import { RouteNames } from '../components/navigations/interfaces';

const { width } = Dimensions.get('window');

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  while (color.length < 7) color += letters[Math.floor(Math.random() * 16)];
  return color;
};

type Props = NativeStackScreenProps<ParamListBase, RouteNames.HeroesScreen>;

export default function HeroesScreen(props: Props) {
  const { db } = useContext(AppContext);
  const [name, setName] = useState('');
  const [heroes, setHeroes] = useState([]);

  useEffect(() => {
    let sub;
    if (db && db.heroes) {
      sub = db.heroes
        .find()
        .sort({ firstName: 'asc' })
        .$.subscribe((rxdbHeroes) => {
          setHeroes(rxdbHeroes);
        });
    }
    return () => {
      if (sub && sub.unsubscribe) sub.unsubscribe();
    };
  }, [db]);

  const addHero = async () => {
    console.log('addHero: ' + name);
    const color = getRandomColor();
    console.log('color: ' + color);
    console.log(db.heroes.upsert);

    try {
      await db.heroes.upsert({
        passportId: uuidv4(),
        firstName: name,
        lastName: 'potter',
        age: 5,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const removeHero = async (hero) => {
    Alert.alert('Delete hero?', `Are you sure you want to delete ${hero.get('firstName')}`, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: async () => {
          const doc = db.heroes.findOne({
            selector: {
              firstName: hero.get('firstName'),
            },
          });
          await doc.remove();
        },
      },
    ]);
  };

  return (
    <View style={styles.topContainer}>
      <StatusBar backgroundColor="#55C7F7" barStyle="light-content" />
      <Text style={styles.title}>React native rxdb example</Text>

      <ScrollView style={styles.heroesList}>
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={(name) => setName(name)}
            placeholder="Type to add a hero..."
            onSubmitEditing={addHero}
          />
          {name.length > 1 && (
            <TouchableOpacity onPress={addHero}>
              <Image style={styles.plusImage} source={require('../../assets/plusIcon.png')} />
            </TouchableOpacity>
          )}
        </View>
        {heroes.length === 0 && <Text>No heroes to display ...</Text>}
        {heroes.map((hero, index) => (
          <View style={styles.card} key={index}>
            <View
              style={[
                styles.colorBadge,
                {
                  backgroundColor: hero.get('color'),
                },
              ]}
            />
            <Text style={styles.heroName}>{hero.get('firstName')}</Text>
            <TouchableOpacity onPress={() => removeHero(hero)} style={styles.alignRight}>
              <Image style={styles.deleteImage} source={require('../../assets/deleteIcon.png')} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <Button testID="btn-navigate" onPress={(): void => props.navigation.navigate('Home')} title="Back home" />
    </View>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    alignItems: 'center',
    backgroundColor: '#55C7F7',
    flex: 1,
  },
  title: {
    marginTop: 55,
    fontSize: 25,
    color: 'white',
    fontWeight: '500',
  },
  heroesList: {
    marginTop: 30,
    borderRadius: 5,
    flex: 1,
    width: width - 30,
    paddingLeft: 15,
    marginHorizontal: 15,
    backgroundColor: 'white',
  },
  plusImage: {
    width: 30,
    height: 30,
    marginRight: 15,
    marginLeft: 'auto',
  },
  deleteImage: {
    width: 30,
    height: 30,
    marginRight: 15,
  },
  alignRight: {
    marginLeft: 'auto',
  },
  input: {
    flex: 1,
    color: '#D2DCE1',
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',

    marginLeft: 12,
    paddingVertical: 15,
    borderBottomColor: '#D2DCE1',
    borderBottomWidth: 0.5,
  },
  colorBadge: {
    height: 30,
    width: 30,
    borderRadius: 15,
    marginRight: 15,
  },
  heroName: {
    fontSize: 18,
    fontWeight: '200',
    marginTop: 3,
  },
});