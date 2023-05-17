from decouple import config
import os

BASE_DIR = os.path.dirname(os.path.realpath(__file__))
#track the path of the file and get its directory name to create its connection string
class Config:
    #Configuration keys
    SECRET_KEY = config('SECRET_KEY')
    SQLALCHEMY_TRACK_MODIFICATIONS = config('SQLALCHEMY_TRACK_MODIFICATIONS', cast=bool)
    UPLOAD_FOLDER = config('UPLOAD_FOLDER')

class DevConfig(Config):
    SQLALCHEMY_DATABASE_URI = "sqlite:///"+os.path.join(BASE_DIR, "dev.db") #db.sqlite3 or "mysql://root@localhost/database-name"
    DEBUG = True
    SQLALCHEMY_ECHO = True
    SQLALCHEMY_MIGRATE_REPO = "sqlite:///"+os.path.join(BASE_DIR, "migration")

class ProdConfig(Config):
    pass

class TestConfig(Config):
    pass

