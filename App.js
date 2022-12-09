import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  ScrollView,
} from 'react-native';
import axios from 'axios';

const App = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [moreUsersAvailable, setMoreUsersAvailable] = useState(true);

  const getUsers = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('https://api.github.com/gists/public', {
        params: {
          per_page: 30,
          page: currentPage,
        },
      });
      setUsers([...users, ...response.data]);
      if (response.data.lenght < 30) {
        setMoreUsersAvailable(false);
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const renderItem = ({item}) => {
    return (
      <ScrollView style={styles.itemWrapperStyle}>
        <Image
          style={styles.itemImageStyle}
          source={{uri: item.owner.avatar_url}}
        />
        <View style={styles.contentWrapperStyle}>
          <Text style={styles.txtNameStyle}>
            {Object.entries(item.files)[0][1].filename}
          </Text>
        </View>
      </ScrollView>
    );
  };

  const renderLoader = () => {
    return isLoading ? (
      <View style={styles.loaderStyle}>
        <ActivityIndicator size="large" color="#aaa" />
      </View>
    ) : null;
  };

  const loadMoreItem = () => {
    if (moreUsersAvailable) {
      getUsers(currentPage + 1);
      setCurrentPage(currentPage + 1);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <>
      <StatusBar backgroundColor="#000" />
      <FlatList
        data={users}
        renderItem={renderItem}
        //Index is key because I am getting duplicates
        keyExtractor={(item, index) => index.toString()}
        ListFooterComponent={renderLoader}
        onEndReached={loadMoreItem}
        onEndReachedThreshold={0}
      />
    </>
  );
};

const styles = StyleSheet.create({
  itemWrapperStyle: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  itemImageStyle: {
    width: 50,
    height: 50,
    marginRight: 16,
  },
  contentWrapperStyle: {
    justifyContent: 'space-around',
  },
  txtNameStyle: {
    fontSize: 16,
  },
  loaderStyle: {
    marginVertical: 16,
    alignItems: 'center',
  },
});

export default App;
