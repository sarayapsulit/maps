/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import MapView from 'react-native-maps';
import axios from 'react-native-axios';
import Ghost from './ghost.ios.js'

let lat =  40.759057;
let long =  -73.978438;
let latd = 0.010;
let longd = 0.01;

const getMin = (mid, delta) => {
   return( ( (mid * 2) - delta ) / 2 );
 }

const getMax = ( min, delta ) => {
  return  min + delta;
}

let minlat = getMin(lat, latd);
var maxlat = getMax(minlat, latd);
var minlong = getMin(long, longd);
var maxlong = getMax(minlong, longd);

let coords = []

for (var i = 0; i < 100; i++) {
 coords.push(((Math.random()* latd) + minlat)+","+((Math.random()* longd) + minlong) );
}


export default class maps extends Component {
  constructor() {
    super();
    this.state = {
      snappedPoints: [{}],

      pics: ['./assets/ghost1.png', './assets/ghost2.png', './assets/ghost3.png', './assets/ghost4.png']
    };
  }
  componentWillMount(){
  debugger
    axios.get('https://roads.googleapis.com/v1/nearestRoads?points='+coords.join("|")+'&key=AIzaSyCEiZCzxSsSbW6iUj3DapE6f76XKCREKp8')
    .then((response)=>{
      var origins = response.data.snappedPoints.slice(0,4)
      this.setState({snappedPoints: response.data.snappedPoints })
      debugger
        }
      )
    }


  render() {

      debugger
    return (
      <View style={{flex: 1}}>
        <View style={{ backgroundColor: 'green', height: 100, justifyContent: 'center', alignItems: 'center'}}>

        </View>
        <View style={styles.container}>
          <MapView style={styles.map}
            initialRegion={{
                  latitude: lat,
                  longitude: long,
                  latitudeDelta: latd,
                  longitudeDelta: longd,
                }}>
                  {
                    this.state.snappedPoints.map((coord, i) => {
                    return <MapView.Marker key={i} coordinate={coord.location} image={require('./assets/yellow.png')}  />
                  })}

                  {this.state.pics.map((pic, i) => {
                    return <Ghost key={i}  snappedPoints={this.state.snappedPoints} pic={pic} id={i} />
                  })}

            </MapView>
          </View>
        </View>
      );
    }

    componentDidMount(){
      debugger
    }
  }

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    top: 100,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  map: {
     ...StyleSheet.absoluteFillObject,
  },
});






AppRegistry.registerComponent('maps', () => maps);
