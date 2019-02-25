# Copyright 2018 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the 'License');
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an 'AS IS' BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import sys
import json
from datetime import datetime
# [START functions_helloworld_http]
# [START functions_http_content]
from flask import escape, request, jsonify


import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from firebase_admin import auth

# Google Maps API 
import googlemaps

# Google ORTools
from ortools.constraint_solver import pywrapcp
from ortools.constraint_solver import routing_enums_pb2


# Firebase Setup Use the application default credentials
cred = credentials.ApplicationDefault()
firebase_admin.initialize_app(cred, {
    'projectId': 'studienarbeit',
    })
db = firestore.Client()

# Google Maps Setup
gmaps = googlemaps.Client(key='AIzaSyB5H2Jkopw-27Jber1tBVQvj6pOolYhk4U')


globalErrorMessage = "Request not supported, check documentation"

def auth_request(content):
    user_token = content['user_token']

    decoded_token = auth.verify_id_token(user_token, check_revoked=True)
    uid = decoded_token['uid']
    return uid

def verify_request(request):
    # Set CORS headers for the main request
    headers = {
        'Access-Control-Allow-Origin': '*'
    }
    # Set CORS headers for the preflight request
    if request.method == 'OPTIONS':
        # Allows GET requests from any origin with the Content-Type
        # header and caches preflight response for an 3600s
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }
        return False, 204, '', headers

    elif request.method == 'POST' and request.headers['content-type'] == 'application/json':
        try:
            content = request.get_json()
            uid = auth_request(content)
        except Exception as e:
            return False, 400, 'error parsing, check your request = POST' + str(e), headers
        except auth.AuthError as e:
            return False, 400, "Token Revoked", headers
        except auth.ValueError as e:
            return False, 400, "Invalid Token", headers

        return True, 200, [uid, content], headers
    else:
        return False, 400, 'Not supported. Make sure to POST with application/JSON header', headers

# Distance callback TEST FUNC
def create_distance_callback(dist_matrix):
  # Create a callback to calculate distances between cities.

  def distance_callback(from_node, to_node):
    return int(dist_matrix[from_node][to_node])

  return distance_callback

def parcel(request):
    """HTTP Cloud Function.
    Args:
        request (flask.Request): The request object.
        <http://flask.pocoo.org/docs/1.0/api/#f3lask.Request>
    Returns:
        The response text, or any set of values that can be turned into a
        Response object using `make_response`
        <http://flask.pocoo.org/docs/1.0/api/#flask.Flask.make_response>.
    """
    verification, http_code, message, headers = verify_request(request)
    if verification == False:
        return (message, http_code, headers)
    elif verification == True:
        uid = message[0]
        content = message[1]

    req_action = request.get_json()['action']

    if req_action == 'submit' or req_action == 'check':
        try:
            
            size = content['size']
            weight = content['weight']
            # Stored as {"lng": xx, "lat": xx} -> str(lat, long) order important
            pickup_location = content['pickup_location']
            destination_location = content['destination_location']
            priority = content['priority']
            comment = content['comment']

            # get distance through gmaps
            now = datetime.now()
            directions_result = gmaps.directions((pickup_location['lat'], pickup_location['lng']),
                                                (destination_location['lat'], destination_location['lng']),
                                                mode="driving",
                                                avoid='ferries',
                                                departure_time=now)
                

            est_driving_distance = directions_result[0]['legs'][0]['distance']['value']

            price = parcelPriceCalculator(size, weight, est_driving_distance, priority)
            parcel_status = 'home'
            time_created = datetime.now()
            parcel_id = "none"

            if req_action == 'submit':
                
                doc_ref = db.collection(u'parcels').document()
                doc_ref.set({
                    u'customer_id': uid,
                    u'size': size,
                    u'weight': weight,
                    u'pickup_location': pickup_location,
                    u'destination_location': destination_location,
                    u'est_distance': est_driving_distance,
                    u'priority': priority,
                    u'comment': comment,
                    u'time_created': time_created,
                    u'price': price,
                    u'parcel_status': parcel_status
                })
                parcel_id = doc_ref.id

            answ = jsonify(
                action_response = req_action,
                price = price,
                parcel_id = parcel_id,
                parcel_status =  parcel_status,
                time_created = str(time_created)
            )
        
        except Exception as e:
            return 'error in post req - submit/check: ' + str(e)
        else:
            return (answ, 200, headers)

    elif req_action == 'list' or req_action == 'detail':
        try:
            parcel_id = content['parcel_id']

            if parcel_id == '' or req_action == 'list':
                search_result = db.collection(u'parcels').where(u'customer_id', u'==', uid).get()

                plist = [doc.id for doc in search_result]


                answ = jsonify(
                    action_response = 'list',
                    list = plist
                )
            else: 
                search_result = db.collection(u'parcels').document(parcel_id).get()

                answ = jsonify(
                    action_response = 'detail',
                    detail = search_result.to_dict()
                )
        except Exception as e:
            return 'error in post - list/detail: ' + str(e)
        else:
            return (answ, 200, headers)

