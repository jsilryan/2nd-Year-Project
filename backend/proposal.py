from flask import Flask, request, jsonify, make_response
from flask_restx import Namespace, Resource, fields
from models import Job, Painter, Proposal, Client
from flask_jwt_extended import (JWTManager, create_access_token, 
create_refresh_token, jwt_required, get_jwt_identity
)
from datetime import datetime
import random

proposal_ns = Namespace("proposal", description = "Painter Proposal to a job")

proposal_model = proposal_ns.model(
    "Proposal Details",
    {
        "proposal_short_code" : fields.String(),
        "proposal_name" : fields.String(),
        "proposal_description" : fields.String(),
        "proposal_selection" : fields.Boolean(),
        "proposal_confirmed": fields.Boolean(),
        "proposal_date" : fields.DateTime(),
        "job_id" : fields.Integer(),
        'job_short_code': fields.String()
    }
)

@proposal_ns.route("/painter/job/<string:job_short_code>/proposals")
class Painter_Proposals(Resource):
    @proposal_ns.expect(proposal_model)
    @jwt_required()
    def post(self, job_short_code):
        """Create a proposal"""
        email = get_jwt_identity()

        current_painter = Painter.query.filter_by(email = email).first()
        if current_painter is None:
            response = make_response(jsonify({
                "message" : "Painter does not exist!"
            }))
            return response

        data = request.get_json()

        job = Job.query.filter_by(job_short_code = job_short_code).first()
        proposals = Proposal.query.all()
        if job is None:
            response = make_response(jsonify({
                "message" : f"Job with short code {job_short_code} does not exist!"
            }))
            return response
        else:
            for x in range(0, len(proposals)):
                if (current_painter.id == proposals[x].painter_id):
                    if (job.id == proposals[x].job_id): 
                        response = make_response(jsonify({
                            "message" : f"You cannot have more than 1 proposal for the same job {job.job_short_code}"
                        }))
                        return response

        #Get a random alphanumeric code of length 4
        character = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        char_list = list(character)
        code = random.choices(char_list, k=4)
        code = "".join(code)
        db_proposal = Proposal.query.filter_by(proposal_short_code=code).first()
        while (db_proposal is not None):
            code = random.choices(char_list, k=4)
            code = "".join(code)
        #I can have selected proposal for a job and still add proposals but once it is confirmed no more proposals are accepted
        for x in range(0, len(proposals)):
            if proposals[x].job_id == job.id:
                if proposals[x].proposal_confirmed == True:
                    response = make_response(jsonify({
                        "message" : f"Cannot create a proposal for Job {job_short_code} since it has a Confirmed Proposal."
                    }))
                    return response
                
        new_proposal = Proposal (
            proposal_short_code = code,
            proposal_name = data.get("proposal_name"),
            proposal_description = data.get("proposal_description"),
            job_id = job.id,
            painter_id = current_painter.id
        )

        new_proposal.save()

        response = make_response(jsonify({
            "message" : f"Proposal by {email} for Job {job_short_code} has been made."
        }))
        response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate" 
        return response


@proposal_ns.route("/painter/proposals")
class All_Proposals(Resource):
    @proposal_ns.marshal_list_with(proposal_model)
    @proposal_ns.expect(proposal_model)
    @jwt_required()
    def get(self):
        """Get all proposals belonging to 1 painter"""
        email = get_jwt_identity()
        current_painter = Painter.query.filter_by(email = email).first()
        painter_proposals = []
        proposals = Proposal.query.all()
        for x in range(0, len(proposals)):
            if (current_painter.id == proposals[x].painter_id):
                painter_proposals.append(proposals[x])

        return painter_proposals

