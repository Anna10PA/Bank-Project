from flask import Flask, render_template, request, session, redirect, url_for, jsonify
import random
import smtplib
from email.message import EmailMessage
import os
import json
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'MyRandomKeyIDK2009'

my_email = 'futureana735@gmail.com'
my_password = os.environ.get('Gmail_password')



# Task 001 - საწყისი გვერდი | რეგისტრაციის ჩატვირთვა
@app.route('/')
def main_page():
    return render_template('sign_up.html', title='FINEbank.IO - Sign up')


# Task 002   -   რეგისტრაციის ფუნქციის გაშვება
@app.route('/sign_up', methods=['POST'])
def sign_up():
    name = request.form.get('name')
    email = request.form.get('email')
    password = request.form.get('password')

    users = []
    try:
        with open('all_user.json', 'r', encoding='utf-8') as allUserFile:
            users = json.load(allUserFile)

            # Task 002-01   -   არის თუ არა მეილი რეგისტრირებული
            duplicate_email = False
            for user in users:
                if 'email' in user and user['email'].lower() == email.lower():
                    duplicate_email = True
                    break

            if duplicate_email:
                return render_template('sign_up.html', text='This email is already registered')

    except (FileNotFoundError, json.JSONDecodeError):
        users = []

    # Task 002-02   -  სავერიფიკაციო კოდის შედგენა   
    code = ''
    for i in range(4):
        code += random.choice('0123456789')

     # pirveli baratis nomeri
    card_number = ''
    for i in range(4):
        cvatro = ''
        for a in range(4):
            number = random.choice('0123456789')
            cvatro += number
        card_number += cvatro + ' '

        # angarishis nomeri
    Account_number = 'GE'
    for i in range(2):
        Account_number += random.choice('0123456789')
    Account_number += 'IO0000000'
    for i in range(9):
        Account_number += random.choice('0123456789')


    # baratis code
    card_code = ''
    for i in range(4):
        card_code += random.choice('0123456789')

    # 
    try:
        is_dublicat_info = False
        for user in users:
            for card in user.get('cards', {}).values():
                if card['number'] == card_number[:-1] or card['accaunt_number'] == Account_number:
                    is_dublicat_info = True
                    break
            if is_dublicat_info:
                break
    
    except (FileNotFoundError, json.JSONDecodeError):
        users = []


    if is_dublicat_info == False:
         # Task 002-03   -  მეილზე გაგზზავნა
        session['code'] = code
        session['email'] = email
        session['name'] = name
        session['password'] = password
        session['Account_number'] = Account_number
        session['card_number'] = card_number
        session['card_code'] = card_code

        subject = 'FINEbank.IO - Verification'
        body = f"""
        Hello {name}!
        Your verification code is: {code}

        - - - FINEbank.IO - - - 
        """

        em = EmailMessage()
        em['From'] = my_email
        em['To'] = email
        em['Subject'] = subject
        em.set_content(body)

        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
            smtp.login(my_email, my_password)
            smtp.send_message(em)

        return render_template('code.html', title='FINEbank.IO - Verification')


