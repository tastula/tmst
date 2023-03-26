from datetime import datetime
from requests import exceptions, request
from subprocess import run
from sys import argv
from time import sleep


def read_arguments():
    if len(argv) == 3:
        return [
            "docker-compose.yml",
            argv[1],
            argv[2],
        ]
    if len(argv) == 4:
        return [
            argv[1],
            argv[2],
            argv[3]
        ]
    raise SyntaxError("time_to_request.py [COMPOSE_FILE] URL BEARER")


def start_requesting(url, bearer):
    headers = { "Authorization": f"Bearer {bearer}" }
    calls = 0
    print("Starting the requests")
    while True:
        try:
            calls += 1
            response = request("GET", url, headers=headers)
            if response.ok:
                return calls
        except exceptions.ConnectionError:
            sleep(0.1)


def main():
    [compose_file, url, bearer] = read_arguments()
    run(["docker-compose", "-f", compose_file, "down"])
    start_dt = datetime.now()
    run(["docker-compose", "-f", compose_file, "up", "-d"])
    successful_call = start_requesting(url, bearer)
    end_dt = datetime.now()
    diff = end_dt - start_dt
    run(["docker-compose", "-f", compose_file, "down"])
    print(f"Time to a successful request was {diff} (request {successful_call})")


if __name__ == "__main__":
    main()
