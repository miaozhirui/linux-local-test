/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View
} from 'react-native';

class demo2 extends Component {

  static defaultProps = {
    name: 'miaozhirui',
    age: 100
  }

  constructor(props) {
    super(props);
  
    this.state = {
      state1: '我是state1',
      state2: '我是state2'
    };
  }
  handle = () => {
    console.log(this.state.state1);

  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome} onPress={this.handle}>
          Welcome to React Native!
          hellow a !
          {this.props.name}{this.props.age}{'\n'}
          {this.state.state1} {this.state.state2}
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.ios.js

        </Text>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('demo2', () => demo2);