# Task 003   -   კოდის შემოწმება და საბოლოოდ რეგისტრაცია
@app.route('/code', methods=['GET', 'POST'])
def code():
    if request.method == 'POST':
        user_code = request.form.get('code')

        if user_code == session.get('code'):
            name = session.get('name')
            email = session.get('email')
            password = session.get('password')
            card_number = session.get('card_number')
            Account_number = session.get('Account_number')
            card_code = session.get('card_code')


            if email.lower() != 'futureana735@gmail.com' or email.lower() != 'datodzukaevi38@gmail.com':
                money = 10000
            else:
                money = 100000

            
            time = datetime.now()
            curent_time = time.strftime("%d/%m/%Y")

            user_data = {
                "name": name,
                "email": email,
                "password": password,
                "cards": {
                    'card-01': {
                        'number': card_number[:-1],
                        'accaunt_number': Account_number,
                        'money': money,
                        'bank_name': 'mastercard',
                        'account_type': 'credit card',
                        'code': card_code,
                        'transaction-to-someone': {

                        }
                    }
                },
                "profile": 'https://cdn-icons-png.flaticon.com/512/219/219983.png',
                "goal": {
                    'target': money * 3,
                    'curent': money
                },
                "notification": {
                    'read': False,
                    'message': {
                        curent_time: [
                            f"Congratulations! You've received ${money} from the FINEbank.IO for signing up!"
                        ]
                    }
                },
                'transactions': {
                    'revenue': {
                        'FINEbank.IO': {
                            'send_money': money,
                            'reason': 'registration',
                            'date': curent_time
                        }
                    },
                    'expenses': {

                    },
                    'all': {
                        'FINEbank.IO': {
                            'send_money': money,
                            'reason': 'registration',
                            'date': curent_time
                        }
                    }
                },
                'expenses_breakdown': {
                    curent_time[3::]: {
                        'house': 0,
                        'food': 0,
                        'transportation': 0,
                        'entertainment': 0,
                        'shopping': 0,
                        'others': 0,
                    }
                },
                'revenue_breakdown': {
                    curent_time[3::]: {
                        'saves': 0,
                        'salary':0,
                        'other': money
                    }
                }
            }

            users = []
            if os.path.exists('all_user.json'):
                with open('all_user.json', 'r', encoding='utf-8') as file:
                    try:
                        users = json.load(file)
                    except json.JSONDecodeError:
                        users = []

            users.append(user_data)

            with open('all_user.json', 'w', encoding='utf-8') as userFile:
                json.dump(users, userFile, indent=6)

            return render_template('Log_in.html', title='FINEbank.IO - Log in')
        else:
            return render_template('code.html', title='FINEbank.IO - Verification')

    return render_template('code.html', title='FINEbank.IO - Verification')


# Task 004-01   -   მონაცემის მიღება მომხმარებელთან + საიტის ჩატვირთვა
@app.route('/log_in', methods=['GET'])
def log_in_page():
    return render_template('Log_in.html', title='FINEbank.IO - Log in')


# ask 004-01   -   მონაცემის მიღება მომხმარებლისგან + შემოწმება თუ არსებობს ესეთი მომხმარებელი
@app.route('/log_in', methods=['POST'])
def log_in():
    input_email = request.form.get('email')
    input_password = request.form.get('password')

    try:
        with open('all_user.json', 'r', encoding='utf-8') as file:
            users = json.load(file)

        if not users:
            users = []

    except (FileNotFoundError, json.JSONDecodeError):
        return render_template('Log_in.html', text='User database error or file not found')

    for user in users:
        try:
            if user['email'].lower() == input_email.lower():
                if user['password'] == input_password:
                    session['email'] = input_email
                    session['name'] = user['name']
                    session['curent_user'] = user
                    return redirect(url_for('overview'))
                else:
                    return render_template('Log_in.html', text='Incorrect password')
        except (KeyError, AttributeError, TypeError):
            continue 

    return render_template('Log_in.html', text='User not found')



# Task 006 - პაროლის გაგზავნა მეილზე
@app.route('/forgot_password', methods=['GET', 'POST'])
def forgot_password():
    if request.method == 'POST':
        email = request.form.get('email')
        try:
            with open('all_user.json', 'r', encoding='utf-8') as file:
                users = json.load(file)
        except (FileNotFoundError, json.JSONDecodeError):
            return render_template('Forgot_password.html', text='User database error.')

        user = None
        for u in users:
            if u['email'].lower() == email.lower():
                user = u
                break

        if not user:
            return render_template('Forgot_password.html', text='Email not found.')

        subject = 'FINEbank.IO - Your Password'
        body = f"""
        Hello {user['name']},

        As requested, here is your current password: {user['password']}
        Please keep it safe and do not share it with anyone.

        - - - FINEbank.IO - - -
        """

        em = EmailMessage()
        em['From'] = my_email
        em['To'] = email
        em['Subject'] = subject
        em.set_content(body)

        try:
            with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
                smtp.login(my_email, my_password)
                smtp.send_message(em)
                
        except smtplib.SMTPAuthenticationError:
            return render_template('Forgot_password.html')

        return render_template('Log_in.html', text='Password sent to your email.')
    else:
        return render_template('Forgot_password.html')



