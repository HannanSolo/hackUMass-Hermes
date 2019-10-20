# O.D.I.N (Ocular Direction Instead of Noise)

## [Matrix Creator](https://matrix-io.github.io/matrix-documentation/matrix-creator/overview/)
The MATRIX Creator is a hatter for the raspberry pi featureing 11 different types of sensors including an array of 8 microphones. 

//
//TODO add image

## [Odin Web](https://github.com/introlab/odas/wiki)
ODAS (Open embeddeD Audition System) performs sound source localization, tracking, separation and post-filtering.

//TODO add code / sound coordinate examples
//TODO add image
![ODIN Web Demo Gif](https://gyazo.com/eeb982d1900fb747280c73d2aa77762f.gif)

## [IBM MAX Audio Classifier](https://developer.ibm.com/exchanges/models/all/max-audio-classifier/)
IBM MAX Audio Classifier is used to classify sound bites. The model supports 527 different classes, and was trained on the Google AudioSet.

Python Example:
~~~python
  url = "http://max-audio-classifier.max.us-south.containers.appdomain.cloud/model/predict?start_time=0"
  response = requests.post(url, files={"audio": open("audio_file.wav", "rb")})
~~~
API respondse:
~~~json
{
    "status": "ok",
    "predictions": [
        {
            "label_id": "/m/06mb1",
            "label": "Rain",
            "probability": 0.7376469373703003
        },
        {
            "label_id": "/m/0ngt1",
            "label": "Thunder",
            "probability": 0.60517817735672
        },
        {
            "label_id": "/t/dd00038",
            "label": "Rain on surface",
            "probability": 0.5905200839042664
        }
    ]
}
~~~

## Augmented Relaity Directional Display
Using microphone wavelet data from the MATRIX Creator, and ARCore, The Augmented Reality Directional Display is able to allow users to view exactly which direction their sound is coming from. 

