from flask import Flask, request, jsonify, make_response, Response, current_app
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
import os

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
        allowed_extensions = set(['png', 'jpg', 'jpeg', 'gif'])

        def allowed_file(filename):
            return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions
        if 'img' not in request.files:
            response = make_response(jsonify({
                "message" : "No image uploaded!"
            }))
            return response

        files = request.files.getlist("img") #files[]
        print(files)

        portfolio = Portfolio.query.filter_by(portfolio_short_code = portfolio_short_code).first()
        if portfolio is None:
            response = make_response(jsonify({
                "message" : f"Portfolio with short code {portfolio_short_code} does not exist!"
            }))
            return response
        images = Img.query.all()
        for file in files:
            if file and allowed_file((file.filename)):
                for x in range(0, len(images)):
                    if images[x].name == file.filename:
                        response = make_response(jsonify({
                            "message" : f"Image with filename {file.filename} already exists"
                        }))
                        return response
                filename = secure_filename(file.filename)
                mimetype = file.mimetype
                upload_folder = current_app.config['UPLOAD_FOLDER']
                file_path = os.path.join(upload_folder, filename)

                if not os.path.exists(file_path):
                    file.save(file_path)

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
            else:
                response = make_response(jsonify({
                    "message" : "File Type is not allowed"
                }))
                return response

        response = make_response(jsonify({
            "message" : "Images have been uploaded."
        }))

        return response

    @image_ns.marshal_list_with(images_model)
    @image_ns.expect(images_model)
    @jwt_required()
    def get(self, portfolio_short_code):
        """Get all Painter Portfolio Images"""
        email = get_jwt_identity()
        db_painter = Painter.query.filter_by(email = email).first()

        portfolios = Portfolio.query.all()
        painter_portfolio = []

        for x in range(0, len(portfolios)):
            if (portfolios[x].painter_id == db_painter.id):
                painter_portfolio.append(portfolios[x])

        db_images = Img.query.all()
        portfolio_images = []

        for x in range(0, len(db_images)):
            if (db_images[x].portfolio_id == painter_portfolio[0].id):
                portfolio_images.append(db_images[x])

        if portfolio_images: 
            return portfolio_images
        else:
            return []

@image_ns.route("/client/proposal/<string:proposal_short_code>/painter/portfolio/images")
class Painter_Portfolio(Resource):           
    @image_ns.marshal_with(images_model)
    @image_ns.expect(images_model)
    @jwt_required()
    def get(self, proposal_short_code):
        email = get_jwt_identity()
        current_client = Client.query.filter_by(email = email).first()
        if current_client is None:
            return []
        proposal = Proposal.query.filter_by(proposal_short_code = proposal_short_code).first()
        if proposal:
            painter_id = proposal.painter_id
            painter = Painter.query.get(painter_id)
        painter_portfolio = []
        portfolios = Portfolio.query.all()
        for x in range(0, len(portfolios)):
            if (portfolios[x].painter_id == painter_id):
                painter_portfolio.append(portfolios[x])

        db_images = Img.query.all()
        portfolio_images = []

        for x in range(0, len(db_images)):
            if (db_images[x].portfolio_id == painter_portfolio[0].id):
                portfolio_images.append(db_images[x])

        if portfolio_images: 
            return portfolio_images
        else:
            return []

@image_ns.route("/image/<string:image_short_code>")
class Image(Resource):
    @image_ns.marshal_list_with(images_model)
    @image_ns.expect(images_model)
    @jwt_required()
    def get(self, image_short_code):
        img = Img.query.filter_by(image_short_code = image_short_code).first()
        if not img:
            response = []
            return response

        return img
    
    @jwt_required()
    def delete(self, image_short_code):
        """Delete Image by image_short_code"""
        delete_image = Img.query.filter_by(image_short_code = image_short_code).first()
        if delete_image is None:
            response = make_response(jsonify({
                "message" : f"No Image with Short code {image_short_code}."
            }))
            return response
        else:
            delete_image.delete()
            upload_folder = current_app.config['UPLOAD_FOLDER']
            file_path = os.path.join(upload_folder, delete_image.name)
            if os.path.exists(file_path):
                os.remove(file_path)
            response = make_response(jsonify({
                "message" : f"Image {image_short_code} deleted."
            }))
            return response

