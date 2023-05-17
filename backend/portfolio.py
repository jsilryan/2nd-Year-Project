from flask import Flask, request, jsonify, make_response
from flask_restx import Namespace, Resource, fields
from models import Job, Painter, Proposal, Client, Portfolio
from flask_jwt_extended import (JWTManager, create_access_token, 
create_refresh_token, jwt_required, get_jwt_identity
)
from datetime import datetime
import random
import requests
import pytz

portfolio_ns = Namespace("portfolio", description = "Painter Portfolio")

portfolio_model = portfolio_ns.model(
    "Portfolio Details",
    {
        "portfolio_short_code" : fields.String(),
        "description" : fields.String(),
        "painter_first_name" : fields.String(),
        "painter_last_name" : fields.String(),
        "painter_id" : fields.Integer()
    }
)

@portfolio_ns.route("/painter/portfolio")
class Painter_Portfolio(Resource):
    @portfolio_ns.expect(portfolio_model)
    @jwt_required()
    def post(self):
        email = get_jwt_identity()
        current_painter = Painter.query.filter_by(email = email).first()
        if current_painter is None:
            response = make_response(jsonify({
                "message" : "Painter does not exist!"
            }))
            return response
        portfolios = Portfolio.query.all()
        for x in range(0, len(portfolios)):
            if (portfolios[x].painter_id == current_painter.id):
                response = make_response(jsonify({
                    "message" : "You cannot have more than 1 portfolio!"
                }))
                return response

        data = request.get_json()

        character = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        char_list = list(character)
        code = random.choices(char_list, k=4)
        code = "".join(code)
        db_portfolio = Portfolio.query.filter_by(portfolio_short_code=code).first()
        while (db_portfolio is not None):
            code = random.choices(char_list, k=4)
            code = "".join(code)

        new_portfolio = Portfolio (
            portfolio_short_code = code,
            description = data.get("description"),
            painter_id = current_painter.id
        )
        new_portfolio.save()

        response = make_response(jsonify({
            "message" : f"Portfolio for {current_painter.first_name} {current_painter.last_name} has been made."
        }))
        response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate" 
        return response

    @portfolio_ns.marshal_with(portfolio_model)
    @portfolio_ns.expect(portfolio_model)
    @jwt_required()
    def get(self):
        email = get_jwt_identity()
        current_painter = Painter.query.filter_by(email = email).first()
        if current_painter is None:
            response = []
            return response
        painter_portfolio = []
        portfolios = Portfolio.query.all()
        for x in range(0, len(portfolios)):
            if (portfolios[x].painter_id == current_painter.id):
                painter_portfolio.append(portfolios[x])

        if painter_portfolio:
            portfolio_dict = painter_portfolio[0].__dict__
            portfolio_dict["painter_first_name"] = current_painter.first_name
            portfolio_dict["painter_last_name"] = current_painter.last_name

            return portfolio_dict
        else:
            response = []
            return response


@portfolio_ns.route("/client/proposal/<string:proposal_short_code>/painter/portfolio")
class Painter_Portfolio(Resource):           
    @portfolio_ns.marshal_with(portfolio_model)
    @portfolio_ns.expect(portfolio_model)
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

        if painter_portfolio:
            portfolio_dict = painter_portfolio[0].__dict__
            portfolio_dict["painter_first_name"] = painter.first_name
            portfolio_dict["painter_last_name"] = painter.last_name

            return portfolio_dict
        else:
            response = []
            return response

