import React, { Component } from "react";

import { Map, TileLayer, Marker, Popup } from "react-leaflet";
//import Idestination from "../App";
import WrappedMarker from './WrappedMarker';

interface Idestination {
    name: string,
    lat: number,
    long: number
}

interface Props {
    dests: Idestination[]
}

interface State {
    lat: number;
    lng: number;
    zoom: number;
    destinations: Idestination[]
}

export default class LeafletMap extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            lat: 27.9477595,
            lng: -82.458444,
            zoom: 13,
            destinations: []
        };
    }

    componentWillReceiveProps() {
        this.setState({
            destinations: this.props.dests
        })
    }

    render() {

        const markers = this.state.destinations.map((dest, index) => {

            <WrappedMarker lat={dest.lat} long={dest.long}>

            </WrappedMarker>
        })
        console.log(markers);

        return (

            <Map center={[this.state.lat, this.state.lng]} zoom={13}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />

                {markers}
            </Map>
        );
    }
}
