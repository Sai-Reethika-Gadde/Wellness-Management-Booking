from flask import Flask, request, session, jsonify
from flask_restful import Resource, Api
from flask_sqlalchemy import SQLAlchemy
import bcrypt
from model import userModel, db, Appointment
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

app.config['SECRET_KEY'] = 'super secret key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:Password%401@localhost:3306/test'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()

api = Api(app)

class register(Resource):
    def post(self):
        data = request.get_json()
        username = data.get('username')
        fullName = data.get('fullName')
        email = data.get('email')
        password = data.get('password')

        user = userModel.query.filter_by(username=username).first() or userModel.query.filter_by(email=email).first()
        if user:
            return 'User already exists', 401

        new_user = userModel(username=username, fullName=fullName, email=email, password=password)
        db.session.add(new_user)
        db.session.commit()
        return 'User registered successfully', 200

class Login(Resource):
    def post(self):
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        user = userModel.query.filter_by(username=username, password=password).first()

        if user:
            session['username'] = user.username  # Store the username in session
            return 'Logged In Successfully', 200
        else:
            return 'Invalid User or Password', 401


def is_slot_available(appointmentDate, timeSlot, appointment_id=None):
    query = Appointment.query.filter_by(appointmentDate=appointmentDate, timeSlot=timeSlot)
    if appointment_id:
        query = query.filter(Appointment.id != appointment_id)
    return query.count() == 0


# Appointments Resource
class Appointments(Resource):
    def get(self):
        appointments = Appointment.query.all()
        result = []
        for appointment in appointments:
            result.append({
                'id': appointment.id,
                'fullName': appointment.fullName,
                'appointmentDate': appointment.appointmentDate,
                'timeSlot': appointment.timeSlot,
                'wellnessService': appointment.wellnessService
            })
        return jsonify(result)

    def post(self):
        data = request.get_json()
        appointmentDate = data['appointmentDate']
        timeSlot = data['timeSlot']

        if not is_slot_available(appointmentDate, timeSlot):
            return 'Time slot not available', 409

        new_appointment = Appointment(
            fullName=data['fullName'],
            appointmentDate=appointmentDate,
            timeSlot=timeSlot,
            wellnessService=data['wellnessService']
        )
        db.session.add(new_appointment)
        db.session.commit()
        return 'Appointment created successfully', 201


# AppointmentID Resource for PUT and DELETE
class AppointmentID(Resource):
    def put(self, appointment_id):
        try:
            appointment = Appointment.query.get(appointment_id)
            if not appointment:
                return 'Appointment not found', 404

            data = request.get_json()
            if 'fullName' in data:
                appointment.fullName = data['fullName']
            if 'appointmentDate' in data and 'timeSlot' in data:
                appointmentDate = data['appointmentDate']
                timeSlot = data['timeSlot']
                if not is_slot_available(appointmentDate, timeSlot, appointment_id):
                    return 'Time slot not available', 409
                appointment.appointmentDate = appointmentDate
                appointment.timeSlot = timeSlot
            if 'wellnessService' in data:
                appointment.wellnessService = data['wellnessService']

            db.session.commit()
            return 'Appointment updated successfully', 200
        except Exception as e:
            return str(e), 500

    def delete(self, appointment_id):
        try:
            appointment = Appointment.query.get(appointment_id)
            if not appointment:
                return 'Appointment not found', 404

            db.session.delete(appointment)
            db.session.commit()
            return 'Appointment deleted successfully', 200
        except Exception as e:
            return str(e), 500


api.add_resource(register, "/register")
api.add_resource(Login, "/login")
api.add_resource(Appointments, "/appointments")
api.add_resource(AppointmentID, "/appointments/<int:appointment_id>")


@app.route('/hello')
def hello():
    return 'Hello'


app.run(port=8080,debug=True)
