import React, { Component } from "react";
import { Stack, Text, Link, FontWeights, Fabric, initializeIcons, Icon, PrimaryButton, DefaultButton, Spinner, SpinnerSize } from "office-ui-fabric-react";
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import { IStackTokens } from 'office-ui-fabric-react/lib/Stack';
import LeafletMap from "./components/LeafletMap";
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import Destinations from "./components/Destinations";
import "./App.css";
import logo from "./fabric.png";
import { Map, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import Route from "./components/Route";
import { polyline } from "leaflet";


const boldStyle = {
    root: { fontWeight: FontWeights.semibold },
};

interface Istop {
    name: string,
    coords: number[],
}

interface Idestination {
    name: string,
    lat: number,
    long: number
}

interface State {
    destination: string,
    dests: Idestination[],
    start: {}
    coords: any[],
    error: string,
    route: Istop[],
    createRoute: boolean
    routeLoading: boolean
}

interface Props {

}

export default class App extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            destination: '',
            dests: [{
                name: "Tampa",
                lat: 27.9477595,
                long: -82.458444
            }],
            start: {},
            coords: [],
            error: '',
            route: [],
            createRoute: false,
            routeLoading: false
        };

        this.clearError = this.clearError.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.addDestination = this.addDestination.bind(this);
        this.toggleRoute = this.toggleRoute.bind(this);
        this.setStart = this.setStart.bind(this);
        this.deleteDest = this.deleteDest.bind(this);
        this.getRouteInfo = this.getRouteInfo.bind(this);
        initializeIcons();
    }

    getRouteInfo(dest: string): number {
        return this.state.route.map(stop => stop.name).indexOf(dest) + 1;
    }
    deleteDest(destToDelete: Idestination): void {
        console.log('clicked delete from dest.')
        this.setState({
            dests: this.state.dests.filter(dest => dest !== destToDelete)
        })
    }

    setStart(dest: Idestination): void {
        console.log('clicked set Start from dest.')
        this.setState({
            start: dest
        })

        console.log(this.state.start)
    }

    clearError() {
        this.setState({
            error: ''
        })
    }

    toggleRoute() {
        // check to make sure destinations is not empty
        if (this.state.dests.length === 0) {
            this.setState(({
                error: 'You must add a destination.'
            }))
            return
        }

        //ensure a start has been picked, otherwise default to first in dests
        if (Object.entries(this.state.start).length === 0) {
            this.setState(({
                error: 'You must set a starting location.'
            }))
            return
        }

        this.setState({
            createRoute: !this.state.createRoute,
            routeLoading: true
        })

        // make call to API here to get route JSON
        // set loading to true while waiting for response
        // check to see if route has changed (cached) to avoid recomputing same route
        let dests_to_send = [];
        const filtered_dests = this.state.dests.filter(dest => dest !== this.state.start); // get all dests that are not start
        dests_to_send = filtered_dests.map(dest => {
            const new_dest = {
                name: dest.name,
                coords: [dest.lat, dest.long]
            }
            return new_dest

        });

        const new_route_data = {
            start: {
                name: this.state.start.name,
                coords: [this.state.start.lat, this.state.start.long]
            },
            destinations: dests_to_send
        }

        fetch("http://127.0.0.1:5000/",
            {
                method: 'post',
                body: JSON.stringify(new_route_data),
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            .then(res => {
                return res.json()
            }).then(data => {
                console.log(data);

                this.setState({
                    route: data.destinations,//newRoute,
                    routeLoading: false,
                })
            }).catch(err => {
                console.log(err);
            })

        console.log(`The current route is ${this.state.route}`);
    }

    handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({
            destination: event.target.value
        })
    }

    addDestination() {
        const provider = new OpenStreetMapProvider();

        // search
        let result = provider.search({ query: this.state.destination })
            .then(res => {
                console.log(res[0].y, res[0].x);
                const new_dest = {
                    name: this.state.destination,
                    lat: res[0].y,
                    long: res[0].x
                }

                this.setState({
                    dests: [...this.state.dests, new_dest],
                    destination: '' // clear input
                    //coords: [...this.state.coords, { x: res[0].x, y: res[0].y }]
                })
            }).catch(err => {
                this.setState({
                    error: 'The location you entered is invalid.'
                })
                console.log(err);
                return false; // if error, return false
            })
    }

    render() {
        const stackTokens: Partial<IStackTokens> = { childrenGap: 20, padding: 10, maxWidth: 400 };
        return (
            <div className="layout" >
                <div className="sidebar">

                    <Stack horizontal tokens={stackTokens} >
                        <DefaultButton
                            onClick={this.addDestination}
                            text="Add to Destinations"
                            allowDisabledFocus
                            disabled={this.state.createRoute}
                            className="add-to-dests"
                            checked={false} />

                        <PrimaryButton
                            onClick={this.toggleRoute}
                            text={this.state.createRoute ? "Add More" : "Create Route"}
                            allowDisabledFocus
                            disabled={false}
                            checked={false} />
                    </Stack>
                    <Stack tokens={stackTokens} >

                        <SearchBox name="destination" placeholder="Search" value={this.state.destination} onChange={this.handleChange} />
                        {this.state.error ? <span className="error-span" onClick={this.clearError}><Text className="error">{this.state.error}</Text><Icon iconName="ErrorBadge" className="ms-IconExample error-btn" /></span> : <></>}

                    </Stack>
                    {this.state.createRoute ?
                        this.state.routeLoading ?
                            <Spinner size={SpinnerSize.large} /> :
                            <Route dests={this.state.route} />
                        :
                        <Destinations start={this.state.start} setStartDest={this.setStart} dests={this.state.dests} deleteDest={this.deleteDest} />
                    }


                </div>
                <Map center={[27.9477595, -82.458444]} zoom={10}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    />

                    {this.state.dests.map((dest, index) =>
                        <Marker position={[dest.lat, dest.long]}>

                            <Popup>{dest.name}
                                {this.state.route.length > 0 ? <span> - Stop {this.getRouteInfo(dest.name)}</span> : null}

                            </Popup>

                        </Marker>
                    )}

                    {this.state.route.map((stop, index) => {
                        if (this.state.route[index + 1] != undefined) {
                            return <Polyline positions={[
                                [stop.coords[0], stop.coords[1]], [this.state.route[index + 1].coords[0], this.state.route[index + 1].coords[1]]
                            ]} color={'#175fc2'} />
                        }
                    })
                    }

                </Map>
            </div>

        )
    }
};