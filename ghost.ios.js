
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
      location: {latitude: 40, longitude: -73},
      target: {lat: maxlat, lng: maxlong},
      targetCount: 0,
      route: []
    };
    this.waitingForAxiosCalls = this.waitingForAxiosCalls.bind(this)
    this.moveGhost = this.moveGhost.bind(this);
    this.changeTarget = this.changeTarget.bind(this);
    this.changeCoords = this.changeCoords.bind(this)
  };
  componentWillMount(){
    this.setState({location: location, route: this.props.route})
  console.log( "componentWillMount" )
  }
  findLongitude = ( newLat, xa, ya, xb, yb ) => {
    var slope = (yb-ya)/(xb-xa)
    return (slope * (newLat- xa)) + ya
  }

  changeCoords = ()=> {
  console.log( "changeCoords" )
    let {latitude, longitude} = this.state.location ? this.state.location :{};
    let {lat, lng} = this.state.target ? this.state.target : {};
    let factor;
    latitude > lat ? factor = -1 : factor = 1;
    let newLatitude = latitude + (0.00005 * factor);
    let newLongitude = this.findLongitude( newLatitude, latitude, longitude, lat, lng  )
    this.setState({location: {latitude:  newLatitude, longitude: newLongitude }})
  }

  changeTarget = () => {

    let route = this.props.route ? this.props.route : [{lat: maxlat, lng: maxlong}]
    let targetCount;
    route.length > 1 ? targetCount = this.state.targetCount + 1 : targetCount = 0

    console.log('route[targetCount]',route[targetCount])
    this.setState({targetCount: targetCount })
    this.setState({target: route[targetCount] })
  }

  moveGhost = () => {
    console.log( "moveGhost" )
    let {latitude, longitude} = this.state.location ? this.state.location : {};
    let {lat, lng} = this.state.target ? this.state.target : {};
    Math.abs(longitude - lng) < 0.00008 ? this.changeTarget() : this.changeCoords()
  }

  waitingForAxiosCalls = () => {
  console.log( "waitingForAxiosCalls" )
    if (this.props.route.length >  1 ) {
      // this.state.targetCount === 0 ? this.setState({target: this.props.route[this.state.targetCount]}) :
  console.log( "waitingForAxiosCalls- true" )
       this.moveGhost()
    }else{
      this.setState({target: this.state.location})
  console.log( "waitingForAxiosCalls - false" )
    }

  }

  componentDidMount(){
    let location = this.props.origin ? this.props.origin.location  :  {latitude: 40, longitude: -73}

    this.setState({location: location, route: this.props.route})
    console.log( "componentDidMount")
    setInterval(this.waitingForAxiosCalls, 1000);
  }

  render(){

    return (
        <MapView.Marker coordinate={this.state.location} image={require('./assets/ghost1.png')} />
      )
    }
  }
