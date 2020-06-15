import React, { Component } from 'react'
import { Marker, Popup } from "react-leaflet";

interface Props {
    lat: number,
    long: number,
}
interface State {

}

export default class WrappedMarker extends Component<Props, State> {
    state = {}

    render() {
        return (
            <Marker position={[this.props.lat, this.props.long]} />
        )
    }
}