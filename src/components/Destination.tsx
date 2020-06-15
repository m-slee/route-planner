import React, { Component } from 'react'
import {
    Stack, Text, DocumentCard, DocumentCardActivity, DocumentCardDetails,
    DocumentCardPreview, DocumentCardTitle, IDocumentCardPreviewProps, DocumentCardType,
    IDocumentCardActivityPerson, IStackTokens, getTheme, Fabric, initializeIcons, DefaultButton, Icon, Separator
} from "office-ui-fabric-react";
// import Idestination from "../App";

interface Idestination {
    name: string,
    lat: number,
    long: number
}

interface Props {
    className: string | null
    dest: Idestination,
    setStartDest: (dest: Idestination) => void
    deleteDest: (dest: Idestination) => void
}
interface State {

}

export default class Destination extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            location: ''
        }
        this.setStart = this.setStart.bind(this);
        this.deleteDest = this.deleteDest.bind(this);

        initializeIcons();
    }

    deleteDest(event: React.ChangeEvent<HTMLInputElement>, dest: Idestination) {
        this.props.deleteDest(this.props.dest);
    }

    setStart(event: React.ChangeEvent<HTMLInputElement>, dest: Idestination) {
        this.props.setStartDest(this.props.dest);
    }

    render() {
        let classNames = this.props.className ? this.props.className + ' dest-container' : 'dest-container';
        let showStart = this.props.className ? <div className="starting-dest-after"></div> : null;
        return (
            <div>
                <div className={classNames}>
                    <div>
                        <Text variant={'large'}>{this.props.dest.name}</Text>
                    </div>

                    <div className="icons-container">
                        <Icon iconName="Delete" className="ms-IconExample delete" onClick={this.deleteDest} />
                        <Icon iconName="IconSetsFlag" className="ms-IconExample set-start" onClick={this.setStart} />
                    </div>
                    <Separator />

                </div>

                {showStart}
            </div>

        )
    }
}