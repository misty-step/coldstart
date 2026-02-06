#!/usr/bin/env python3
"""
TDD reminder hook.

Soft reminder before Edit/Write on src/ files.
"""
from pathlib import Path
import json
import sys


def has_unit_tests() -> bool:
    unit_dir = Path("tests") / "unit"
    if not unit_dir.is_dir():
        return False
    for path in unit_dir.rglob("*"):
        if path.is_file():
            return True
    return False


def is_src_file(file_path: str) -> bool:
    if not file_path:
        return False
    try:
        parts = Path(file_path).parts
    except Exception:
        return False
    return "src" in parts


def main() -> None:
    try:
        data = json.load(sys.stdin)
    except Exception:
        sys.exit(0)

    tool_name = data.get("tool_name", "")
    tool_input = data.get("tool_input") or {}

    response = {
        "continue": True,
        "suppressOutput": True,
    }

    if tool_name in ("Edit", "Write"):
        file_path = tool_input.get("file_path", "")
        if is_src_file(file_path):
            tests_present = has_unit_tests()
            tests_note = (
                "Unit tests found in tests/unit/."
                if tests_present
                else "No unit tests found in tests/unit/."
            )
            response["systemMessage"] = (
                "TDD reminder: editing src/ file.\n"
                f"{tests_note} Write the test first.\n"
                "Pattern: Red -> Green -> Refactor."
            )

    print(json.dumps(response))
    sys.exit(0)


if __name__ == "__main__":
    main()
