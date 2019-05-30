# HAKORA Task Manager
>  **Note:** The name HAKORA was generated on an online name generator. This is a school project and it is not production ready by any means.
>  
HAKORA Task Manager allows you to create and manage your every-day tasks, create projects and share your tasks with other co-workers, friends or family members.
# How to run (development)
First make sure that you have Python 3, MongoDB, NodeJS and Yarn/NPM installed. After that you can start using the project.

Server:
 1. `cd server`
 2. `pip install -r requirements.txt`
 3. `cp config_example.py config.py`
 4. edit `config.py` file and change the following fields with your data:<br />
MAILBOX_LAYER_API_KEY<br />
MAIL_USERNAME<br />
MAIL_PASSWORD<br />
DEFAULT_EMAIL_SENDER_ACCOUNT<br />
 5. You can change server configuration in `/server/__init__.py`, by changing the following line `app.config.from_object('config.DevelopmentConfig')` 
 6. Now you have everything ready, try running:<br />
| Windows | 	`py -3 /server/run.py ` |<br />
| Linux/MacOS | `python3 /server/run.py` |<br />

Client:

 1. `cd client`
 2. `yarn` or `npm install`
 3. Make sure that the URL for the backend api in the `setupProxy.js` file is pointing correctly to your server
 4. `yarn dev` or `npm run dev`

# How to run (production)
Coming soon...