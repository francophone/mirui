;; Mirui Water Credit Token Contract
;; Tokenized credits representing water units (e.g., 1 token = 10 liters)

(define-data-var admin principal tx-sender)
(define-data-var total-supply uint u0)

(define-map balances principal uint)
(define-map authorities principal bool)

;; Constants
(define-constant ERR-NOT-AUTHORIZED u100)
(define-constant ERR-INSUFFICIENT-BALANCE u101)
(define-constant ERR-ALREADY-AUTHORIZED u102)
(define-constant ERR-NOT-AUTHORITY u103)
(define-constant ERR-INVALID-RECIPIENT u104)
(define-constant ERR-INVALID-AMOUNT u105)

(define-constant TOKEN-NAME (utf8 "Mirui Water Credit"))
(define-constant TOKEN-SYMBOL (utf8 "MWC"))
(define-constant TOKEN-DECIMALS u0) ;; Non-fractional units

;; Access control check
(define-private (is-admin)
  (is-eq tx-sender (var-get admin))
)

(define-private (is-authority)
  (default-to false (map-get? authorities tx-sender))
)

;; Transfer admin rights
(define-public (transfer-admin (new-admin principal))
  (begin
    (asserts! (is-admin) (err ERR-NOT-AUTHORIZED))
    (var-set admin new-admin)
    (ok true)
  )
)

;; Authorize a new water authority
(define-public (add-authority (authority principal))
  (begin
    (asserts! (is-admin) (err ERR-NOT-AUTHORIZED))
    (asserts! (is-none (map-get? authorities authority)) (err ERR-ALREADY-AUTHORIZED))
    (map-set authorities authority true)
    (ok true)
  )
)

;; Revoke an authority
(define-public (remove-authority (authority principal))
  (begin
    (asserts! (is-admin) (err ERR-NOT-AUTHORIZED))
    (asserts! (is-some (map-get? authorities authority)) (err ERR-NOT-AUTHORITY))
    (map-delete authorities authority)
    (ok true)
  )
)

;; Mint water credits to a user
(define-public (mint (recipient principal) (amount uint))
  (begin
    (asserts! (is-authority) (err ERR-NOT-AUTHORIZED))
    (asserts! (>= amount u1) (err ERR-INVALID-AMOUNT))
    (let (
      (current (default-to u0 (map-get? balances recipient)))
      (new-balance (+ current amount))
      (supply (+ (var-get total-supply) amount))
    )
      (map-set balances recipient new-balance)
      (var-set total-supply supply)
      (ok true)
    )
  )
)

;; Burn tokens from sender (e.g., water usage)
(define-public (burn (amount uint))
  (begin
    (asserts! (>= amount u1) (err ERR-INVALID-AMOUNT))
    (let (
      (current (default-to u0 (map-get? balances tx-sender)))
    )
      (asserts! (>= current amount) (err ERR-INSUFFICIENT-BALANCE))
      (let (
        (new-balance (- current amount))
        (supply (- (var-get total-supply) amount))
      )
        (map-set balances tx-sender new-balance)
        (var-set total-supply supply)
        (ok true)
      )
    )
  )
)

;; Transfer tokens between users
(define-public (transfer (to principal) (amount uint))
  (begin
    (asserts! (is-eq tx-sender to) false) ;; Prevent self-transfer
    (asserts! (>= amount u1) (err ERR-INVALID-AMOUNT))
    (let (
      (sender-bal (default-to u0 (map-get? balances tx-sender)))
      (receiver-bal (default-to u0 (map-get? balances to)))
    )
      (asserts! (>= sender-bal amount) (err ERR-INSUFFICIENT-BALANCE))
      (map-set balances tx-sender (- sender-bal amount))
      (map-set balances to (+ receiver-bal amount))
      (ok true)
    )
  )
)

;; View user balance
(define-read-only (get-balance (owner principal))
  (ok (default-to u0 (map-get? balances owner)))
)

;; View total token supply
(define-read-only (get-total-supply)
  (ok (var-get total-supply))
)

;; View token metadata
(define-read-only (get-token-info)
  {
    name: TOKEN-NAME,
    symbol: TOKEN-SYMBOL,
    decimals: TOKEN-DECIMALS
  }
)

;; Check if a principal is an authority
(define-read-only (is-authorized-authority (who principal))
  (ok (default-to false (map-get? authorities who)))
)
