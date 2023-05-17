from flask import Flask, request, jsonify, make_response
from flask_restx import Namespace, Resource, fields
from models import Job, Client, Painter, Proposal, Contract
from flask_jwt_extended import (JWTManager, create_access_token, 
create_refresh_token, jwt_required, get_jwt_identity
)
from datetime import datetime, time
import random
import requests
import pytz

contract_ns = Namespace("contract", description = "Contract Creation")

contract_model = contract_ns.model (
    "Contract Details",
    {
        "contract_short_code" : fields.String(),
        "total_payment_amount" : fields.String(),
        "client_sign" : fields.Boolean(),
        "painter_sign" : fields.Boolean(),
        "materials" : fields.String(),
        "exterior_lumpsum" : fields.String(),
        "interior_preparation" : fields.String(),
        "interior_finishing" :fields.String(),
        "signed" : fields.Boolean(),
        "signed_at" : fields.DateTime(),
        "job_id" : fields.Integer(),
        'job_short_code': fields.String(),
        "client_first_name" : fields.String(),
        "client_last_name" : fields.String(),
        "painter_first_name" : fields.String(),
        "painter_last_name" : fields.String(),
        "painter_number" : fields.String(),
        "client_number" : fields.String()
    }
)


@contract_ns.route("/client/job/<string:job_short_code>/contract")
class Create_Contract(Resource):
    @contract_ns.expect(contract_model)
    @jwt_required()
    def post(self, job_short_code):
        """Create a contract:"""
        email = get_jwt_identity()
        db_client = Client.query.filter_by(email = email).first()
        data = request.get_json()
        job = Job.query.filter_by(job_short_code = job_short_code).first()
        if job is None:
            response = make_response(jsonify({
                "message" : f"Job with short code {job_short_code} does not exist!"
            }))
            return response

        #Get a random alphanumeric code of length 4
        character = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        char_list = list(character)
        code = random.choices(char_list, k=4)
        code = "".join(code)
        db_contract = Contract.query.filter_by(contract_short_code=code).first()
        while (db_contract is not None):
            code = random.choices(char_list, k=4)
            code = "".join(code)
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
        
        new_date = datetime.now(local_tz)
        signed_at = datetime.strptime(new_date.strftime('%Y-%m-%d %H:%M:%S'), '%Y-%m-%d %H:%M:%S')

        all_contracts = Contract.query.all()
        contracted = []
        for x in range(0, len(all_contracts)):
            if (job.id == all_contracts[x].job_id):
                contracted.append(all_contracts[x])

        job_proposals = []
        proposals = Proposal.query.all()
        for x in range(0, len(proposals)):
            if (proposals[x].job_id == job.id):
                job_proposals.append(proposals[x])
        
        selected_proposal = 0
        for x in range(0, len(job_proposals)):
            if job_proposals[x].proposal_selection == True:
                selected_proposal += 1

        if len(contracted) > 0:
            response = make_response(jsonify({
                    "message" : f"Job {job_short_code} has a contract!"
            }))
        else:
            if selected_proposal > 0:
                new_contract = Contract (
                    contract_short_code = code,
                    materials = data.get("materials"),
                    exterior_lumpsum = data.get("exterior_lumpsum"),
                    interior_preparation = data.get("interior_preparation"),
                    interior_finishing = data.get("interior_finishing"),
                    total_payment_amount = data.get("total_payment_amount"),
                    client_sign = data.get("client_sign"),
                    signed_at = signed_at,
                    job_id = job.id
                )
                new_contract.save()
                # if job.contract_type == "Contract_Type.labour":
                #     if job.job_type == "Job_Type.exterior":
                #         new_contract = Contract (
                #             contract_short_code = code,
                #             total_payment_amount = data.get("total_payment_amount"),
                #             client_sign = data.get("client_sign"),
                #             exterior_lumpsum = data.get("exterior_lumpsum"),
                #             signed_at = signed_at,
                #             job_id = job.id
                #         )
                #     elif job.job_type == "Job_Type.interior":
                #         new_contract = Contract (
                #             contract_short_code = code,
                #             interior_preparation = data.get("interior_preparation"),
                #             interior_finishing = data.get("interior_finishing"),
                #             total_payment_amount = data.get("total_payment_amount"),
                #             client_sign = data.get("client_sign"),
                #             signed_at = signed_at,
                #             job_id = job.id
                #         )
                #     else:
                #         new_contract = Contract (
                #             contract_short_code = code,
                #             exterior_lumpsum = data.get("exterior_lumpsum"),
                #             interior_preparation = data.get("interior_preparation"),
                #             interior_finishing = data.get("interior_finishing"),
                #             total_payment_amount = data.get("total_payment_amount"),
                #             client_sign = data.get("client_sign"),
                #             signed_at = signed_at,
                #             job_id = job.id
                #         )
                #     new_contract.save()
                # else: 
                #     if job.job_type == "Job_Type.exterior":
                #         new_contract = Contract (
                #             contract_short_code = code,
                #             materials = data.get("materials"),
                #             total_payment_amount = data.get("total_payment_amount"),
                #             client_sign = data.get("client_sign"),
                #             exterior_lumpsum = data.get("exterior_lumpsum"),
                #             signed_at = signed_at,
                #             job_id = job.id
                #         )
                #     elif job.job_type == "Job_Type.interior":
                #         new_contract = Contract (
                #             contract_short_code = code,
                #             materials = data.get("materials"),
                #             interior_preparation = data.get("interior_preparation"),
                #             interior_finishing = data.get("interior_finishing"),
                #             total_payment_amount = data.get("total_payment_amount"),
                #             client_sign = data.get("client_sign"),
                #             signed_at = signed_at,
                #             job_id = job.id
                #         )
                #     else:
                #         new_contract = Contract (
                #             contract_short_code = code,
                #             materials = data.get("materials"),
                #             exterior_lumpsum = data.get("exterior_lumpsum"),
                #             interior_preparation = data.get("interior_preparation"),
                #             interior_finishing = data.get("interior_finishing"),
                #             payment_amount = data.get("payment_amount"),
                #             client_sign = data.get("client_sign"),
                #             signed_at = signed_at,
                #             job_id = job.id
                #         )
                #     new_contract.save()
                
                response = make_response(jsonify({
                    "message" : "Contract created successfully."
                }))
            else:
                response = make_response(jsonify({
                    "message" : "Job does not have a selected proposal."
                }))
        response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate" 
        return response

