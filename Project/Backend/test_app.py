import pytest
from flask import session
from Auth import app, db, userModel, Appointment  #  actual import statements

@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'  # Use an in-memory database for testing
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
        yield client

def test_register(client):
    # Test registration endpoint
    data = {
        'username': 'testuser',
        'fullName': 'Test User',
        'email': 'testuser@example.com',
        'password': 'testpassword'
    }
    response = client.post('/register', json=data)
    assert response.status_code == 200
    assert b'User registered successfully' in response.data

def test_login(client):
    # Test login endpoint
    data = {
        'username': 'testuser',
        'password': 'testpassword'
    }
    response = client.post('/login', json=data)
    assert response.status_code == 200
    assert session['username'] == 'testuser'  # Check if session is set correctly

def test_appointments(client):
    # Test appointments endpoint (GET)
    response = client.get('/appointments')
    assert response.status_code == 200
    # You can add more assertions based on the expected JSON response

def test_create_appointment(client):
    # Test create appointment endpoint (POST)
    data = {
        'fullName': 'Test Patient',
        'appointmentDate': '2024-07-10',
        'timeSlot': '10:00 AM',
        'wellnessService': 'Yoga Classes'
    }
    response = client.post('/appointments', json=data)
    assert response.status_code == 201
    assert b'Appointment created successfully' in response.data

def test_update_appointment(client):
    # Test update appointment endpoint (PUT)
    data = {
        'fullName': 'Updated Patient',
        'appointmentDate': '2024-07-10',
        'timeSlot': '11:00 AM',
        'wellnessService': 'Group Fitness'
    }
    response = client.put('/appointments/1', json=data)  # Replace 1 with a valid appointment ID
    assert response.status_code == 200
    assert b'Appointment updated successfully' in response.data

def test_delete_appointment(client):
    # Test delete appointment endpoint (DELETE)
    response = client.delete('/appointments/1')  # Replace 1 with a valid appointment ID
    assert response.status_code == 200
    assert b'Appointment deleted successfully' in response.data

