import requests

BASE_URL = "https://fakerestaurantapi.runasp.net/api"


def GetAllRestaurant():
    response = requests.get(f"{BASE_URL}/Restaurant")
    response.raise_for_status()
    return response.json()


def GetRestaurantMenu(restaurant_id: int):
    response = requests.get(f"{BASE_URL}/Restaurant/{restaurant_id}/menu")
    response.raise_for_status()
    return response.json()
