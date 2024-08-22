from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class userModel(db.Model):
    __tablename__ = "authenticationData"

    id = db.Column(db.Integer(), primary_key=True)
    username = db.Column(db.String(30), nullable=False, unique=True)
    fullName = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(50), nullable=False, unique=True)
    password = db.Column(db.String(100), nullable=False)

    def __init__(self, username, fullName, email, password):
        self.username = username
        self.fullName = fullName
        self.email = email
        self.password = password

class Appointment(db.Model):
    __tablename__ = 'appointments'

    id = db.Column(db.Integer, primary_key=True)
    fullName = db.Column(db.String(100), nullable=False)
    appointmentDate = db.Column(db.String(50), nullable=False)
    timeSlot = db.Column(db.String(50), nullable=False)
    wellnessService = db.Column(db.String(100), nullable=False)

    def __init__(self, fullName, appointmentDate, timeSlot, wellnessService):
        self.fullName = fullName
        self.appointmentDate = appointmentDate
        self.timeSlot = timeSlot
        self.wellnessService = wellnessService