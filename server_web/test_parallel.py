import concurrent.futures
import requests


def make_request(_):
    url = 'http://localhost:5678/index'
    try:
        response = requests.get(url)
        print(f'Response from {url}: {response.status_code}')
    except requests.exceptions.RequestException as e:
        print(f'Request to {url} failed: {e}')

num_requests = 10


with concurrent.futures.ThreadPoolExecutor(max_workers=num_requests) as executor:
    executor.map(make_request, range(num_requests))
