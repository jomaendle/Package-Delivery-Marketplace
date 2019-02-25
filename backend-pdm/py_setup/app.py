from flask import Flask, request, jsonify
import json
import datetime

app = Flask(__name__)

allParcels = []

@app.route("/parcel", methods=["GET", "POST", "DELETE"])
def parcel():
    if request.method == 'GET':
        try:
            content = request.get_json()
            parcel_id = content['parcel_id']
        except Exception as e:
            app.logger.error(e)
            return 'error parsing, check your request'

        if parcel_id != '':
            return jsonify(
                action_response = 'list',
                list = [parcel.get_id() for parcel in allParcels]
            )
        else: 
            return jsonify(
                action_response = 'detail',
                detail = find(lambda id: parcel.id == parcel_id, allParcels).get_parcelInfo()
            )


    elif request.method == 'POST':
        
        
        try:
            content = request.get_json()

            req_action = content['action'] 
        
            size = content['size']
            weight = content['weight']
            pickup_location = content['pickup_location']
            destination_location = content['destination_location']
            priority = content['priority']
            comment = content['comment']

            calculated_price = parcelPriceCalculator(size, weight, pickup_location, destination_location, priority)
            time_created = datetime.datetime.now()

            answ = jsonify(
                action_response = req_action,
                parcel_id = '',
                price = calculated_price,
                parcel_status = 'home',
                time_created = time_created
            )

        except Exception as e:
            app.logger.error(e)
            return 'error parsing, check your request'

        if req_action == 'submit':
            newParcel = Parcel()
            newParcel.make_parcel(size, weight, 
                                pickup_location, destination_location, 
                                priority, comment, time_created, calculated_price)
            allParcels.append(newParcel)
      
        return answ

    elif request.method == 'DELETE':
        return "delete"
    # else:
        return "Not supported"

@app.route("/parceldriver")
def parceldriver():
    return "pdriver"

def parcelPriceCalculator(size, weight, pickup_location, destination_location, priority):
    if(size=='L'):
        size = 3
    elif(size == 'M'):
        size = 2
    elif(size == 'S'):
        size = 1
    else:
        return

    if(weight=='heavy'):
        weight = 3
    elif(weight == 'medium'):
        weight = 2
    elif(weight == 'light'):
        weighgit scd gitt = 1
    else:
        return

    wgs84_geod = Geod(ellps='WGS84')
    lat1, lon1 = pickup_location.split(',')
    lat2, lon2 = destination_location.split(',')

    az12,az21,dist = wgs84_geod.inv(lon1,lat1,lon2,lat2)
   
    return (size*0.5+weight*0.5+int(dist)*0.1)*priority*0.75

class Parcel (object):
    size = ""
    weight = ""
    pickup_location = ""
    destination_location = ""
    priority = ""
    comment = ""
    time_created = ""
    price = ""
    id = ""
    status = ""

def make_parcel(size, weight, pickup_location, destination_location, priority, comment, time_created, price, parcel_status):
    parcel = Parcel()
    parcel.size = size
    parcel.weight = weight
    parcel.pickup_location = pickup_location
    parcel.priority = priority
    parcel.comment = comment
    parcel.time_created = time_created
    parcel.price = price
    if(allParcels.length == 1):
        parcel.id = allParcels[-1].id+1
    else:
        parcel.id = 1
    parcel.status = status, price

def get_parcelInfo():
    return jsonify(
                id = parcel.id,
                price = parcel.price,
                status = parcel.status,
                pickup_location = parcel.pickup_location,
                destination_location = parcel.destination_location
    )

def get_id():
    return id

