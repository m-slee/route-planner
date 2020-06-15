import React, { Component } from 'react';
import { Stack, Text } from "office-ui-fabric-react";
import Destination from "./Destination";
import Stop from "./Stop";

interface Idestination {
    name: string,
    lat: number,
    long: number
}

interface Istop {
    name: string,
    coords: number[],
}

interface Props {
    dests: Istop[],
    //setStartDest: (event: React.ChangeEvent<HTMLInputElement>, dest: Idestination) => void
}

interface State {

}

export default class Route extends Component<Props, State> {
    state = {}

    render() {
        return (
            <div>
                <div className="route-text">
                    <Text variant={'small'}>Your ordered list of stops:</Text>
                </div>
                <Stack gap={10} padding={16}>
                    {this.props.dests.map((dest, index) => (
                        <Stop dest={dest} stopNumber={index + 1} />
                    ))}
                </Stack>
            </div>
        )
    }
}