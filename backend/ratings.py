from flask import Flask, request, jsonify, make_response
from flask_restx import Namespace, Resource, fields
from models import Job, Client, Painter, Proposal, Rating
from flask_jwt_extended import (JWTManager, create_access_token, 
create_refresh_token, jwt_required, get_jwt_identity
)
import random

rating_ns = Namespace("rating", description = "Painter Rating")

rating_model = rating_ns.model(
    "Ratings",
    {
        "rating_short_code" : fields.String(),
        "rating_no" : fields.Integer(),
        "painter_id" : fields.Integer()
    }
)

@rating_ns.route("/client/job/<string:job_short_code>/rating")
class Enter_Ratings(Resource):
    @jwt_required()
    def post(self, job_short_code):
        """Enter rating of the painter based on the job done"""
        data = request.get_json()
        job = Job.query.filter_by(job_short_code = job_short_code).first()
        ratings = Rating.query.all()
        if job is None:
            response = make_response(jsonify({
                "message" : f"Job_Short_Code {job_short_code} does not exist!"
            }))
            return response

        elif job.rated == True:
            response = make_response(jsonify({
                "message" : f"Job_Short_Code {job_short_code} has already been rated!"
            }))
            return response

        proposals = Proposal.query.all()
        proposals_conf = []
        for x in range(0, len(proposals)):
            if (proposals[x].job_id == job.id):
                if(proposals[x].proposal_confirmed == True):
                    proposals_conf.append(proposals[x])
                    if (job.job_completed == True):
                        painter_id = proposals[x].painter_id
                    else:
                        response = make_response(jsonify({
                            "message" : "Cannot create a rating for an incomplete job."
                        }))
                        return response
        if len(proposals_conf) <= 0:
            response = make_response(jsonify({
                "message" : "Cannot rate a job that has no confirmed proposal!"
            }))
            return response

        character = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        char_list = list(character)
        code = random.choices(char_list, k=4)
        code = "".join(code)
        db_rating = Rating.query.filter_by(rating_short_code=code).first()
        while (db_rating is not None):
            code = random.choices(char_list, k=4)
            code = "".join(code)

        rating_no = data.get("rating_no")
        new_rating = Rating (
            rating_short_code = code,
            rating_no = rating_no,
            painter_id = painter_id
        )
        new_rating.save()
        job.rated_update(True)
        painter = Painter.query.get_or_404(painter_id)
        response = make_response(jsonify({
            "message": f"Rating on Job {job_short_code} has been made for {painter.first_name} {painter.last_name} - {rating_no} STAR!"
        }))
        return response

@rating_ns.route("/painter/ratings")
class Check_All_Ratings(Resource):
    @rating_ns.marshal_list_with(rating_model)
    @rating_ns.expect(rating_model)
    @jwt_required()
    def get(self):
        """Get all ratings for a painter."""
        email = get_jwt_identity()
        db_painter = Painter.query.filter_by(email = email).first()

        ratings = Rating.query.all()
        painter_ratings = []
        for x in range(0, len(ratings)):
            if (db_painter.id == ratings[x].painter_id):
                painter_ratings.append(ratings[x])

        return painter_ratings


