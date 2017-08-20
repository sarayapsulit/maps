
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import MapView from 'react-native-maps';
import axios from 'react-native-axios'



export default class Ghost extends Component {
  constructor() {
    super();
    this.state = {

    ghost: {latitude: 40, longitude: -73},
    target: {lat: maxlat, lng: maxlong},
    targetCount: 0,
    targets: [],
    };



  };

    render(){
      <MapView.Marker coordinate={this.state.ghost} image={require('./ghost.png')} />
    }

  }