@contract_ns.route("/client/pending-contracts")
class Client_Contracts(Resource):
    @contract_ns.marshal_list_with(contract_model)
    @contract_ns.expect(contract_model)
    @jwt_required()
    def get(self):
        """Get all Pending Contracts by a client"""
        email = get_jwt_identity()
        db_client = Client.query.filter_by(email = email).first()
        contracts = Contract.query.all()
        jobs = Job.query.all()
        client_jobs = []
        pending_client_contracts = []
        #Check if Client ID is the same as the client ID in the job
        for x in range(0, len(jobs)):
            if (db_client.id == jobs[x].client_id):
                client_jobs.append(jobs[x])

        for x in range(0, len(client_jobs)):
            for y in range(0, len(contracts)):
                if (client_jobs[x].id == contracts[y].job_id):
                    if (contracts[y].signed == False):
                        current_job = Job.query.get(contracts[y].job_id)
                        contract_dict = contracts[y].__dict__
                        contract_dict["job_short_code"] = current_job.job_short_code
                        pending_client_contracts.append(contract_dict)

        return pending_client_contracts

@contract_ns.route("/painter/pending-contracts")
class Get_Painter_Contracts(Resource):
    @contract_ns.marshal_list_with(contract_model)
    @contract_ns.expect(contract_model)
    @jwt_required()
    def get(self):
        """Get all Pending Contracts by a painter"""
        pending_painter_contracts = []
        painter_proposals = []
        email = get_jwt_identity()
        db_painter = Painter.query.filter_by(email = email).first()
        contracts = Contract.query.all()
        proposals = Proposal.query.all()
        if db_painter:
            for x in range(0, len(proposals)):
                if (db_painter.id == proposals[x].painter_id):
                    painter_proposals.append(proposals[x])

            for x in range(0, len(painter_proposals)):
                for y in range(0, len(contracts)):
                    if (painter_proposals[x].job_id == contracts[y].job_id):
                        if (contracts[y].signed == False):
                            current_job = Job.query.get(contracts[y].job_id)
                            contract_dict = contracts[y].__dict__
                            contract_dict["job_short_code"] = current_job.job_short_code
                            pending_painter_contracts.append(contract_dict)
            
            return pending_painter_contracts
        else:
            response = []
            return response

