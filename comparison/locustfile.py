from os import environ
from secrets import randbelow
from locust import HttpUser, constant, tag, task


class NormalUser(HttpUser):
    wait_time = constant(1)
    host = "http://localhost:4000"
    endpoint = "/api/v1/userData/entry"
    private_token = environ['LOCUST_JWT']

    def on_start(self):
        self.client.headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + self.private_token,
        }

    def some_endpoint(self):
        """ Return a random endpoint to request """
        return self.endpoint + str(randbelow(3)+1)

    def some_payload(self):
        """ Return a random payload to send """
        return {
            "dataType": "history",
            "data": "{\"someKey\": \"someValue\"}"
        }

    def check_valid(self, res):
        """ Validate a response from a valid request """
        assert res.ok

    def check_invalid(self, res):
        """ Validate a response from an invalid request """
        assert res.status_code in [400, 401]

    @task(6)
    @tag("valid")
    def get_userdata(self):
        """ Perform a valid GET for some userdata """
        res = self.client.get(self.some_endpoint())
        self.check_valid(res)

    @task(6)
    @tag("valid")
    def post_userdata(self):
        """ Perform a valid POST for some userdata """
        res = self.client.post(self.some_endpoint(), json=self.some_payload())
        self.check_valid(res)

    @task(3)
    @tag("valid")
    def delete_userdata(self):
        """ Perform a valid DELETE for some userdata """
        res = self.client.delete(self.some_endpoint())
        self.check_valid(res)

    @task(0)
    @tag("invalid")
    def post_without_token(self):
        """ Perform an invalid POST without a bearer token """
        res = self.client.post(self.some_endpoint(), headers={})
        self.check_invalid(res)

    @task(0)
    @tag("invalid")
    def post_incomplete_payload(self):
        """ Perform an invalid POST with incomplete data """
        res = self.client.post(self.some_endpoint(), data={})
        self.check_invalid(res)