@proposal_ns.route("/client/job/<string:job_short_code>/proposals")
class Proposals_Per_Job(Resource):
    @proposal_ns.marshal_list_with(proposal_model)
    @proposal_ns.expect(proposal_model)
    @jwt_required()
    def get(self, job_short_code):
        """Get all proposals per job."""
        current_job = Job.query.filter_by(job_short_code = job_short_code).first()
        if current_job is None:
            response = make_response(jsonify({
                "message": f"No job found with job_short_code '{job_short_code}'"
            }), 404)
            return response
        email = get_jwt_identity()
        db_client = Client.query.filter_by(email=email).first()
        client_jobs = []
        jobs = Job.query.all()
        job_proposals = []
        proposals = Proposal.query.all()
        #Will only display proposals of jobs belonging to the client else it will return an empty list
        for x in range(0, len(jobs)):
            if jobs[x].client_id == db_client.id:
                client_jobs.append(jobs[x])
        for x in range(0, len(client_jobs)):
            if client_jobs[x].id == current_job.id:
                for y in range(0, len(proposals)):
                    if(client_jobs[x].id == proposals[y].job_id):
                        job_proposals.append(proposals[y])
            
        if len(job_proposals) > 0:
            return job_proposals
        else:
            return []
            

@proposal_ns.route("/proposals/<string:proposal_short_code>")
class Modify_Proposal(Resource):
    @jwt_required()
    def put(self, proposal_short_code):
        """Update proposal"""
        email = get_jwt_identity()

        db_client = Client.query.filter_by(email = email).first()
        db_painter = Painter.query.filter_by(email = email).first()

        proposal_update = Proposal.query.filter_by(proposal_short_code = proposal_short_code).first()
        if proposal_update is None:
            response = make_response(jsonify({
                "message" : f"Proposal with proposal short code {proposal_short_code} does not exist!"
            }))
            return response

        if db_painter:
            data = request.get_json()
            if proposal_update.proposal_selection != True:
                if proposal_update.proposal_confirmed != True:
                    proposal_update.painter_update(
                        data.get("proposal_name"),
                        data.get("proposal_description")
                    )
                    response = make_response(jsonify({
                        "message" : "Proposal Updated"
                    }))
                else:
                    response = make_response(jsonify({
                        "message" : "Cannot update a confirmed proposal."
                    })) 
            else:
                response = make_response(jsonify({
                    "message" : "Cannot update a selected proposal."
                }))    
            return response
            
        elif db_client:
            data = request.get_json() 
            jobs = Job.query.all()
            client_jobs = []
            job_proposals = []
            for x in range(0, len(jobs)):
                if (db_client.id == jobs[x].client_id):
                    client_jobs.append(jobs[x])

            proposals = Proposal.query.all()
            for x in range(0, len(proposals)):
                for y in range(0, len(client_jobs)):
                    if (proposals[x].job_id == client_jobs[y].id):
                        if proposals[x].job_id == proposal_update.job_id:
                            job_proposals.append(proposals[x])

            selection = data.get("proposal_selection")
            selected_proposal = 0

            #If job_proposals are 0, it shows that the client does not have a job with that proposal
            if len(job_proposals) > 0:
                if selection == True:
                    for x in range(0, len(job_proposals)):
                        if job_proposals[x].proposal_selection == True:
                            selected_proposal += 1

                    if selected_proposal == 0:
                        proposal_update.client_update(selection)
                        response = make_response(jsonify({
                            "message" : "Proposal has been selected."
                        }))
                    else:
                        response = make_response(jsonify({
                            "message" : "Job already has a selected proposal"
                        }))
                else:
                    if proposal_update.proposal_confirmed != True:
                        proposal_update.client_update(selection)
                        response = make_response(jsonify({
                            "message": "Proposal has been deselected."
                        }))
                    else:
                        response = make_response(jsonify({
                            "message" : "Cannot deselect a confirmed proposal!" 
                        }))
                return response
            else:
                response = make_response(jsonify({
                    "message" : f"Proposal does not belong to a job by Client {db_client.first_name} {db_client.last_name}."
                }))
                return response

    @proposal_ns.marshal_with(proposal_model)
    @proposal_ns.expect(proposal_model)
    @jwt_required()
    def get(self, proposal_short_code):
        """Get details of a proposal via short code:"""
        proposal = Proposal.query.filter_by(proposal_short_code = proposal_short_code).first()
        job_id = proposal.job_id
        current_job = Job.query.get(job_id)

        if proposal:
            proposal_dict = proposal.__dict__
            proposal_dict["job_short_code"] = current_job.job_short_code

            return proposal_dict
        else:
            proposal = []
            return proposal

    @jwt_required()
    def delete(self, proposal_short_code):
        """Delete Proposal by proposal_short_code"""
        delete_proposal = Proposal.query.filter_by(proposal_short_code = proposal_short_code).first()
        if delete_proposal is None:
            response = make_response(jsonify({
                "message" : f"No proposal with Short code {proposal_short_code}."
            }))
            return response
        if delete_proposal.proposal_selection != True:
            if delete_proposal.proposal_confirmed != True:
                delete_proposal.delete()
                response = make_response(jsonify({
                    "message" : f"Proposal {proposal_short_code} deleted."
                }))
                return response
            else:
                response = make_response(jsonify({
                    "message" : f"Cannot delete a confirmed proposal."
                }))
                return response
        else:
            response = make_response(jsonify({
                "message" : f"Cannot delete a selected proposal."
            }))
            return response

