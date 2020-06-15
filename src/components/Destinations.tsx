import React, { Component } from 'react'
import { Stack, Separator } from "office-ui-fabric-react";
import Destination from "./Destination";
// import { Idestination } from "../App";


interface Idestination {
    name: string,
    lat: number,
    long: number
}

interface Props {
    start: Idestination | null
    dests: Idestination[],
    setStartDest: (dest: Idestination) => void,
    deleteDest: (dest: Idestination) => void
}

interface State {

}

export default class Destinations extends Component<Props, State> {

    render() {
        return (
            <div>
                <Stack gap={10} padding={10}>
                    {this.props.dests.map((dest) => (
                        <Destination
                            className={dest === this.props.start ? 'start-dest' : null}
                            setStartDest={this.props.setStartDest}
                            dest={dest}
                            deleteDest={this.props.deleteDest}
                        />
                    ))}
                </Stack>
                <Separator />
            </div>
        )
    }
}
