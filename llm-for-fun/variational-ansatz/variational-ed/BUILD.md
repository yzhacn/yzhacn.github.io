# Browser electronic eigensolver

`electron-solver.js` builds the complex128 periodic-square KLM Hamiltonian, diagonalizes it and evaluates the occupied-state field. `eigen-kernel.js` contains the WebAssembly program as base64 so the Worker can initialize it without fetching a binary. It uses standard WebAssembly SIMD and has no imported functions, shared memory, threads, network or filesystem dependencies. Numerical results record the SHA-256 of the kernel. The Python reference is `src/ecnn4klm/util/exact.py::klmsq2d_gc`.

The only C++ wrapper is `eigen-wrapper.cpp`. Its column-major complex matrix stores two adjacent doubles per entry. Eigen's `SelfAdjointEigenSolver` reduces a Hermitian matrix to tridiagonal form and computes both sorted eigenvalues and normalized eigenvectors. The JavaScript field is obtained by summing the three Pauli-matrix expectations over the occupied columns.

`periodic-electrons.js` derives rectangular periods from the specified integer wavevectors and verifies that the proposed tile repeats exactly in the submitted spin array. A matching tile is solved at every allowed twist on the finite torus. All sectors contribute to the sorted spectrum and to the occupied-state field, whose local expectations carry a factor of one over the number of tiles. The zero-temperature resolution check uses the complete spectrum and the full dimension (2L²). Other textures use the original dense solver.

Run `python -B tools/export_variational_note_site.py <new-directory>` from the repository root to produce a standalone `index.html`. The executable modules, styles and third-party notices are embedded for both GitHub Pages and local offline use. The adjacent sources and checksum list support inspection and rebuilding.

To rebuild, download and extract [unmodified Eigen 3.4.0 source](https://gitlab.com/libeigen/eigen/-/archive/3.4.0/eigen-3.4.0.tar.gz) (tar.gz SHA-256 `8586084f71f9bde545ee7fa6d00288b264a2b7ac3607b974e54d13e7162c1c72`). Use [Zig 0.13.0](https://ziglang.org/download/) as the WASI C++ compiler and linker. The original Windows build used the `ziglang-0.13.0-py3-none-win_amd64.whl` distribution from [PyPI](https://pypi.org/project/ziglang/0.13.0/) (SHA-256 `b64b2aa936ebbfeecfbb2611df331a5474edebe1246b98c2f56d6ae4d58b71fc`). With these directories available, from the repository root run:

```powershell
python -B notes/variational-ed/build-kernel.py --zig C:\path\to\zig.exe --eigen C:\path\to\eigen-3.4.0 --verify
```

`--verify` compares the rebuilt bytes to the shipped `eigen-kernel.js`. Omit it to regenerate that asset after an intentional source change. The compiler uses `EIGEN_MPL2_ONLY`, no fast-math flag and no parallel Eigen execution. The shipped program is 63,127 bytes, SHA-256 `a8c32fc2be22f8be1f5fd259c0bf73b360fd52369c3ae1a3c45bccd0ffccb524`.

Source notices and licenses for the unmodified Eigen and compiler runtime components are included in `THIRD-PARTY-LICENSES.txt`. Eigen is distributed primarily under the Mozilla Public License 2.0, and its corresponding sources are available at the pinned archive above. The rebuild script specifies both compiler stages and the complete list of exported symbols.
