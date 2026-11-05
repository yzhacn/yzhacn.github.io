// Thin interface to Eigen 3.4.0 (MPL-2.0). See BUILD.md.
// A[col*n+row] is complex128 (adjacent real,imag doubles). Its lower triangle
// specifies a Hermitian matrix. On success A contains normalized eigenvectors
// in columns and lambda contains ascending eigenvalues in the hopping unit.
#include <Eigen/Eigenvalues>
#include <cstdlib>

// We link the single-threaded C allocator of WASI. Eigen's temporaries can
// also use C++ new/delete. This kernel never starts threads or handles files.
void* operator new(std::size_t size) {
    void* p = std::malloc(size ? size : 1);
    if (!p) std::abort();
    return p;
}
void operator delete(void* p) noexcept { std::free(p); }
void operator delete(void* p, std::size_t) noexcept { std::free(p); }

extern "C" void* ed_alloc(unsigned bytes) { return std::malloc(bytes); }
extern "C" void ed_free(void* address) { std::free(address); }

extern "C" int ed_diagonalize(int n, double* matrix, double* lambda) {
    using Matrix = Eigen::Matrix<std::complex<double>, Eigen::Dynamic, Eigen::Dynamic, Eigen::ColMajor>;
    Eigen::Map<Matrix> A(reinterpret_cast<std::complex<double>*>(matrix), n, n);
    Eigen::SelfAdjointEigenSolver<Matrix> solver(A, Eigen::ComputeEigenvectors);
    if (solver.info() != Eigen::Success) return int(solver.info());
    A = solver.eigenvectors();
    Eigen::Map<Eigen::VectorXd>(lambda, n) = solver.eigenvalues();
    return 0;
}