@contract_ns.route("/contract/<string:contract_short_code>")
class Modify_Contract(Resource):
    @jwt_required()
    def put(self, contract_short_code):
        """Edit Contract"""
        email = get_jwt_identity()
        db_client = Client.query.filter_by(email = email).first()
        db_painter = Painter.query.filter_by(email = email).first()
        contract_update = Contract.query.filter_by(contract_short_code = contract_short_code).first()
        if contract_update is None:
            response = make_response(jsonify({
                "message" : f"Contract with contract short code {contract_short_code} does not exist!"
            }))
            return response
        # If a client updates the contract, if the painter had initially signed the contract, it is unsigned since a change in amount might have taken place 
        # and will need a painter to check the contract again before confirming it. Only when a painter signs the contract when the client has signed does it 
        # become a signed contract.
        if contract_update.signed == True:
            response = make_response(jsonify({
                "message" : "Cannot edit a signed contract."
            }))
            return response

        job_id = contract_update.job_id
        job = Job.query.filter_by(id = job_id).first()

        if db_client:
            data = request.get_json()
            if contract_update.signed == False:
                if data.get("total_payment_amount") != contract_update.total_payment_amount:
                    contract_update.painter_sign = False
                    contract_update.client_material_both_update(
                        data.get("materials"),
                        data.get("exterior_lumpsum"),
                        data.get("interior_preparation"),
                        data.get("interior_finishing"),
                        data.get("total_payment_amount"),
                        data.get("client_sign")
                    )

                else:
                    contract_update.client_material_both_update(
                        data.get("materials"),
                        data.get("exterior_lumpsum"),
                        data.get("interior_preparation"),
                        data.get("interior_finishing"),
                        data.get("total_payment_amount"),
                        data.get("client_sign")
                    )
                #     if job.contract_type == "Contract_Type.labour":
                #         if job.job_type == "Job_Type.exterior":
                #             contract_update.client_exterior_update(
                #                 data.get("exterior_lumpsum"),
                #                 data.get("total_payment_amount"),
                #                 data.get("client_sign")
                #             )
                #         elif job.job_type == "Job_Type.interior":
                #             contract_update.client_interior_update(
                #                 data.get("interior_preparation"),
                #                 data.get("interior_finishing"),
                #                 data.get("total_payment_amount"),
                #                 data.get("client_sign")
                #             )
                #         else:
                #             contract_update.client_both_update(
                #                 data.get("exterior_lumpsum"),
                #                 data.get("interior_preparation"),
                #                 data.get("interior_finishing"),
                #                 data.get("total_payment_amount"),
                #                 data.get("client_sign")
                #             )
                #     else:
                #         if job.job_type == "Job_Type.exterior":
                #             contract_update.client_material_exterior_update(
                #                 data.get("materials"),
                #                 data.get("exterior_lumpsum"),
                #                 data.get("total_payment_amount"),
                #                 data.get("client_sign")
                #             )
                #         elif job.job_type == "Job_Type.interior":
                #             contract_update.client_material_interior_update(
                #                 data.get("materials"),
                #                 data.get("interior_preparation"),
                #                 data.get("interior_finishing"),
                #                 data.get("total_payment_amount"),
                #                 data.get("client_sign")
                #             )
                #         else:
                #             contract_update.client_material_both_update(
                #                 data.get("materials"),
                #                 data.get("exterior_lumpsum"),
                #                 data.get("interior_preparation"),
                #                 data.get("interior_finishing"),
                #                 data.get("total_payment_amount"),
                #                 data.get("client_sign")
                #             )
                # else:
                #     if job.contract_type == "Contract_Type.labour":
                #         if job.job_type == "Job_Type.exterior":
                #             contract_update.client_exterior_update(
                #                 data.get("exterior_lumpsum"),
                #                 data.get("total_payment_amount"),
                #                 data.get("client_sign")
                #             )
                #         elif job.job_type == "Job_Type.interior":
                #             contract_update.client_interior_update(
                #                 data.get("interior_preparation"),
                #                 data.get("interior_finishing"),
                #                 data.get("total_payment_amount"),
                #                 data.get("client_sign")
                #             )
                #         else:
                #             contract_update.client_both_update(
                #                 data.get("exterior_lumpsum"),
                #                 data.get("interior_preparation"),
                #                 data.get("interior_finishing"),
                #                 data.get("total_payment_amount"),
                #                 data.get("client_sign")
                #             )
                #     else:
                #         if job.job_type == "Job_Type.exterior":
                #             contract_update.client_material_exterior_update(
                #                 data.get("materials"),
                #                 data.get("exterior_lumpsum"),
                #                 data.get("total_payment_amount"),
                #                 data.get("client_sign")
                #             )
                #         elif job.job_type == "Job_Type.interior":
                #             contract_update.client_material_interior_update(
                #                 data.get("materials"),
                #                 data.get("interior_preparation"),
                #                 data.get("interior_finishing"),
                #                 data.get("total_payment_amount"),
                #                 data.get("client_sign")
                #             )
                #         else:
                #             contract_update.client_material_both_update(
                #                 data.get("materials"),
                #                 data.get("exterior_lumpsum"),
                #                 data.get("interior_preparation"),
                #                 data.get("interior_finishing"),
                #                 data.get("total_payment_amount"),
                #                 data.get("client_sign")
                #             )
            else:
                response = make_response(jsonify({
                    "message" : "Cannot edit a signed contract."
                }))
                return response


        elif db_painter:
            data = request.get_json()
            if contract_update.signed == False:
                contract_update.painter_update(
                    data.get("painter_sign")
                )    
            else:
                response = make_response(jsonify({
                    "message" : "Cannot edit a signed contract."
                }))
                return response
           

        if (contract_update.client_sign == True and contract_update.painter_sign == True):  
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
            new_date = datetime.now(local_tz)
            signed_at = datetime.strptime(new_date.strftime('%Y-%m-%d %H:%M:%S'), '%Y-%m-%d %H:%M:%S')
            #Update signed and signed_at fields
            contract_update.update_signing_info(
                True,
                signed_at
            )
            job_id = contract_update.job_id
            job = Job.query.filter_by(id = job_id).first()

            job.confirmed_update(True)
            start_date_str = datetime.now()
            start_date = datetime.strptime(start_date_str.strftime('%Y-%m-%d %H:%M:%S'), '%Y-%m-%d %H:%M:%S')

            #Make the starting date the current date
            # job_update.update (
            #     job.job_name,
            #     job.job_description,
            #     job.property_location,
            #     job.property_type,
            #     job.job_type,
            #     job.total_floors, 
            #     job.total_rooms, 
            #     start_date,
            #     job.end_date,
            #     job.max_proposals
            # )
            client_id = job.client_id
            proposals = Proposal.query.all()
            for x in range(0, len(proposals)):
                if (job.id == proposals[x].job_id):
                    if (proposals[x].proposal_selection == True):
                        painter_id = proposals[x].painter_id
                        proposals[x].confirmed_update(True)

            client = Client.query.filter_by(id = client_id).first()
            painter = Painter.query.filter_by(id = painter_id).first()
            response = make_response(jsonify({
                "message" : f"Contract {contract_short_code} between {client.first_name} {client.last_name} and {painter.first_name} {painter.last_name} has been made at {contract_update.signed_at} for {contract_update.total_payment_amount}." 
            }))
        else:
            response = make_response(jsonify({
                "message" : "Contract updated successfully!"
            }))
        response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate" 
        return response

    @jwt_required() 
    def delete(self, contract_short_code):
        """Delete Contract by contract_short_code"""
        delete_contract = Contract.query.filter_by(contract_short_code = contract_short_code).first()
        if delete_contract is None:
            response = make_response(jsonify({
                "message" : f"No contract with Short code {contract_short_code}."
            }))
            return response
        if delete_contract.signed != True:
            delete_contract.delete()
            response = make_response(jsonify({
                "message" : f"Contract {contract_short_code} deleted."
            }))
            return response
        else:
            response = make_response(jsonify({
                "message" : "Cannot delete a signed contract."
            }))
            return response

    @contract_ns.marshal_with(contract_model)
    @contract_ns.expect(contract_model)
    @jwt_required()
    def get(self, contract_short_code):
        """Get details of a contract via short code:"""
        contract = Contract.query.filter_by(contract_short_code = contract_short_code).first()
        job_id = contract.job_id
        current_job = Job.query.get(job_id) 
        client_id = current_job.client_id
        proposals = Proposal.query.all()
        job_proposals = []
        for x in range(0, len(proposals)):
            if proposals[x].job_id == current_job.id:
                job_proposals.append(proposals[x])
        for x in range(0, len(job_proposals)):
            if job_proposals[x].proposal_selection == True:
                confirmed_proposal = job_proposals[x]

        painter_id = confirmed_proposal.painter_id
        painter = Painter.query.get(painter_id)
        client = Client.query.get(client_id)
        if contract:
            contract_dict = contract.__dict__
            contract_dict["job_short_code"] = current_job.job_short_code
            contract_dict["client_first_name"] = client.first_name
            contract_dict["client_last_name"] = client.last_name
            contract_dict["painter_first_name"] = painter.first_name
            contract_dict["painter_last_name"] = painter.last_name
            contract_dict["painter_number"] = painter.phone_number
            contract_dict["client_number"] = client.phone_number
            return contract_dict
        else:
            response = []
            return response


