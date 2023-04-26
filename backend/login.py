from flask import Flask, request, jsonify, make_response
from flask_restx import Namespace, Resource, fields
from models import Painter, Client
from werkzeug.security import generate_password_hash, check_password_hash 
from flask_jwt_extended import (JWTManager, create_access_token, 
create_refresh_token, jwt_required, get_jwt_identity
)
from datetime import timedelta

user_auth_ns = Namespace("user_auth", description="User Login")

user_login = user_auth_ns.model(
    "User Login",
    {
        "email" : fields.String(),
        "password" : fields.String()
    }
)

@user_auth_ns.route("/login")
class Painter_Login(Resource):
    @user_auth_ns.expect(user_login)
    def post(self):
        data = request.get_json()

        email = data.get("email")
        password = data.get("password")

        db_painter = Painter.query.filter_by(email=email).first()
        db_client = Client.query.filter_by(email=email).first()
        expires_delta = timedelta(hours=1)

        if db_painter:
            if check_password_hash(db_painter.password, password):
                #Generate access and refresh token
                access_token = create_access_token(identity = db_painter.email, expires_delta =expires_delta)
                refresh_token = create_refresh_token(identity = db_painter.email, expires_delta =expires_delta)

                return jsonify(
                    {
                        "user" : "Painter",
                        "access_token": access_token,
                        "refresh_token" : refresh_token
                    }
                )
            else:
                return jsonify({"message" : "Password is incorrect!"})

        elif db_client:
            if check_password_hash(db_client.password, password):
                access_token = create_access_token(identity = db_client.email, expires_delta =expires_delta)
                refresh_token = create_refresh_token(identity = db_client.email, expires_delta =expires_delta)

                return jsonify(
                    {
                        "user" : "Client",
                        "access_token": access_token,
                        "refresh_token" : refresh_token
                    }
                )
            else:
                return jsonify({"message" : "Password is incorrect!"})

        else:
            return jsonify({"message" : "User does not exist!"})


#Create a route to create refresh tokens - help create new access tokens incase the access token has expired
@user_auth_ns.route('/refresh')
class RefreshResource(Resource):
    @jwt_required(refresh = True) #will require refresh token
    def post(self):
        #Get current user -> jwt_identity
        current_user = get_jwt_identity()

        new_access_token = create_access_token(identity = current_user, expires_delta =expires_delta)

        return make_response(jsonify({"access_token" : new_access_token}), 200)
        #Authorization - Bearer (Refresh token of a logged in user)
