def test_fake_login_creates_user_with_provided_name(client):
    response = client.post("/auth/fake-login", json={"display_name": "Alice Smith"})
    assert response.status_code == 200
    body = response.json()
    assert body["user"]["display_name"] == "Alice Smith"
    assert body["user"]["email"] == "alice.smith@local"
    assert body["token"].startswith("fake-")


def test_fake_login_returns_default_when_name_missing(client):
    response = client.post("/auth/fake-login", json={})
    assert response.status_code == 200
    body = response.json()
    assert body["user"]["display_name"] == "Demo User"
    assert body["user"]["email"] == "demo.user@local"


def test_fake_login_reuses_existing_user(client):
    first = client.post("/auth/fake-login", json={"display_name": "Bob"}).json()
    second = client.post("/auth/fake-login", json={"display_name": "Bob"}).json()
    assert first["user"]["id"] == second["user"]["id"]