# curent user

@app.route('/curent_user')
def curent_user():
    user = session['curent_user']
    return jsonify(user)

# Task 006 - ყველა მომხმარებლის გადაქცევა ჯსონ ფაილად
@app.route('/get_all_users')
def get_users():
    try:
        with open('all_user.json', 'r', encoding='utf-8') as file:
            users = json.load(file)
            return jsonify(users)
    except:
        return jsonify([])

# Task 007 - 01   -  საწყისი გვერდი გვერდების გაშვება

@app.route('/overview')
def overview():
    time = datetime.now()
    curent_time = time.strftime("%d/%m/%Y")

    user = session.get('curent_user')
    gasavali = user['expenses_breakdown'].get(curent_time[3::])
    shemosavali = user['revenue_breakdown'].get(curent_time[3::])

    if not user:
        return redirect(url_for('log_in_page'))
    total = 0
    for m in user['cards'].values():
        total += m['money']

    
    return render_template('Overview_index.html', title='FINEbank.IO'
    ' - Overview', userinfo=user, total=total, Expenses = gasavali, Revenue = shemosavali)


#  მონაცემის განახლება (ანუ მიზნად როა თუ რაცხა იმის)
@app.route('/read_notification', methods=["GET", "POST"])
def read_status():
    if request.method == "POST":
        try:
            email = session['email']
            if not email:
                return 'error'

            with open('all_user.json', 'r', encoding='utf-8') as file:
                users = json.load(file)

            for user in users:
                if user['email'].lower() == email.lower():
                    user['notification']['read'] = True
                    session['curent_user'] = user
                    break

            with open('all_user.json', 'w', encoding='utf-8') as file:
                json.dump(users, file, indent=4)

            return 'good'
        except Exception as error:
            return error
    else:
        user_read_status = session['curent_user']['notification']
        return jsonify(user_read_status)


# ჯს-ში წაღება
@app.route('/get_goal')
def get_goal():
    user = session.get('curent_user')
    goal = user.get('goal')
    return jsonify(goal)



@app.route('/update_goal', methods=['POST'])
def update_goal():
    data = request.get_json()

    target = data.get('target')
    current = data.get('curent') 

    email = session.get('email')

    try:
        with open('all_user.json', 'r', encoding='utf-8') as file:
            users = json.load(file)
    except (FileNotFoundError, json.JSONDecodeError):
        users = []

    for user in users:
        if user['email'].lower() == email.lower():
            user['goal'] = {'target': target, 
                            'curent': current}
            session['curent_user'] = user 
            break

    with open('all_user.json', 'w', encoding='utf-8') as file:
        json.dump(users, file, indent=4)

    return jsonify([])


@app.route('/transactionToSomeone')
def transactionToSomeone():
    user = session['curent_user']
    main_card = user['cards']['card-01']
    return render_template('transaction_to_someone.html', title='FINEbank.IO - Transaction', account_number=main_card, name=session.get('name'), userinfo=user)

@app.route('/goal')
def goal():
    return render_template('Goal.html', title='FINEbank.IO - Goal', name=session.get('name'))


@app.route('/Balances')
def Balances():
    user = session['curent_user']
    return render_template('Balance.html', title='FINEbank.IO - Balance', name=session.get('name'), userinfo=user)

@app.route('/details')
def Details():
    user = session['curent_user']
    return render_template('detal.html', title='FINEbank.IO - Detal', userinfo = user, name=session.get('name'))

@app.route('/log_out')
def log_out():
    session.clear()
    return render_template('log_in.html', title='FINEbank.IO - Log in')

# Finish :D   -   კოდის გაშვება
if __name__ == '__main__':
    app.run(debug=True)
