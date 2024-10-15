import os

def print_tree(root_path, indent=""):
    # 현재 경로에 있는 파일과 폴더 목록을 가져옴
    with os.scandir(root_path) as entries:
        # 목록을 정렬하여 순차적으로 탐색
        entries = sorted(entries, key=lambda e: (not e.is_dir(), e.name))
        for i, entry in enumerate(entries):
            connector = "ㄴ " if i == len(entries) - 1 else "ㄴ "
            print(indent + connector + entry.name)

            if entry.is_dir():
                # 폴더의 경우, 하위 항목을 재귀적으로 출력
                new_indent = indent + ("    " if i == len(entries) - 1 else "    ")
                print_tree(entry.path, new_indent)

# 사용자가 입력한 폴더 경로
folder_path = input("폴더 경로를 입력하세요: ")

# 트리 구조 출력
print(folder_path)
print_tree(folder_path)
