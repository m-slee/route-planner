from flask import Flask, request, jsonify, abort
from math import radians, cos, sin, asin, sqrt
import json
from flask_cors import CORS

app=Flask(__name__)
CORS(app)

# Ensure responses aren't cached
# uncomment to allow hitting back button after logging in
@app.after_request
def after_request(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response

@app.route('/', methods=["POST"])
def index():
    test = [ 1, 2,3,4,5 ]
    test_json = {"nums": test}
    dests = request.get_json() # this will be the destinations sent from client
    print(dests)
    # need to add start dest to state in client
    
    start = Node(request.json["start"]["name"], request.json["start"]["coords"]) # get start name/coords
    destinations = [Node(stop["name"], stop["coords"]) for stop in request.json["destinations"]] # get stop name/coords
    
    route = Route(start, destinations)
    route.create_route()
    
    destinations = {
        "destinations": [stop.serialize() for stop in route.stops]
    }
    print(f'New Route is {destinations}')
    return jsonify(destinations)

# route planner methods
class Node(object):
    def __init__(self, name, coords):
        self.name = name
        self.coords = coords

    def __str__(self):
        return f'{self.name}, {self.coords}'

    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)

    def serialize(self):
        return {
            "name": self.name,
            "coords": self.coords
        }

class Route(object):
    def __init__(self, start, destinations):
        self.start = start
        self.destinations = destinations
        self.stops = [] # will hold the stops in order

    def create_route(self):
        self.stops.append(self.start) # append start node as first
        current_node = self.start
        dist = float("inf")
        distances = []

        for nodes in self.destinations:
            for node in self.destinations:
                cur_dist = self.distance(current_node.coords, node.coords)
                if cur_dist < dist and node not in distances: # make sure it is not already added to route
                    dist = cur_dist
                    current_node = node
            distances.append(current_node)
            dist = float("inf")
        
        self.stops = self.stops + distances
    
    
    # haversine formula
    def distance(self, location1, location2):
        
        lat1 = radians(location1[0]) 
        lat2 = radians(location2[0])
        lon1 = radians(location1[1]) 
        lon2 = radians(location2[1])

        # Haversine formula  
        dlon = lon2 - lon1  
        dlat = lat2 - lat1 
        a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
    
        c = 2 * asin(sqrt(a))  
        
        # Radius of earth in kilometers. Use 3956 for miles 
        r = 3956
        
        # calculate the result 
        return(c * r)  

    def __str__(self):
        return self.destinations
        # for stop in self.stops:
        #     return f'{stop}'
    def print_stops(self):
        for stop in self.stops:
            print(stop)