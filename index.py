from flask import Flask, render_template, request, session, redirect, url_for, flash
import random
import ssl
import smtplib
from email.message import EmailMessage
import os
import json

app = Flask(__name__)
app.secret_key = 'MyRandomKeyIDK2009' 

my_email = 'futureana735@gmail.com'
my_password = 'zsru iwbh ryks sdxi'


@app.route('/')
def main_page():
    return render_template('sign_up.html', title = 'FINEbank.IO - Sign up')

@app.route('/sign_up', methods=['POST'])
def sign_up():
    name = request.form.get('name')
    email = request.form.get('email')
    password = request.form.get('password')

    try:
        with open('all_user.txt', 'r', encoding='utf-8') as f:
            lines = f.readlines()
            for line in lines:
                if line.strip().startswith("Email:") and email.lower() == line.strip().split("Email:")[1].strip().lower():
                    return render_template('sign_up.html', text = 'This email is alredy registered')
    except FileNotFoundError:
        pass
    
    code = ''
    for i in range(4):
        code += random.choice('0123456789')

    session['code'] = code
    session['email'] = email
    session['name'] = name  
    session['password'] = password


    subject = f'Hello {name}!'
    body = f"Your verification code is: {code}"

    em = EmailMessage()
    em['From'] = my_email
    em['To'] = email
    em['Subject'] = subject
    em.set_content(body)

    context = ssl.create_default_context()
    with smtplib.SMTP_SSL('smtp.gmail.com', 465, context = context) as smtp:
        smtp.login(my_email, my_password)
        smtp.send_message(em)

    return render_template('code.html', title = 'FINEbank.IO - Verification')


@app.route('/code', methods=['GET', 'POST'])

def code():
    if request.method == 'POST':
        user_code = request.form.get('code')

        if user_code == session.get('code'):
            name = session.get('name')
            email = session.get('email')
            password = session.get('password')

            user_data = {
                "name": name,
                "email": email,
                "password": password
            }

            users = []
            json_file = 'all_user.json'

            if os.path.exists(json_file):
                with open(json_file, 'r', encoding='utf-8') as f:
                    try:
                        users = json.load(f)
                    except json.JSONDecodeError:
                        users = []

            users.append(user_data)

            with open(json_file, 'w', encoding='utf-8') as f:
                json.dump(users, f, indent=4, ensure_ascii=False)

            return render_template('Log_in.html', title='FINEbank.IO - Log in')

        else:
            return render_template('code.html', title='FINEbank.IO - Verification')
        

@app.route('/log_in', methods=['GET'])
def log_in_page():
    return render_template('Log_in.html', title='FINEbank.IO - Log in')

from flask import jsonify

@app.route('/get_all_users')
def get_users():
    try:
        with open('all_user.json', 'r', encoding='utf-8') as f:
            users = json.load(f)
            return jsonify(users)
    except:
        return jsonify([])

@app.route('/log_in', methods=['POST'])
def log_in():
    input_email = request.form.get('email')
    input_password = request.form.get('password')

    try:
        with open('all_user.json', 'r', encoding='utf-8') as f:
            users = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return render_template('Log_in.html', text='User not found')

    for user in users:
        if user.get('email', '').lower() == input_email.lower():
            if user.get('password') == input_password:
                session['email'] = input_email
                session['name'] = user.get('name')
                return redirect(url_for('overview'))
            else:
                return render_template('Log_in.html', text='Incorrect password')

    return render_template('Log_in.html', text='User not found')


@app.route('/overview')
def overview():
    return render_template('Overview_index.html', title='FINEbank.IO - Overview', name = session.get('name'))


if __name__ == '__main__':
    app.run(debug=True)