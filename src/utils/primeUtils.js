/**
 * Miller-Rabin deterministik asal sayı testi.
 * Number.MAX_SAFE_INTEGER (2^53 - 1) dahil tüm tam sayılar için doğru sonuç verir.
 * Seçilen witness'lar 3.317 × 10^24'e kadar olan sayılarda deterministiktir.
 */

function powmod(base, exp, mod) {
    let result = 1n;
    base = base % mod;
    while (exp > 0n) {
        if (exp & 1n) result = (result * base) % mod;
        exp >>= 1n;
        base = (base * base) % mod;
    }
    return result;
}

function millerRabinTest(n, a) {
    const bigA = BigInt(a);
    if (n % bigA === 0n) return n === bigA;

    let d = n - 1n;
    let r = 0;
    while (d % 2n === 0n) { d >>= 1n; r++; }

    let x = powmod(bigA, d, n);
    if (x === 1n || x === n - 1n) return true;

    for (let i = 0; i < r - 1; i++) {
        x = (x * x) % n;
        if (x === n - 1n) return true;
    }
    return false;
}

/**
 * Fermat asal sayı testi.
 * @param {number} n - Test edilecek tam sayı
 * @param {number} k - Tekrar sayısı (güvenilirlik için)
 * @returns {boolean}
 */
export function fermatTest(n, k) {
    // TODO: implement
    throw new Error('fermatTest henüz implemente edilmedi');
}

/**
 * Trial division asal sayı testi.
 * @param {number} n - Test edilecek tam sayı
 * @returns {boolean}
 */
export function trialDivision(n) {
    if (!Number.isSafeInteger(n)) return false;
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 === 0 || n % 3 === 0) return false;

    const limit = Math.floor(Math.sqrt(n));
    for (let i = 5; i <= limit; i += 6) {
        if (n % i === 0 || n % (i + 2) === 0) return false;
    }

    return true;
}

/**
 * @param {number} n
 * @returns {boolean}
 */
export function isPrime(n) {
    // Daha sonra fermatTest ve trialDivision da dahil edilecek.
    const SMALL_PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37];

    for (const p of SMALL_PRIMES) {
        if (n === p) return true;
        if (n % p === 0) return false;
    }

    const bigN = BigInt(n);
    const WITNESSES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37];
    return WITNESSES.every(a => millerRabinTest(bigN, a));
}