@contract_ns.route("/signed")
class Signed_Contracts(Resource):
    @contract_ns.marshal_list_with(contract_model)
    @contract_ns.expect(contract_model)
    @jwt_required()
    def get(self):
        """Get all signed contracts"""
        email = get_jwt_identity()
        db_painter = Painter.query.filter_by(email=email).first()
        db_client = Client.query.filter_by(email=email).first()
        contracts = Contract.query.all()
        proposals = Proposal.query.all()
        jobs = Job.query.all()
        signed_contracts = []

        if db_client:
            client_jobs = []
            for x in range(0, len(jobs)):
                if (jobs[x].client_id == db_client.id):
                    client_jobs.append(jobs[x])
            for x in range(0, len(client_jobs)):
                for y in range(0, len(contracts)):
                    if (client_jobs[x].id == contracts[y].job_id):
                        if (contracts[y].signed == True):
                            current_job = Job.query.get(contracts[y].job_id)
                            contract_dict = contracts[y].__dict__
                            contract_dict["job_short_code"] = current_job.job_short_code
                            signed_contracts.append(contract_dict)

        elif db_painter:
            painter_proposals = []
            selected_painter_proposals = []
            confirmed_painter_jobs = []
            for x in range(0, len(proposals)):
                if (db_painter.id == proposals[x].painter_id):
                    painter_proposals.append(proposals[x])
            for x in range(0, len(painter_proposals)):
                if (painter_proposals[x].proposal_selection == True):
                    selected_painter_proposals.append(painter_proposals[x])
            for x in range(0, len(selected_painter_proposals)):
                job_id = selected_painter_proposals[x].job_id
                job = Job.query.filter_by(id = job_id).first()
                confirmed_painter_jobs.append(job)
            for x in range(0, len(confirmed_painter_jobs)):
                for y in range(0, len(contracts)):
                    if confirmed_painter_jobs[x].id == contracts[y].job_id:
                        if contracts[y].signed == True:
                            current_job = Job.query.get(contracts[y].job_id)
                            contract_dict = contracts[y].__dict__
                            contract_dict["job_short_code"] = current_job.job_short_code
                            signed_contracts.append(contract_dict)

        if len(signed_contracts) > 0:
            response = signed_contracts
        else:
            response = []

        return response