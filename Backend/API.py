from tensorflow import keras as keras
from keras.applications import imagenet_utils
from keras.preprocessing.image import img_to_array
from keras import models
from PIL import Image
from flask_cors import CORS

import numpy as np
import flask
import cv2 
import io

app = flask.Flask(__name__)
CORS(app)
model = None

def load_model():
    global model
    model = keras.models.load_model('./model')

def prepare_image(image, target):
    image = image.resize(target)
    image = img_to_array(image)
    image = image / 255

    image = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
    image = np.expand_dims(image, axis = 0)
    image = np.expand_dims(image, axis = 4)

    return image

@app.route("/predict", methods=["POST"])
def predict():
    data = {"success": False}

    if flask.request.method == "POST":
        if flask.request.files.get("image"):
            image = flask.request.files["image"].read()
            image = Image.open(io.BytesIO(image))
            image = prepare_image(image, target=(28, 28))

            preds = model.predict(image)
            labels = ['0','1','2','3','4','5','6','7','8','9']
            data = {}

            for i in range(len(labels)):
                data[labels[i]] = int(preds[0][i]*100)

            print(data)
    return flask.jsonify(data)
    
if __name__ == "__main__":
    print(("* Loading Keras model and Flask starting server..."
        "please wait until server has fully started"))
    load_model()
    app.run()