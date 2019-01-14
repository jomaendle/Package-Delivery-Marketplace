from flask import Flask, request
import json
app = Flask(__name__)

allParcels = []

@app.route("/parcel", methods=["GET", "POST", "DELETE"])
def parcel():
    if request.method == 'GET':
        return "Get"
    elif request.method == 'POST':
        json_req_data
       

        return "post"
    elif request.method == 'DELETE':
        return "delete"
    else:
        return "Not supported"

@app.route("/parceldriver")
def parceldriver():
    return "pdriver"

class Parcel (object):
    size = ""
    weight = ""
    pickup_location = ""
    destination_location = ""
    priority = ""
    comment = ""
    time_created = ""
def make_parcel(size, weight, pickup_location, destination_location, priority, comment, time_created):
    parcel = Parcel()
    parcel.size = size
    parcel.weight = weight
    parcel.pickup_location = pickup_location
    parcel.priority = priority
    parcel.comment = comment
    parcel.time_created = time_created