def pd_suggestions(request):

    # Check authentification and set CORS preflight, as well as regular headers
    verification, http_code, message, headers = verify_request(request)
    if verification == False:
        return (message, http_code, headers)
    elif verification == True:
        uid = message[0]
        content = message[1]

    driver_position = content['driver_position']
    radius = int(content['radius'])*1000

    # Fetch available parcels from DB
    parcels_by_priority = db.collection(u'parcels').where(u'parcel_status', u'==', u'home').order_by(u'priority').limit(10).get()
    

    # Calculate driving distance to starting point
    now = datetime.now()
    possibleParcels = []
    
    tmp_dev_list = []

    for sParcel in parcels_by_priority:
        jParcel = sParcel.to_dict()
        directions_result = gmaps.directions((driver_position['lat'], driver_position['lng']),
                                            (jParcel['pickup_location']['lat'], jParcel['pickup_location']['lng']),
                                            mode="driving",
                                            avoid='ferries',
                                            departure_time=now)
        distance_to_pickup = directions_result[0]['legs'][0]['distance']['value']
        est_total_distance = int(jParcel['est_distance']) + int(distance_to_pickup)
        if int(distance_to_pickup) < radius:
            possibleParcels.append({
                "parcel_id": sParcel.id,
                "potential_earning": jParcel['price'],
                "size": jParcel['size'],
                "weight": jParcel['weight'],
                "distance_current_pickup": distance_to_pickup,
                "distance_pickup_destination": jParcel['est_distance']
            })
            jParcel['parcel_id'] = sParcel.id
            tmp_dev_list.append(jParcel)
    
    fullinfo_poss_parcel = [(iParcel['pickup_location']['lat'], iParcel['pickup_location']['lng'])
                            for iParcel in tmp_dev_list]
    #return (jsonify(fullinfo_poss_parcel), 200, headers)
    #distance_matrix = create_distance_matrix(fullinfo_poss_parcel)
    #nextCity(fullinfo_poss_parcel, distance_matrix)
    calc_best = gmaps.directions(origin=(driver_position['lat'], driver_position['lng']),
                                destination=(driver_position['lat'], driver_position['lng']),
                                waypoints=fullinfo_poss_parcel,
                                mode='driving',
                                departure_time=now,
                                optimize_waypoints=True)
    calc_best = calc_best[0]['waypoint_order']
    return (jsonify(calc_best), 200, headers)

@firestore.transactional
def helper_pd_parcel_selection_transaction(transaction, parcel_ref, driver_id):
    parcel_snapshot = parcel_ref.get(transaction=transaction).get().to_dict()

    if parcel_snapshot['parcel_status'] == 'home':
        transaction.update(parcel_ref, {
            u'parcel_status': 'ready',
            u'driver_id': driver_id
        })
        return True
    else:
        return False

