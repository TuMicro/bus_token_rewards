
# Setup

Clone this repository on your local machine.

Make sure the terminal is inside the 'functions' folder.
(asegúrate de que la ruta de la terminal esté en la carpeta "functions", la cual está dentro de este repositorio)

You will need:

- NVM (node version manager)
- NodeJs 16.0.0:
```bash
nvm install v16.0.0
nvm use v16.0.0
npm install
```

[Josue] I have tested this repo with node 16.13.2, probably any version 16 or later will work.

# Development (local testing)

In order to have access to other resources (like Firestore) while testing locally, install gcloud and then run:

`gcloud auth application-default login`

And also:

```
npm install -g firebase-tools
firebase login
```

Set up the process.env.GCLOUD_PROJECT variable in `firebase-init.ts` according to the project you want to connect to. (as that var is non-existant during local testing).

Download the `.env.test` file from [here](https://drive.google.com/drive/) and place it in the functions folder. Or just copy `.env.test.example` to `.env.test` and change the values.

Run:
```
npm run watch
```

Write tests and watch the console show the tests that passed.

If you only need to run some 'describes' that contain a specific keyword you use as reference the 'testSprintRally02' command in package.json (use \\s for whitespace) accordingly and then run it like this:

```
npm run testSprintRally02
```

Run linter showing only the errors:

```
npm run lint -- --quiet
```


# Local Deployment

This may be useful for testing endpoints locally in the future.

First install firebase CLI utility in your machine and login. Then go to the `functions` folder and run:

```
npm run-script serve
```


# Production Deployment to Cloud Functions

First install firebase CLI utility in your machine and login. Download the `.env.prod` file from [here](https://drive.google.com/drive/folders/1_bSPY7ji4JiSTipQyy0sVQyc75L0Pyc3) and place it in the functions folder. (make sure IS_TESTING=false)

Then IN THE ROOT FOLDER run:

```
firebase use prod
# more info: https://firebase.google.com/docs/functions/config-env#env-variables
```

Now you can start deploying anything of the below:

```
# deploy all functions (remember to set up the .env accordingly before deploying to production)
firebase deploy --only functions:turuta_app_reports_listener && time /t
```

# Testing-environment Deployment to Cloud Functions

First install firebase CLI utility in your machine and login. Download the `.env.test` file from [here](https://drive.google.com/drive/u/1/folders/1rNEj3qYcg14aCAY8auvC99GyKA3R8RPO) and place it in the functions folder.

Then IN THE ROOT FOLDER run:

```
firebase use test
# more info: https://firebase.google.com/docs/functions/config-env#env-variables
```

Now you can start deploying anything of the below:

```
# testing functions (usually for frontend testing)
firebase deploy --only functions:testing && time /t
```


# Utils
En Google Cloud SDK Shell
```
gcloud auth application-default login
```

Showing the commits tree:
```
git log --oneline --graph --decorate --all
```

