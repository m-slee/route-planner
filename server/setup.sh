#!/bin/bash
source ./env/bin/activate
export FLASK_DEBUG=1
export FLASK_APP=application.py
flask run
