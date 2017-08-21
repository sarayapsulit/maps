
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
    route: [],
    };
  };
  componentWillMount(){
      debugger

    this.props.snappedPoints ? origin = this.props.snappedPoints[this.props.id] : origin = {latitude: 40, longitude: -73}
    this.setState({location: origin })
    let index = Math.floor((Math.random()*this.props.snappedPoints.length) + 1 )
    let {location} = index < this.props.snappedPoints.length ? this.props.snappedPoints[index] :{}
    let {latitude, longitude} = location ? location : {}

    let wayPoints = []
    for (var i = 0; i < 20; i++) {
      let n = Math.floor((Math.random()*this.props.snappedPoints.length) + 1 )
         n === index || n ===0 ?  n = n + 1 : n
         wayPoints.push(
           (this.props.snappedPoints[n].location.latitude+","+this.props.snappedPoints[n].location.longitude)
         );
       }
    axios.get('https://maps.googleapis.com/maps/api/directions/json?origin='+this.state.location.latitude+','+this.state.location.longitude+'&destination='+latitude+','+longitude+'&waypoints='+wayPoints.join("|")+'&mode=walking&key=AIzaSyCEiZCzxSsSbW6iUj3DapE6f76XKCREKp8')
    .then((response)=> {
    let route = [];
    debugger
    response.data.routes[0].legs.forEach(function (leg) {
      leg.steps.forEach(function(step){
        route.push(step.end_location)
            }
          )
        }
      )

    this.setState({route: route, target: route[0]})
      }
    )
  }
  findLongitude = (newLat, xa, ya, xb, yb ) => {
    var slope = (yb-ya)/(xb-xa)
    return (slope * (newLat- xa)) + ya
  }

  changeCoords = ()=>{
    let {latitude, longitude} = this.state.location ? this.state.location : {};
    let {lat, lng} = this.state.target ? this.state.target : {};
    let factor;
    latitude > lat ? factor = -1 : factor = 1;
    let newLatitude = latitude + (0.00005 * factor);
    let newLongitude = this.findLongitude(newLatitude, latitude, longitude, lat, lng)
    this.setState({location: {latitude:  newLatitude, longitude: newLongitude }})
  }

  changeTarget = () => {
    let targetCount = this.state.targetCount + 1
    this.setState({targetCount: targetCount })
    this.setState({target: this.state.route[targetCount] })
  }

  moveGhost = () =>{
    let {latitude, longitude} = this.state.location ? this.state.location : {};
    let {lat, lng} = this.state.target ? this.state.target : {};
    Math.abs(longitude - lng) < 0.00008 ? this.changeTarget() : this.changeCoords()
  }

  componentDidMount(){
    setInterval(this.moveGhost, 500);
  }

  render(){

    return (
        <MapView.Marker coordinate={this.state.location} image={require('./assets/ghost1.png')} />
      )
    }
  }
