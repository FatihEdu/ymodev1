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
export function fermatTest(n, k)
    if (!Number.isInteger(n) || n < 2) return false;
    if (n === 2 || n === 3) return true;
    if (n % 2 === 0) return false;
    const iterations = Math.max(1, Number.isFinite(k) ? Math.trunc(k) : 0); // k'yi sonlu tam sayıya çevir, en az 1
    const bigN = BigInt(n);
    // n >= 3 ve tek; aralık [2, n-2] en az bir eleman içerir
    const maxBase = n - 2; // sayı (number) olarak üst sınır
    for (let i = 0; i < iterations; i++) {
        // 2 <= a <= n-2 olacak şekilde rastgele taban seç
        const aNum = 2 + Math.floor(Math.random() * (maxBase - 1));
        const a = BigInt(aNum);
        // Fermat: a^(n-1) ≡ 1 (mod n) olmalı; aksi halde bileşiktir
        const result = powmod(a, bigN - 1n, bigN);
        if (result !== 1n) {
            return false;
        }
    }
    //döngüde takılmadı: yüksek ihtimalle asal
    return true;
}

/**
 * Trial division asal sayı testi.
 * @param {number} n - Test edilecek tam sayı
 * @returns {boolean}
 */
export function trialDivision(n) {
    // TODO: implement
    throw new Error('trialDivision henüz implemente edilmedi');
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
