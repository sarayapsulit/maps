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

let lat =  40.706632;
let long = -74.009189;
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
      snappedPoints: [],
      origins: [],
      routes: [],
      pics: ['./assets/ghost1.png', './assets/ghost2.png', './assets/ghost3.png', './assets/ghost4.png']
    };
  }

  componentDidMount(){

    axios.get('https://roads.googleapis.com/v1/nearestRoads?points=' + coords.join("|") + '&key=AIzaSyCEiZCzxSsSbW6iUj3DapE6f76XKCREKp8')
    .then((response) => {

      var origins = response.data.snappedPoints.slice(0,6)

      this.setState({snappedPoints: response.data.snappedPoints, origins: origins })



      let promises = this.state.origins.map((origin)=> {

        let index = Math.floor( (Math.random() * this.state.snappedPoints.length ) + 1 )
        let { latitude, longitude } = this.state.snappedPoints[index].location
        let wayPoints = []
debugger
        for (var i = 0; i < 20; i++) {
          let n = Math.floor( (Math.random() * this.state.snappedPoints.length ) + 1 )
           n === index || n === 0 ?  n = n + 1 : n
           wayPoints.push( this.state.snappedPoints[n].location.latitude + "," + this.state.snappedPoints[n].location.longitude)
         }


      return  (axios.get('https://maps.googleapis.com/maps/api/directions/json?origin=' + origin.location.latitude + ',' + origin.location.longitude + '&destination=' + latitude + ',' + longitude + '&waypoints=' + wayPoints.join("|") + '&mode=walking&key=AIzaSyCEiZCzxSsSbW6iUj3DapE6f76XKCREKp8' ))
      })

      let routes = []

      Promise.all(promises)
      .then((responses) => {
        responses.map((response)=>{
          let targets = [];
          response.data.routes[0].legs.forEach( function ( leg ) {
            leg.steps.forEach( function ( step ){
               targets.push( step.end_location )
            })
          });
          routes.push(targets)
          this.setState({routes: routes})
          console.log(routes)
        })
      })
    })
  }


  render() {
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
                  {  this.state.snappedPoints.map((coord, i) => {
                    return <MapView.Marker key={i} coordinate={coord.location} image={require('./assets/yellow.png')}  />
                  })}

                  { this.state.origins.length === this.state.routes.length ? this.state.routes.map((route, i) => {
                    return <Ghost key={i}  route={route} origin={this.state.origins[i]} id={i} pic={this.state.pics[i]} />
                  }) : null
              }
            </MapView>
          </View>
        </View>
      );
    }

  }



// <-------------STYLES----------->
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
