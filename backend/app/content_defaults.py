from typing import Any


def get_default_content_blocks() -> list[dict[str, Any]]:
    return [
        {
            "scope": "shared",
            "slug": "navigation",
            "title": "Navigation",
            "content": {
                "home_label": "Home",
                "speakers_label": "Speakers",
                "registration_label": "Registration",
                "program_label": "Program",
                "venue_label": "Venue",
                "proceedings_label": "Proceedings",
            },
        },
        {
            "scope": "shared",
            "slug": "header",
            "title": "Header",
            "content": {
                "site_name": "DTESI 2025",
                "tagline": "Digital Technologies in Education, Science and Industry",
                "eyebrow": "International Conference",
            },
        },
        {
            "scope": "shared",
            "slug": "footer",
            "title": "Footer",
            "content": {
                "copyright_text": "DTESI Conference",
                "contact_label": "Contact",
                "contact_value": "dtesi@iitu.edu.kz",
                "location_label": "Location",
                "location_value": "Almaty, Kazakhstan",
            },
        },
        {
            "scope": "shared",
            "slug": "important-dates",
            "title": "Important Dates",
            "content": {
                "title": "Important dates",
                "items": [
                    "Paper submission deadline",
                    "Notification of acceptance",
                    "Camera-ready paper submission",
                ],
            },
        },
        {
            "scope": "page",
            "slug": "home",
            "title": "Home Page",
            "content": {
                "hero_title": "9th International Conference",
                "hero_subtitle": "Digital Technologies in Education, Science and Industry",
                "hero_date": "November 19-20, 2025, Almaty",
                "intro_title": "About the conference",
                "intro_body": (
                    "The conference brings together scientists, lecturers, and "
                    "researchers to discuss the latest scientific results in the "
                    "digital development of society."
                ),
                "anniversary_note": (
                    "15th anniversary of International Information Technology University"
                ),
                "workshops_title": "Conference workshops",
                "workshops": [
                    "Workshop on Software and Knowledge Engineering",
                    "Workshop on Smart Technologies and IoT",
                    "Workshop on Data Science and Artificial Intelligence",
                    "Workshop on Cybersecurity, Infocommunication Systems and Networks",
                ],
                "submission_title": "Submission",
                "submission_body": (
                    "Papers must be original, unpublished full papers written in "
                    "English and prepared using the conference template."
                ),
                "venue_title": "Venue",
                "venue_body": (
                    "International Information Technology University (IITU), 34/1 "
                    "Manas Street, Almaty, Kazakhstan. Hybrid format."
                ),
            },
        },
    ]
