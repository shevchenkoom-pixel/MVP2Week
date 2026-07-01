def test_catalog_returns_templates(client):
    response = client.get("/api/catalog")
    assert response.status_code == 200
    body = response.json()
    assert "templates" in body
    assert len(body["templates"]) == 1
    assert body["templates"][0]["filename"] == "t.md"