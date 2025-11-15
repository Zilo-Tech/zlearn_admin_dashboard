import os

IGNORED_FOLDERS = {
    "node_modules",
    "build",
    "dist",
    ".git",
    ".next",
    ".expo",
    ".expo-shared",
    ".cache",
    ".vscode",
    "coverage"
}

OUTPUT_FILE = "react_project_structure.txt"


def list_structure(root_path, indent="", file=None):
    try:
        items = sorted(os.listdir(root_path))
    except PermissionError:
        return

    for item in items:
        item_path = os.path.join(root_path, item)

        # ignore folders
        if item in IGNORED_FOLDERS:
            continue

        line = indent + "|-- " + item
        file.write(line + "\n")

        if os.path.isdir(item_path):
            list_structure(item_path, indent + "    ", file)


def main():
    root_path = os.getcwd()  # current folder = project root

    with open(OUTPUT_FILE, "w") as f:
        f.write("📁 React Project Structure\n")
        f.write("=" * 40 + "\n\n")
        list_structure(root_path, "", f)

    print(f"✔ React project structure saved to {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
