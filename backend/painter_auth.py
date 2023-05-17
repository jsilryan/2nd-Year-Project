from flask import Flask, request, jsonify, make_response
from flask_restx import Namespace, Resource, fields
from models import Painter, Client
from werkzeug.security import generate_password_hash, check_password_hash 
from flask_jwt_extended import (JWTManager, create_access_token, 
create_refresh_token, jwt_required, get_jwt_identity
)
from datetime import datetime, time
import requests
import pytz

painter_auth_ns = Namespace("painter_auth", description="Painter Authentication")

painter_signup = painter_auth_ns.model(
    "Painter Sign-Up",
    {
        "first_name" : fields.String(),
        "last_name" : fields.String(),
        "gender" : fields.String(),
        "email" : fields.String(),
        "password" : fields.String(),
        "area" : fields.String(),
        "phone_number" : fields.String()
    }

)

# painter_login = painter_auth_ns.model(
#     "Painter Login",
#     {
#         "email" : fields.String(),
#         "password" : fields.String()
#     }
# )

@painter_auth_ns.route("/painter-signup")
class Painter_Signup(Resource):
    @painter_auth_ns.expect(painter_signup)
    def post(self):
        data = request.get_json()
        email = data.get("email")
        db_painter = Painter.query.filter_by(email=email).first()
        db_client = Client.query.filter_by(email=email).first()
        # get the user's IP address or GPS coordinates from the request
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
        painter_created_at=datetime.now(local_tz)
        if db_painter is not None:
            return jsonify({"message": f"Painter with email {email} already exists!"})
        elif db_client is not None:
            return jsonify({"message": f"Client with email {email} already exists!"})
        else:
            new_painter = Painter(
                first_name = data.get("first_name"),
                last_name = data.get("last_name"),
                gender = data.get("gender"),
                email = data.get("email"),
                password = generate_password_hash(data.get("password")),
                area = data.get("area"),
                phone_number = data.get("phone_number"),
                painter_created_at = painter_created_at
            )
            new_painter.save()
            response = make_response(jsonify({"message": "Painter created successfully!"}))
            response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate" 
            return response

    @painter_auth_ns.marshal_with(painter_signup)
    @painter_auth_ns.expect(painter_signup)     
    @jwt_required()   
    def get(self):
        """Get a specific painter"""
        email = get_jwt_identity()

        current_painter = Painter.query.filter_by(email=email).first()

        return current_painter



@painter_auth_ns.route('/hello') 
#defines all the routes/ methods to be carried out on the route
class HelloResource(Resource):
    def get(self):
        return {"message" : "Hello World"}



# @painter_auth_ns.route("/painter-login")
# class Painter_Login(Resource):
#     @painter_auth_ns.expect(painter_login)
#     def post(self):
#         data = request.get_json()

#         email = data.get("email")
#         password = data.get("password")

#         db_painter = Painter.query.filter_by(email=email).first()

#         if db_painter and check_password_hash(db_painter.password, password):
#             #Generate access and refresh token
#             access_token = create_access_token(identity = db_painter.email)
#             refresh_token = create_refresh_token(identity = db_painter.email)

#             return jsonify(
#                 {
#                     "access token": access_token,
#                     "refresh token" : refresh_token
#                 }
#             )