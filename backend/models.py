from extensions import db
from sqlalchemy.sql import func 
from enum import Enum


"""
class Painter:
    id: int primary key
    first_name: str
    last_name: str
    gender: str
    email: str
    password: str
    country: str
    county: str
    painter_created_at: time
"""

class Gender(Enum):
    Male = "Male"
    Female = "Female"
    Other = "Other"

class Property_Type(Enum):
    Residential = "residential"  
    Commercial = "commercial"
    Industrial = "industrial"
    Institutional = "institutional"

class Job_Type(Enum):
    Exterior = "Exterior"
    Interior = "Interior"
    Both = "Both"

class Prop_Location(Enum):
    DagorettiNorth = "Dagoretti North"
    DagorettiSouth = "Dagoretti South"
    EmbakasiCentral = "Embakasi Central"
    EmbakasiEast = "Embakasi East"
    EmbakasiNorth = "Embakasi North"
    EmbakasiSouth = "Embakasi South"
    EmbakasiWest = "Embakasi West"
    Kamukunji = "Kamukunji"
    Kasarani = "Kasarani"
    Kibra = "Kibra"
    Langata = "Langata"
    Makadara = "Makadara"
    Mathare = "Mathare"
    NairobiCentral = "Nairobi Central"
    Roysambu = "Roysambu"
    Ruaraka = "Ruaraka"
    Starehe = "Starehe"
    Westlands = "Westlands"

class Contract_Type(Enum):
    Labour = "Labour" #Labour supplied by the painter, material by Client
    Material = "Labour and Material" #All material and labour supplied by the painter

class Painter(db.Model):
    __tablename__ = "painter"
    id = db.Column(db.Integer(), primary_key= True)
    first_name = db.Column(db.String(20), nullable = False)
    last_name = db.Column(db.String(20), nullable = False)
    gender = db.Column(db.Enum(Gender), nullable = False)
    email = db.Column(db.Text(), nullable = False, unique = True)
    password = db.Column(db.Text(), nullable = False)
    area = db.Column(db.Enum(Prop_Location), nullable = False)
    phone_number = db.Column(db.String(), nullable=False)
    painter_created_at = db.Column(db.DateTime(timezone=True),
                           server_default=func.now())
    proposals = db.relationship("Proposal", backref = "painter",lazy = True)
    portfolios = db.relationship("Portfolio", backref = "painter",lazy = True)
    ratings = db.relationship("Rating", backref = "painter",lazy = True)
    
    def __repr__(self):
        return f"<Painter {self.email}>"

    def save(self):
        db.session.add(self)
        db.session.commit()

"""
class Client:
    id: int primary key
    first_name: str
    last_name: str
    gender: str
    email: str
    password: str
    client_created_at: time
"""

class Client(db.Model):
    __tablename__ = "client"
    id = db.Column(db.Integer(), primary_key = True)
    first_name = db.Column(db.String(), nullable = False)
    last_name = db.Column(db.String(), nullable = False)
    gender = db.Column(db.Enum(Gender), nullable = False)
    email = db.Column(db.Text(), nullable = False, unique = True)
    password = db.Column(db.Text(), nullable = False)
    phone_number = db.Column(db.String(), nullable=False)
    client_created_at = db.Column(db.DateTime(timezone=True),
                           server_default=func.now())
    jobs = db.relationship("Job", backref = "client",lazy = True)

    def __repr__(self):
        return f"<Client {self.email}>"
    
    def save(self):
        db.session.add(self)
        db.session.commit()

    

