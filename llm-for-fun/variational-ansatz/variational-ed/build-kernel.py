"""Rebuild or verify the offline Eigen/WASM asset. Normal users need no compiler."""
import argparse
import base64
import hashlib
import re
import subprocess
import tempfile
from pathlib import Path


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--zig', required=True, help='path to Zig 0.13.0 executable')
    parser.add_argument('--eigen', required=True, help='path to extracted Eigen 3.4.0 directory')
    parser.add_argument('--verify', action='store_true', help='compare with shipped bytes instead of writing')
    args = parser.parse_args()
    zig = str(Path(args.zig).resolve())
    if subprocess.check_output([zig, 'version'], text=True).strip() != '0.13.0':
        raise ValueError('use Zig 0.13.0 to reproduce the published binary')
    here = Path(__file__).resolve().parent
    flags = ['-target', 'wasm32-wasi', '-O3', '-msimd128']
    with tempfile.TemporaryDirectory() as work:
        obj = str(Path(work) / 'kernel.o')
        binary = Path(work) / 'kernel.wasm'
        subprocess.run([zig, 'c++', *flags, '-std=c++17', '-fno-exceptions', '-fno-rtti', '-DNDEBUG',
                        '-DEIGEN_MPL2_ONLY', '-DEIGEN_DONT_PARALLELIZE', '-I', str(Path(args.eigen).resolve()),
                        '-c', str(here / 'eigen-wrapper.cpp'), '-o', obj], check=True)
        subprocess.run([zig, 'cc', *flags, '-mexec-model=reactor', obj, '-Wl,--strip-all',
                        '-Wl,--export=ed_alloc', '-Wl,--export=ed_free', '-Wl,--export=ed_diagonalize',
                        '-o', str(binary)], check=True)
        data = binary.read_bytes()
    sha = hashlib.sha256(data).hexdigest()
    asset = here / 'eigen-kernel.js'
    if args.verify:
        source = asset.read_text(encoding='ascii')
        match = re.search(r'VariationalEigenBase64="([^"]+)"', source)
        if (match is None or base64.b64decode(match.group(1), validate=True) != data
                or f'VariationalEigenSHA256="{sha}"' not in source):
            raise ValueError('rebuilt WASM differs from the shipped asset')
    else:
        source = ('// Generated from eigen-wrapper.cpp; see BUILD.md and THIRD-PARTY-LICENSES.txt.\n'
                  f'globalThis.VariationalEigenSHA256="{sha}";\n'
                  f'globalThis.VariationalEigenBase64="{base64.b64encode(data).decode("ascii")}";\n')
        asset.write_text(source, encoding='ascii')
    print(f'{len(data)} WASM bytes; sha256 {sha}')


if __name__ == '__main__':
    main()
