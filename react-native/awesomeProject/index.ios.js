/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var MOCKED_MOVIES_DATA = [
  {title: 'Title', year: '2015', posters: {thumbnail: 'http://i.imgur.com/UePbdph.jpg'}}
]
var REQUEST_URL = "https://raw.githubusercontent.com/facebook/react-native/master/docs/MoviesExample.json";

var {
  AppRegistry,
  Image,
  StyleSheet,
  Text,
  View,
  ListView
} = React;


var awesomeProject = React.createClass({
  getInitialState: function() {
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: false,
    };
  },
  componentDidMount: function(){

    this.fetchData();
  },
    fetchData: function() {
    fetch(REQUEST_URL)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(responseData.movies),
          loaded: true,
        });
      })
      .done();
  },

  render: function() {
    if(!this.state.loaded) {
      return this.renderLoadingView();
    }

     return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderMovie}
        style={styles.listView}
      />
    );
  },

  renderLoadingView: function(){
    return (
      <View style={styles.container}>
        <Text>
          Loading movies...
        </Text>
      </View>
    );
  },

  renderMovie: function(movie) {
    return (
      <View style={styles.container}>
        <Image
          source={{uri: movie.posters.thumbnail}}
          style={styles.thumbnail}
        />
        <View style={styles.rightContainer}>
          <Text style={styles.title}>{movie.title}</Text>
          <Text style={styles.year}>{movie.year}</Text>
        </View>
      </View>
    )
  }
});

var styles = StyleSheet.create({

  name: {
    fontSize:30,
    color:'blue',
    marginBottom:30
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  thumbnail:{
    width:53,
    height:81
  },
  rightContainer:{
    flex: 1
  },
  title:{
    fontSize:20,
    marginBottom: 8,
    textAlign: 'center',
    color:'blue'
  },
  year: {
    textAlign: 'center',
    color:'red'
  },
  listView: {
    paddingTop:20,
    backgroundColor:'#F5FCFF'
  }

});













AppRegistry.registerComponent('awesomeProject', () => awesomeProject);