class Job(db.Model):
    __tablename__ = "job"
    id = db.Column(db.Integer(), primary_key = True)
    job_short_code = db.Column(db.String(), nullable = False, unique = True) #Randomized - start with 4 digits
    job_name = db.Column(db.String(), nullable = False)
    job_description = db.Column(db.String(), nullable = False)
    property_location = db.Column(db.Enum(Prop_Location), nullable = False)
    property_type = db.Column(db.Enum(Property_Type), nullable = False)
    job_type = db.Column(db.Enum(Job_Type), nullable = False)
    contract_type = db.Column(db.Enum(Contract_Type), nullable = False)
    total_floors = db.Column(db.Integer(), nullable = False)
    total_rooms = db.Column(db.Integer(), nullable = False)
    start_date = db.Column(db.Date(), nullable = False)
    end_date = db.Column(db.Date(), nullable = False)
    job_confirmed = db.Column(db.Boolean(), default=False, nullable=False)
    job_completed = db.Column(db.Boolean(), default=False, nullable=False)
    client_id = db.Column(db.Integer(), db.ForeignKey("client.id"))
    max_proposals = db.Column(db.Integer(), nullable = False)
    rated = db.Column(db.Boolean(), default=False, nullable=False)
    job_created_at = db.Column(db.DateTime(timezone=True),
                           server_default=func.now())
    proposals = db.relationship("Proposal", backref = "job",lazy = True)
    contracts = db.relationship("Contract", backref = "job",lazy = True)

    def __repr__(self):
        return f"<Job {self.job_short_code}>"
    
    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self, job_name, job_description, property_location, property_type, job_type, contract_type, total_floors, total_rooms, start_date, end_date, max_proposals):
        self.job_name = job_name
        self.job_description = job_description
        self.property_location = property_location
        self.property_type = property_type
        self.job_type = job_type
        self.contract_type = contract_type
        self.total_floors = total_floors
        self.total_rooms = total_rooms
        self.start_date = start_date
        self.end_date = end_date
        self.max_proposals = max_proposals 
        db.session.commit()

    def confirmed_update(self, job_confirmed):
        self.job_confirmed = job_confirmed
        db.session.commit()

    def completed_update(self, job_completed):
        self.job_completed = job_completed
        db.session.commit()

    def rated_update(self, rated):
        self.rated = rated
        db.session.commit()

class Proposal(db.Model):
    __tablename__ = "proposal"
    id = db.Column(db.Integer(), primary_key = True)
    proposal_short_code = db.Column(db.String(), nullable = False, unique = True)
    proposal_date = db.Column(db.DateTime(timezone=True),
                           server_default=func.now("Africa/Nairobi"))
    proposal_name = db.Column(db.Text(), nullable = False)
    proposal_description = db.Column(db.Text(), nullable = False)
    proposal_selection = db.Column(db.Boolean(), default = False, nullable = False)
    proposal_confirmed = db.Column(db.Boolean(), default = False, nullable = False) #can be selected but not confirmed
    job_id = db.Column(db.Integer(), db.ForeignKey("job.id"))
    painter_id = db.Column(db.Integer(), db.ForeignKey("painter.id"))

    def __repr__(self):
        return f"<Proposal {self.id}>"
    
    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def painter_update(self, proposal_name, proposal_description):
        self.proposal_name = proposal_name
        self.proposal_description = proposal_description
        db.session.commit()

    def client_update(self, proposal_selection):
        self.proposal_selection = proposal_selection
        db.session.commit()
    
    def confirmed_update(self, proposal_confirmed):
        self.proposal_confirmed = proposal_confirmed
        db.session.commit()



class Portfolio(db.Model):
    __tablename__ = "portfolio"
    id = db.Column(db.Integer(), primary_key = True)
    portfolio_short_code = db.Column(db.String(), nullable = False)
    portfolio_created_at = db.Column(db.DateTime(timezone=True),
                           server_default=func.now("Africa/Nairobi"))
    description = db.Column(db.String(), nullable = False)
    painter_id = db.Column(db.Integer(), db.ForeignKey("painter.id"))
    images = db.relationship("Img", backref = "portfolio",lazy = True)
    
    def __repr__(self):
        return f"<Portfolio {self.id}>"
    
    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def portfolio_update(self, description):
        self.description = description
        db.session.commit()


