from flask import Flask, request, jsonify, make_response, Response
from flask_restx import Namespace, Resource, fields
from models import Job, Painter, Proposal, Client, Portfolio, Img
from flask_jwt_extended import (JWTManager, create_access_token, 
create_refresh_token, jwt_required, get_jwt_identity
)
from datetime import datetime
import random
import requests
import pytz
from werkzeug.utils import secure_filename

image_ns = Namespace("images", description = "Painter Portfolio Images")

images_model = image_ns.model(
    "Image Details",
    {
        "image_short_code" : fields.String(),
        "img" : fields.String(),
        "name" : fields.String(),
        "mimetype" : fields.String(),
        "portfolio_id" : fields.Integer()
    }
)

@image_ns.route("/portfolio/<string:portfolio_short_code>/image")
class Painter_Images(Resource):
    @jwt_required()
    def post(self, portfolio_short_code):
        # data = request.get_json()
        allowed_extensions = set(['png', 'jpg', 'jpeg', 'gif'])

        def allowed_file(filename):
            return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions

        files = request.files.getlist(["img"]) #files[]
        if not files:
            response = make_response(jsonify({
                "message" : "No image uploaded!"
            }))
        portfolio = Portfolio.query.filter_by(portfolio_short_code = portfolio_short_code).first()
        if portfolio is None:
            response = make_response(jsonify({
                "message" : f"Portfolio with short code {portfolio_short_code} does not exist!"
            }))
            return response

        for file in files:
            if file and allowed_file((file.filename)):
                filename = secure_filename(file.filename)
                mimetype = file.mimetype

            character = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
            char_list = list(character)
            code = random.choices(char_list, k=4)
            code = "".join(code)
            db_img = Img.query.filter_by(image_short_code=code).first()
            while (db_img is not None):
                code = random.choices(char_list, k=4)
                code = "".join(code)


            new_image = Img (
                img = file.read(),
                mimetype = mimetype,
                name = filename,
                image_short_code = code,
                portfolio_id = portfolio.id
            )

            new_image.save()

        response = make_response(jsonify({
            "message" : "Images have been uploaded."
        }))

        return response



    # def post(self, portfolio_short_code):
    #     # data = request.get_json()
    #     allowed_extensions = set(['png', 'jpg', 'jpeg', 'gif'])

    #     def allowed_file(filename):
    #         return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions

    #     # data = request.files["img"]
    #     data = request.data
    #     if not data:
    #         response = make_response(jsonify({
    #             "message" : "No image uploaded!"
    #         }))

    #     filename = secure_filename(data.filename)
    #     mimetype = data.mimetype

    #     portfolio = Portfolio.query.filter_by(portfolio_short_code = portfolio_short_code).first()
    #     if portfolio is None:
    #         response = make_response(jsonify({
    #             "message" : f"Portfolio with short code {portfolio_short_code} does not exist!"
    #         }))
    #         return response

    #     character = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    #     char_list = list(character)
    #     code = random.choices(char_list, k=4)
    #     code = "".join(code)
    #     db_img = Img.query.filter_by(image_short_code=code).first()
    #     while (db_img is not None):
    #         code = random.choices(char_list, k=4)
    #         code = "".join(code)


    #     new_image = Img (
    #         img = data.read(),
    #         mimetype = mimetype,
    #         name = filename,
    #         image_short_code = code,
    #         portfolio_id = portfolio.id
    #     )

    #     new_image.save()

    #     response = make_response(jsonify({
    #         "message" : "Image has been uploaded."
    #     }))

    #     return response