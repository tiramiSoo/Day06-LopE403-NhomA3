import json
from urllib.request import urlopen

try:
    import requests
except ModuleNotFoundError:
    requests = None

BASE_URL = "https://fakerestaurantapi.runasp.net/api"


def _get_json(url: str):
    if requests is not None:
        response = requests.get(url)
        response.raise_for_status()
        return response.json()

    with urlopen(url) as response:
        return json.loads(response.read().decode("utf-8"))


def GetAllRestaurant():
    return _get_json(f"{BASE_URL}/Restaurant")


def GetRestaurantMenu(restaurant_id: int):
    return _get_json(f"{BASE_URL}/Restaurant/{restaurant_id}/menu")
