import React, { Component } from 'react';
import {
    Stack, Text, DocumentCard, DocumentCardActivity, DocumentCardDetails,
    DocumentCardPreview, DocumentCardTitle, IDocumentCardPreviewProps, DocumentCardType,
    IDocumentCardActivityPerson, IStackTokens, getTheme, Fabric, initializeIcons, Separator
} from "office-ui-fabric-react";

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
    dest: Istop//Idestination,
    stopNumber: number
}
interface State {

}

export default class Stop extends Component<Props, State> {
    state = {}

    render() {
        return (
            <div>
                <Stack>
                    <Text variant={'xxLarge'}>{this.props.stopNumber}</Text>
                    <Text variant={'medium'}>{this.props.dest.name}</Text>
                </Stack>
                <Separator />
            </div>
        )
    }
}