def pd_parcel_selection(request):
    # Check authentification and set CORS preflight, as well as regular headers
    verification, http_code, message, headers = verify_request(request)
    if verification == False:
        return (message, http_code, headers)
    elif verification == True:
        uid = message[0]
        content = message[1]
    selected_parcels = content['parcels']

    # !! TODO; make sure use doesn't have any open jobs
    jobs = db.collection(u'jobs').where(u'driver_id', u'==', uid).where(u'job_status', u'==', 'created').get()
    if len(jobs) > 0:
        return ("You already have an ongoing job", 400, headers)

    # Start Firebase Transaction to ensure consistency
    accepted_parcels = []
    # Validate, that all parcels are still available aka status = home
    for parcel_id in selected_parcels:
        transaction = db.transaction()
        parcel_ref = db.collection(u'parcels').document(parcel_id)
        check_ndate = helper_pd_parcel_selection_transaction(transaction, parcel_ref, uid)
        if check_ndate:
            accepted_parcels.append(parcel_id)

    if len(accepted_parcels) > 0:
        doc_ref = db.collection(u'jobs').document()
        doc_ref.set({
            u'driver_id': uid,
            u'time_created': time_created,
            u'selected_parcels': accepted_parcels,
            u'job_status': 'created'
        })
        
        job_id = doc_ref.id
        answ = jsonify(
            job_id = job_id
        )
        return (answ, 200, headers)
    else:
        return ("No parcels available", 200, headers)

def pd_status(request):
    # Check authentification and set CORS preflight, as well as regular headers

    verification, http_code, message, headers = verify_request(request)
    if verification == False:
        return (message, http_code, headers)
    elif verification == True:
        uid = message[0]
        content = message[1]
    driver_location = content['current_location']
    parcel_id = content['parcel_id']

    # User has interacted with one of the parcels either pickup or delivery
    if parcel_id != '':
        parcel_ref = db.collection(u'parcels').document(parcel_id)
        parcel_details = parcel_ref.get().to_dict()
        parcel_status = parcel_details['parcel_status']
       
        if parcel_status == 'ready':
            parcel_ref.update({
                u'parcel_status': 'delivery'
            })

        elif parcel_status == 'delivery':
            parcel_ref.update({
                u'parcel_status': 'submitted'
            })

    # Check drivers active Job
    jobs = db.collection(u'jobs').where(u'driver_id', u'==', uid).where(u'job_status', u'==', 'created').get()
    if len(jobs) > 1:
        return ("Bad Error - multiple active jobs exist", 400, headers)
    job = jobs[0].to_dict()

    # Create Available Location Array - find locations that are applicaple for delivery
    accessible_locations = []
    focus_parcels = job['selected_parcels']
    # Validate, that all parcels are still available aka status = home
    for parcel_id in focus_parcels:
        parcel_details = db.collection(u'parcels').document(parcel_id).get().to_dict()
        parcel_status = parcel_details['parcel_status']

        if parcel_status == 'ready':
            # Parcel is ready, add pickup_location to accessible_locations
            accessible_locations.append((parcel_id, parcel_status['pickup_location']))

        elif parcel_status == 'delivery':
            # Parcel is in posession, add destination_location to accessible_locations
            accessible_locations.append((parcel_id, parcel_status['destination_location']))

    # !! If array is empty, job terminates with success. Change status, notify user

    # Calculate closest parcel and best waypoint
    stripped_loc = [(parcel[1]['lat'], parcel[1]['lng'])
                            for parcel in accessible_locations]

    calc_best = gmaps.directions(origin=(driver_position['lat'], driver_position['lng']),
                            destination=(driver_position['lat'], driver_position['lng']),
                            waypoints=stripped_loc,
                            mode='driving',
                            departure_time=now,
                            optimize_waypoints=True)


    # [ 0, 2, 1]
    best_parcel_index = calc_best[0]['waypoint_order']
    
    # (pid, loc)
    actual_best = accessible_locations[best_parcel_index[0]]

    answ = jsonify(
        parcel_id = actual_best[0],
        location = actual_best[1]
    )

    return (answ, 200, headers)

