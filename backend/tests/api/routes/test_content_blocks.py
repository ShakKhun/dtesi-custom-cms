from fastapi.testclient import TestClient

from app.core.config import settings


def test_read_content_bundle(client: TestClient) -> None:
    response = client.get(f"{settings.API_V1_STR}/content-blocks/bundle/home")
    assert response.status_code == 200
    content = response.json()
    assert content["page"]["slug"] == "home"
    assert content["page"]["scope"] == "page"
    assert len(content["shared"]) >= 3


def test_read_content_blocks_requires_superuser(
    client: TestClient, normal_user_token_headers: dict[str, str]
) -> None:
    response = client.get(
        f"{settings.API_V1_STR}/content-blocks/",
        headers=normal_user_token_headers,
    )
    assert response.status_code == 403
    assert response.json()["detail"] == "Not enough permissions"


def test_update_content_block(
    client: TestClient,
    superuser_token_headers: dict[str, str],
) -> None:
    response = client.get(
        f"{settings.API_V1_STR}/content-blocks/",
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    block = response.json()["data"][0]

    update_response = client.put(
        f"{settings.API_V1_STR}/content-blocks/{block['id']}",
        headers=superuser_token_headers,
        json={
            "title": block["title"],
            "content": {**block["content"], "home_label": "Homepage"},
        },
    )
    assert update_response.status_code == 200
    updated_block = update_response.json()
    assert updated_block["content"]["home_label"] == "Homepage"
