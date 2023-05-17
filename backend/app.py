from flask import Flask
from flask_restx import Api
from extensions import db
from models import Painter, Client, Job, Portfolio, Img, Proposal, Contract, Rating
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from painter_auth import painter_auth_ns
from client_auth import client_auth_ns
from job import job_ns
from proposal import proposal_ns
from contract import contract_ns
from login import user_auth_ns
from ratings import rating_ns
from portfolio import portfolio_ns
from images import image_ns
from flask_cors import CORS #Helps the frontend to work with the backend

# @app.route("/test")
# def test():
#     return {"Name:" : "Ryan Silu"}

def create_app(config): #application factory
    app = Flask(__name__)

    app.config.from_object(config)

    CORS(app) #configures API to work with an app located on a differnet port -> Go to package.json and add a proxy - "proxy" : "localhost:5000"

    db.init_app(app) #registers sqlalchemy to work with the app(current application)

    migrate = Migrate(app, db)

    JWTManager(app) #Makes the flask_jwt to work with the app 

    api = Api(app, doc = "/docs") #instance of the API, doc is the url we want our documentation

    api.add_namespace(painter_auth_ns)
    api.add_namespace(client_auth_ns)
    api.add_namespace(user_auth_ns)
    api.add_namespace(job_ns)
    api.add_namespace(proposal_ns)
    api.add_namespace(contract_ns)
    api.add_namespace(rating_ns)
    api.add_namespace(portfolio_ns)
    api.add_namespace(image_ns)

    @app.shell_context_processor
    def make_shell_context(): #Create a context in shell to access the db
        return {
            "db" : db,
            "Painter" : Painter,
            "Client" : Client,
            "Job" : Job,
            "Proposal" : Proposal,
            "Portfolio" : Portfolio,
            "Img" : Img,
            "Contract" : Contract,
            "Rating" : Rating
        }
    return app