def pd_job(request):

    # Check authentification and set CORS preflight, as well as regular headers
    verification, http_code, message, headers = verify_request(request)
    if verification == False:
        return (message, http_code, headers)
    elif verification == True:
        uid = message[0]

    jobs = db.collection(u'jobs').where(u'driver_id', u'==', uid).where(u'job_status', u'==', 'created').get()
    job = jobs[0].to_dict()

    answ = jsonify(
        job_id = job['time_created'],
        time_created = job['time_created'],
        parcels = job['selected_parcels']
    )
    return (answ, 200, headers)

def pd_parcel_status(request):

    # Check authentification and set CORS preflight, as well as regular headers
    verification, http_code, message, headers = verify_request(request)
    if verification == False:
        return (message, http_code, headers)
    elif verification == True:
        uid = message[0]
        content = message[1]

    parcel_id = content['parcel_id'] 
    parcel_status = content['parcel_status'] 

    return ""
 
def parcelPriceCalculator(size, weight, est_driving_distance, priority):


    km_factor = 0

    if(size=='L'):
        km_factor += 0.2
    elif(size == 'M'):
        km_factor += 0.1
    elif(size == 'S'):
        km_factor += 0.05
    else:
        raise ValueError('Size not supported. Has to be L, M or S')

    if(weight=='heavy'):
        km_factor += 0.2
    elif(weight == 'medium'):
        km_factor += 0.1
    elif(weight == 'light'):
        km_factor += 0.05
    else:
        raise ValueError('Weight not supported. Has to be heavy, medium, light')
    # Benzin Addition
    km_factor += 0.15

    # Driver Additional
    km_factor += 0.1

    # Net Price
    net_price = (est_driving_distance/1000) * km_factor

    # Our margin
    return round(net_price * 1.05, 2)


# Traveling Salesman Implementation

def create_distance_matrix(locations):
    #locations [[name, loc],[]...] = ["JxmmtV40RYWvzR2vJT5M",[48.629546117894684,9.211901583414942]],["RN7JWWICYXDfEG8CrjV7",[48.619375519942274,8.879459071710244]]
    cords = [loc[1] for loc in locations]
 
    # https://developers.google.com/maps/documentation/distance-matrix/intro
    gmaps_dmatrix = gmaps.distance_matrix(cords, cords, mode='driving')


    dmatrix = [ [cell['distance']['value'] for cell in row['elements']] for row in gmaps_dmatrix['rows']]

    return gmaps_dmatrix

# Distance callback
def create_distance_callback(dist_matrix):
  # Create a callback to calculate distances between cities.

  def distance_callback(from_node, to_node):
    return int(dist_matrix[from_node][to_node])

  return distance_callback


def nextCity(locations, dist_matrix):
    tsp_size = len(locations)
    num_routes = 1
    depot = 0
    
    if tsp_size > 0:
        routing = pywrapcp.RoutingModel(tsp_size, num_routes, depot)
    
        search_parameters = pywrapcp.RoutingModel.DefaultSearchParameters()
        # Create the distance callback.
        #dist_callback = create_distance_callback(dist_matrix)
    
        routing.SetArcCostEvaluatorOfAllVehicles(lambda from_node, to_node: int(dist_matrix[from_node][to_node]))
        # Solve the problem.
        try:
            assignment = routing.SolveWithParameters(search_parameters)
        except Exception as e:
            print(e)
    '''
        if assignment:
            # Solution distance.
            # print "Total distance: " + str(assignment.ObjectiveValue()) + " miles\n"
            # Display the solution.
            # Only one route here; otherwise iterate from 0 to routing.vehicles() - 1
            route_number = 0
    
            index = routing.Start(route_number) # Index of the variable for the starting node.
    
            index = assignment.Value(routing.NextVar(index))
    
            return locations[routing.IndexToNode(index)]
    '''