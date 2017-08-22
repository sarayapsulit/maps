
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

export default class Ghost extends Component {
  constructor() {
    super();
    this.state = {
      location: {latitude: 0, longitude: 0},
      target: {lat: 0, lng: 0},
      targetCount: 0,
      route: []
    };

    this.moveGhost = this.moveGhost.bind(this);
    this.changeTarget = this.changeTarget.bind(this);
    this.changeCoords = this.changeCoords.bind(this)
  };


  findLongitude = ( newLat, xa, ya, xb, yb ) => {
    var slope = (yb-ya)/(xb-xa)
    return (slope * (newLat- xa)) + ya
  }

  changeCoords = ()=> {
    let {latitude, longitude} = this.state.location ? this.state.location :{};
    let {lat, lng} = this.state.target ? this.state.target : {};
    let factor;

    latitude > lat ? factor = -1 : factor = 1;

    let newLatitude = latitude + (0.00003 * factor);
    let newLongitude = this.findLongitude( newLatitude, latitude, longitude, lat, lng  )

    this.setState({location: {latitude:  newLatitude, longitude: newLongitude }})
  }

  changeTarget = () => {
    let route = this.props.route ? this.props.route : []
    let targetCount = this.props.route ? this.state.targetCount + 1 : 0
    let target = this.props.route ? this.props.route[targetCount] : {lat: 0, lng: 0}
    this.setState({targetCount: targetCount, target: target })

  }

  moveGhost = () => {
    let {latitude, longitude} = this.state.location ? this.state.location : {};
    let {lat, lng} = this.state.target ? this.state.target : {};

    Math.abs(longitude - lng) < 0.0001 ? this.changeTarget() : this.changeCoords()
  }



  componentDidMount(){
    let {location} = this.props.origin ? this.props.origin  :  {latitude: 0, longitude: 0}
    let route = this.props.route ? this.props.route : []
    let target = this.props.route[0] ? this.props.route[0] : {lat: 0 , lng: 0}

    this.setState({location: location, route: route, target: target})
    // setInterval(this.moveGhost, 1000);
  }

  render(){
    return (
        <MapView.Marker coordinate={this.state.location} image={require('./assets/ghost2.png')} />
      )
    }
  }