@proposal_ns.route("/selected")
class Selected_Proposals(Resource):
    @proposal_ns.marshal_list_with(proposal_model)
    @proposal_ns.expect(proposal_model)
    @jwt_required()
    def get(self):
        """Get all selected proposals"""
        email = get_jwt_identity()
        db_painter = Painter.query.filter_by(email=email).first()
        db_client = Client.query.filter_by(email=email).first()
        proposals = Proposal.query.all()
        if db_painter:
            painter_proposals = []
            for x in range(0, len(proposals)):
                if (db_painter.id == proposals[x].painter_id):
                    if(proposals[x].proposal_selection == True):
                        painter_proposals.append(proposals[x])

            response = make_response(jsonify({
                "message" : "Selected Proposals:"
            }))
            return painter_proposals

        elif db_client:
            client_proposals = []
            client_jobs = []
            jobs = Job.query.all()
            for x in range(0, len(jobs)):
                if (db_client.id == jobs[x].client_id):
                    client_jobs.append(jobs[x])
            
            for x in range(0, len(client_jobs)):
                for y in range(0, len(proposals)):
                    if (client_jobs[x].id == proposals[y].job_id):
                        if(proposals[y].proposal_selection == True):
                            client_proposals.append(proposals[y])

            response = make_response(jsonify({
                "message" : "Selected Proposals:"
            }))
            return client_proposals

        
@proposal_ns.route("/confirmed")
class Confirmed_Proposals(Resource):
    @proposal_ns.marshal_list_with(proposal_model)
    @proposal_ns.expect(proposal_model)
    @jwt_required()
    def get(self):
        """Get all confirmed proposals"""
        email = get_jwt_identity()
        db_painter = Painter.query.filter_by(email=email).first()
        db_client = Client.query.filter_by(email=email).first()
        proposals = Proposal.query.all()
        if db_painter:
            painter_proposals = []
            for x in range(0, len(proposals)):
                if (db_painter.id == proposals[x].painter_id):
                    if(proposals[x].proposal_confirmed == True):
                        painter_proposals.append(proposals[x])

            return painter_proposals

        elif db_client:
            client_proposals = []
            client_jobs = []
            jobs = Job.query.all()
            for x in range(0, len(jobs)):
                if (db_client.id == jobs[x].client_id):
                    client_jobs.append(jobs[x])
            
            for x in range(0, len(client_jobs)):
                for y in range(0, len(proposals)):
                    if (client_jobs[x].id == proposals[y].job_id):
                        if(proposals[y].proposal_confirmed == True):
                            client_proposals.append(proposals[y])

            return client_proposals