from typing import Any


def get_default_content_blocks() -> list[dict[str, Any]]:
    return [
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
    ]


def get_default_pages() -> list[dict[str, Any]]:
    return [
        {
            "slug": "home",
            "title": "Home Page",
            "navigation_title": "Home",
            "show_in_navigation": True,
            "navigation_order": 0,
            "is_home": True,
            "sections": [
                {
                    "kind": "hero",
                    "title": "Conference Hero",
                    "position": 0,
                    "content": {
                        "eyebrow": "9th International Conference",
                        "title": "Digital Technologies in Education, Science and Industry",
                        "subtitle": (
                            "A modern conference platform for lecturers, scientists, "
                            "and researchers shaping the digital future of society."
                        ),
                        "badges": [
                            "November 19-20, 2025, Almaty",
                            "Almaty, Kazakhstan",
                        ],
                        "note": (
                            "15th anniversary of International Information Technology "
                            "University"
                        ),
                    },
                },
                {
                    "kind": "text",
                    "title": "About the Conference",
                    "position": 1,
                    "content": {
                        "heading": "About the conference",
                        "body": (
                            "The conference brings together scientists, lecturers, and "
                            "researchers to discuss the latest scientific results in the "
                            "digital development of society."
                        ),
                    },
                },
                {
                    "kind": "list",
                    "title": "Conference Workshops",
                    "position": 2,
                    "content": {
                        "heading": "Conference workshops",
                        "items": [
                            "Workshop on Software and Knowledge Engineering",
                            "Workshop on Smart Technologies and IoT",
                            "Workshop on Data Science and Artificial Intelligence",
                            "Workshop on Cybersecurity, Infocommunication Systems and Networks",
                        ],
                    },
                },
                {
                    "kind": "callout",
                    "title": "Submission",
                    "position": 3,
                    "content": {
                        "heading": "Submission",
                        "body": (
                            "Papers must be original, unpublished full papers written in "
                            "English and prepared using the conference template."
                        ),
                        "badge": "Template and submission links can be added next",
                    },
                },
                {
                    "kind": "text",
                    "title": "Venue",
                    "position": 4,
                    "content": {
                        "heading": "Venue",
                        "body": (
                            "International Information Technology University (IITU), 34/1 "
                            "Manas Street, Almaty, Kazakhstan. Hybrid format."
                        ),
                    },
                },
            ],
        },
        {
            "slug": "speakers",
            "title": "Speakers Page",
            "navigation_title": "Speakers",
            "show_in_navigation": True,
            "navigation_order": 1,
            "is_home": False,
            "sections": [
                {
                    "kind": "hero",
                    "title": "Speakers Hero",
                    "position": 0,
                    "content": {
                        "eyebrow": "Conference Guests",
                        "title": "Speakers",
                        "subtitle": (
                            "Meet the invited speakers, session chairs, and guests of "
                            "DTESI 2025."
                        ),
                    },
                },
                {
                    "kind": "text",
                    "title": "Featured Guests",
                    "position": 1,
                    "content": {
                        "heading": "Featured guests",
                        "body": (
                            "This page can be used for keynote speakers, workshop "
                            "moderators, panel guests, or program committee highlights."
                        ),
                    },
                },
                {
                    "kind": "list",
                    "title": "Speaker List",
                    "position": 2,
                    "content": {
                        "heading": "Speaker list",
                        "items": [
                            "Prof. Aigerim Sarsenova - AI in Education",
                            "Dr. Timur Kassenov - Smart Industry Systems",
                            "Prof. Laura Chen - Cybersecurity and Trust",
                        ],
                    },
                },
            ],
        },
    ]