class Img(db.Model):
    __tablename__ = "img"
    id = db.Column(db.Integer(), primary_key = True)
    image_short_code = db.Column(db.String(), nullable = False, unique = True)
    img = db.Column(db.Text(), nullable=False)
    name = db.Column(db.Text(), nullable=False)
    mimetype = db.Column(db.Text(), nullable=False) #type of image; jpeg, png etc
    portfolio_id = db.Column(db.Integer(), db.ForeignKey("portfolio.id"))

    def __repr__(self):
        return f"<Image {self.id}>"
    
    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

#Finish up
class Contract(db.Model):
    __tablename__= "contract"
    id = db.Column(db.Integer(), primary_key = True)
    contract_short_code = db.Column(db.String(), nullable = False, unique = True)
    materials = db.Column(db.String(), nullable = True)
    exterior_lumpsum = db.Column(db.Integer(), nullable=True)
    interior_preparation = db.Column(db.Integer(), nullable=True)
    interior_finishing = db.Column(db.Integer(), nullable=True)
    total_payment_amount = db.Column(db.Integer(), nullable=False)
    client_sign = db.Column(db.Boolean(), default = False, nullable = False)
    painter_sign = db.Column(db.Boolean(), default = False, nullable = False)
    signed = db.Column(db.Boolean(), default = False, nullable = False)
    signed_at = db.Column(db.DateTime(), nullable = True)
    job_id = db.Column(db.Integer(), db.ForeignKey("job.id"))

    def __repr__(self):
        return f"<Contract {self.id}>"
    
    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def painter_update(self, painter_sign):
        self.painter_sign = painter_sign
        db.session.commit()

    def client_exterior_update(self, exterior_lumpsum, total_payment_amount, client_sign):
        self.exterior_lumpsum = exterior_lumpsum
        self.total_payment_amount = total_payment_amount
        self.client_sign = client_sign
        db.session.commit()

    def client_interior_update(self, interior_preparation, interior_finishing, total_payment_amount, client_sign):
        self.interior_preparation = interior_preparation
        self.interior_finishing = interior_finishing
        self.total_payment_amount = total_payment_amount
        self.client_sign = client_sign
        db.session.commit()
    
    def client_both_update(self, exterior_lumpsum, interior_preparation, interior_finishing, total_payment_amount, client_sign):
        self.exterior_lumpsum = exterior_lumpsum
        self.interior_preparation = interior_preparation
        self.interior_finishing = interior_finishing
        self.total_payment_amount = total_payment_amount
        self.client_sign = client_sign
        db.session.commit()
    
    def client_material_exterior_update(self, materials, exterior_lumpsum, total_payment_amount, client_sign):
        self.materials = materials
        self.exterior_lumpsum = exterior_lumpsum
        self.total_payment_amount = total_payment_amount
        self.client_sign = client_sign
        db.session.commit()

    def client_material_interior_update(self, materials, interior_preparation, interior_finishing, total_payment_amount, client_sign):
        self.materials = materials
        self.interior_preparation = interior_preparation
        self.interior_finishing = interior_finishing
        self.total_payment_amount = total_payment_amount
        self.client_sign = client_sign
        db.session.commit()
    
    def client_material_both_update(self, materials, exterior_lumpsum, interior_preparation, interior_finishing, total_payment_amount, client_sign):
        self.materials = materials
        self.exterior_lumpsum = exterior_lumpsum
        self.interior_preparation = interior_preparation
        self.interior_finishing = interior_finishing
        self.total_payment_amount = total_payment_amount
        self.client_sign = client_sign
        db.session.commit()

    def update_signing_info(self, signed, signed_at):
        self.signed = signed
        self.signed_at = signed_at
        db.session.commit()


class Rating(db.Model):
    __tablename__ = "rating"
    id = db.Column(db.Integer(), primary_key = True)
    rating_short_code = db.Column(db.String(), nullable = False, unique = True)
    rating_no = db.Column(db.Integer(), nullable=False)
    painter_id = db.Column(db.Integer(), db.ForeignKey("painter.id"))

    def __repr__(self):
        return f"<Rating {self.id}>"
    
    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()


