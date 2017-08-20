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
import axios from 'react-native-axios'




let lat =  40.706549;
let long = -74.009032;
let latd = 0.0070;
let longd = 0.0071;

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
let key = AIzaSyCEiZCzxSsSbW6iUj3DapE6f76XKCREKp8
for (var i = 0; i < 100; i++) {
 coords.push(((Math.random()* latd) + minlat)+","+((Math.random()* longd) + minlong) );
}


export default class maps extends Component {
  constructor() {
    super();
    this.state = {
    points: [],
    ghost: {latitude: 0, longitude: 0},
    targets: [],
    target: {lat: 0, long: 0}
    };

  }

  componentWillMount(){
    axios.get('https://roads.googleapis.com/v1/nearestRoads?points='+coords.join("|")+'&key='key)
    .then((response)=>{
      this.setState({points: response.data.snappedPoints, ghost:  response.data.snappedPoints[0].location})
      }
    )
    let i = Math.floor((Math.random()*this.state.points.length) + 1 )
    let {latitude, longitude} = i < this.state.points.length ? this.state.points[i] : {}
    // axios.get('https://maps.googleapis.com/maps/api/directions/json?origin='+this.state.ghost.latitude,this.state.longitude+'&destination='+latitude,longitude+'&mode=walking&key='key)
    .then((response)=> {
      this.setState({targets: response.data.routes.legs.steps})
    }
    )

    this.setState({target: this.state.targets[0].end_location})
    this.setState({ghost: {latitude: 40.742910, longitude: -73.992784}})
  }

  findLongitude = (newLat, xa, ya, xb, yb ) => {
     var slope = (yb-ya)/(xb-xa)
    return (slope * (newLat- xa)) + ya
  }

 changeCoords = ()=>{
    let {lat, long} = this.state.target ? this.state.target : {};
    let {latitude, longitude} = this.state.ghost ? this.state.ghost : {};
    let factor;
    latitude > lat ? factor = -1 : factor = 1;

    let newLatitude = latitude + (0.0001* factor);
    let newLongitude = this.findLongitude(newLatitude, latitude, longitude, lat, long)

    this.setState({ghost: {latitude:  newLatitude, longitude: newLongitude }})


  }

componentDidMount(){
   if this.state.ghost === this.state.target
      setInterval(this.changeCoords, 1000)
}

  render() {
    let {latitude, longitude} = this.state.ghost ? this.state.ghost : {};
    return (
      <View style={{flex: 1}}>
        <View style={{ backgroundColor: 'green', height: 100, justifyContent: 'center', alignItems: 'center'}}>
          <Text>{latitude} ,  {longitude}</Text>
        </View>
        <View style={styles.container}>
          <MapView style={styles.map}
            initialRegion={{
                  latitude: lat,
                  longitude: long,
                  latitudeDelta: latd,
                  longitudeDelta: longd,
                }}>
                  {this.state.points.map((coord, i) => {
                    return <MapView.Marker key={i} coordinate={coord.location} image={require('./yellow.png')}  />
                  })}
                  <MapView.Marker coordinate={this.state.ghost} image={require('./ghost.png')} />
            </MapView>
          </View>
        </View>
    );
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
