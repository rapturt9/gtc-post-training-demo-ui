from pathlib import Path
import shutil
import subprocess

source = Path(__file__).resolve().parent
subprocess.run(["npm", "ci", "--ignore-scripts"], cwd=source, check=True)
subprocess.run(["npm", "exec", "next", "build", "--", "--webpack"], cwd=source, check=True)
shutil.copytree(source / "out", source.parent, dirs_exist_ok=True)
