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
    snappedPoints: [],
    ghost: {latitude: 40, longitude: -73},
    target: {lat: maxlat, lng: maxlong},
    targetCount: 0,
    targets: [],
    targetsList: [],
    targetsListCount: 0,

    };

  }


  componentWillMount(){

    axios.get('https://roads.googleapis.com/v1/nearestRoads?points='+coords.join("|")+'&key=AIzaSyCEiZCzxSsSbW6iUj3DapE6f76XKCREKp8')
    .then((response)=>{

      this.setState({snappedPoints: response.data.snappedPoints, ghost:  response.data.snappedPoints[0].location})

      let index = Math.floor((Math.random()*this.state.snappedPoints.length) + 1 )
      let {latitude, longitude} = this.state.snappedPoints[index].location
      let wayPoints = []
      for (var i = 0; i < 20; i++) {
        let n = Math.floor((Math.random()*this.state.snappedPoints.length) + 1 )
         n === index || n ===0 ?  n = n + 1 : n
         wayPoints.push( (this.state.snappedPoints[n].location.latitude+","+this.state.snappedPoints[n].location.longitude) );
      }
      axios.get('https://maps.googleapis.com/maps/api/directions/json?origin='+this.state.ghost.latitude+','+this.state.ghost.longitude+'&destination='+latitude+','+longitude+'&waypoints='+wayPoints.join("|")+'&mode=walking&key=AIzaSyCEiZCzxSsSbW6iUj3DapE6f76XKCREKp8')
      .then((response)=> {
        let targets = [];
        response.data.routes[0].legs.forEach(function (leg) {
          leg.steps.forEach(function(step){
            targets.push(step.end_location)
              }
            )
          }
        )

        this.setState({targets: targets})
        this.setState({target: this.state.targets[0]})
          }
        )

      }
    )
  }

  findLongitude = (newLat, xa, ya, xb, yb ) => {
     var slope = (yb-ya)/(xb-xa)
    return (slope * (newLat- xa)) + ya
  }

  changeCoords = ()=>{

    let {latitude, longitude} = this.state.ghost ? this.state.ghost : {};
    let {lat, lng} = this.state.target ? this.state.target : {};

    let factor;
    latitude > lat ? factor = -1 : factor = 1;

    let newLatitude = latitude + (0.00005 * factor);
    let newLongitude = this.findLongitude(newLatitude, latitude, longitude, lat, lng)

    this.setState({ghost: {latitude:  newLatitude, longitude: newLongitude }})
  }

  changeTarget = () => {
    let targetCount = this.state.targetCount + 1
    this.setState({targetCount: targetCount })
    this.setState({target: this.state.targets[targetCount] })
  }

  moveGhost = () =>{
    let {latitude, longitude} = this.state.ghost ? this.state.ghost : {};
    let {lat, lng} = this.state.target ? this.state.target : {};
    Math.abs(longitude - lng) < 0.00008 ? this.changeTarget() : this.changeCoords()
  }


  componentDidMount(){




  // setInterval(this.moveGhost, 500);

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
                  {this.state.snappedPoints.map((coord, i) => {
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
