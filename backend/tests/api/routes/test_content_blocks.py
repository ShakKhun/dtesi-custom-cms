from fastapi.testclient import TestClient

from app.core.config import settings


def test_read_content_bundle(client: TestClient) -> None:
    response = client.get(f"{settings.API_V1_STR}/content-blocks/bundle/home")
    assert response.status_code == 200
    content = response.json()
    assert content["page"]["slug"] == "home"
    assert content["page"]["is_home"] is True
    assert len(content["shared"]) >= 3
    assert len(content["sections"]) >= 1
    assert len(content["navigation"]) >= 2


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
            "content": {**block["content"], "contact_label": "Email"},
        },
    )
    assert update_response.status_code == 200
    updated_block = update_response.json()
    assert updated_block["content"]["contact_label"] == "Email"


def test_create_page_and_section(
    client: TestClient,
    superuser_token_headers: dict[str, str],
) -> None:
    page_response = client.post(
        f"{settings.API_V1_STR}/content-blocks/pages",
        headers=superuser_token_headers,
        json={
            "slug": "program",
            "title": "Program Page",
            "navigation_title": "Program",
            "show_in_navigation": True,
            "navigation_order": 2,
            "is_home": False,
        },
    )
    assert page_response.status_code == 200
    page = page_response.json()

    section_response = client.post(
        f"{settings.API_V1_STR}/content-blocks/pages/{page['id']}/sections",
        headers=superuser_token_headers,
        json={
            "kind": "text",
            "title": "Program Overview",
            "position": 0,
            "content": {
                "heading": "Program overview",
                "body": "Conference schedule and session tracks.",
            },
        },
    )
    assert section_response.status_code == 200
    section = section_response.json()
    assert section["kind"] == "text"

    bundle_response = client.get(
        f"{settings.API_V1_STR}/content-blocks/bundle/program",
    )
    assert bundle_response.status_code == 200
    bundle = bundle_response.json()
    assert bundle["page"]["slug"] == "program"
    assert bundle["sections"][0]["title"] == "Program Overview"
