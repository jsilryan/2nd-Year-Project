from flask import Flask, request, jsonify, make_response
from flask_restx import Namespace, Resource, fields
from models import Client, Painter
from werkzeug.security import generate_password_hash, check_password_hash 
from flask_jwt_extended import (JWTManager, create_access_token, 
create_refresh_token, jwt_required, get_jwt_identity
)
from datetime import datetime, time
import requests
import pytz

client_auth_ns = Namespace("client_auth", description = "Client Authentication")

#model serializer
client_signup = client_auth_ns.model(
    "Client Sign-Up", #name for the model
    {
        "first_name" : fields.String(),
        "last_name" : fields.String(),
        "gender" : fields.String(),
        "email" : fields.String(),
        "password" : fields.String(),
        "phone_number" : fields.String()
    }
)

# client_login = client_auth_ns.model(
#     "Client Login",
#     {
#         "email" : fields.String(),
#         "password" : fields.String()
#     }
# )

@client_auth_ns.route("/client-signup")
class Client_Signup(Resource):
    @client_auth_ns.expect(client_signup)
    def post(self):
        #Specify what the function does using .strings
        """
            Enter Client Sign Up data
        """
        data = request.get_json()
        email = data.get("email")
        db_painter = Painter.query.filter_by(email=email).first()
        db_client = Client.query.filter_by(email=email).first()
        ip_address = request.remote_addr
        latitude = data.get('lat')
        longitude = data.get('long')

        if latitude and longitude:
            # get the user's timezone based on their GPS coordinates
            timezone_response = requests.get(f'https://maps.googleapis.com/maps/api/timezone/json?location={latitude},{longitude}&timestamp={int(datetime.now().timestamp())}&key=AIzaSyCVgCH0d4vmVmtmRRD1PdTlkDYFBndKJcg')
            timezone_data = timezone_response.json()
            timezone_name = timezone_data['timeZoneId']
        elif ip_address:
            # get the user's location based on their IP address
            response = requests.get(f'https://ipapi.co/{ip_address}/json/')
            location = response.json()
            try:
                timezone_name = location['timezone']
            except:
                timezone_name = 'Africa/Nairobi'
        else:
            # use a default timezone if location information is not available
            timezone_name = 'Africa/Nairobi'

        # set the timezone for the current datetime object
        local_tz = pytz.timezone(timezone_name)

        # set the client_created_at column with the current datetime object in the user's local timezone
        client_created_at=datetime.now(local_tz)
        if (db_painter or db_client) is not None:
            return jsonify({"message": f"User with email {email} already exists!"})
        else:
            new_client = Client (
                first_name = data.get("first_name"),
                last_name = data.get("last_name"),
                gender = data.get("gender"),
                email = data.get("email"),
                password = generate_password_hash(data.get("password")),
                phone_number = data.get("phone_number"),
                client_created_at = client_created_at
            )
            new_client.save()
            response = make_response(jsonify({"message": "Client created successfully!"}))
            response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate" 
            return response

    @client_auth_ns.marshal_with(client_signup)
    @client_auth_ns.expect(client_signup)     
    @jwt_required()   
    def get(self):
        """Get a specific painter"""
        email = get_jwt_identity()

        current_client = Client.query.filter_by(email=email).first()

        return current_client

# @client_auth_ns.route("/client-login")
# class Client_Login(Resource):
#     @client_auth_ns.expect(client_login)
#     def post(self):
#         data = request.get_json()
#         email = data.get("email")
#         password = data.get("password")

#         db_client = Client.query.filter_by(email=email).first()

#         if db_client and check_password_hash(db_client.password, password):
#             #Giving an authenticated user an access token and refresh token
#             access_token = create_access_token(identity=db_client.email)
#             refresh_token = create_refresh_token(identity=db_client.email)

#             return jsonify(
#                 {
#                     "access token" : access_token,
#                     "refresh token" : refresh_token
#                 }
#             )
#         else:
#             return jsonify({"message" : "User does not exist!"})
