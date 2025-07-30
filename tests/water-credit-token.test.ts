import { describe, it, expect, beforeEach } from "vitest"

// Mock state for the Water Credit Token contract
const mockContract = {
  admin: "ST1ADMIN11111111111111111111111111111111",
  authorities: new Set<string>(),
  balances: new Map<string, number>(),
  totalSupply: 0,

  isAdmin(caller: string) {
    return caller === this.admin
  },

  isAuthority(caller: string) {
    return this.authorities.has(caller)
  },

  transferAdmin(caller: string, newAdmin: string) {
    if (!this.isAdmin(caller)) return { error: 100 }
    this.admin = newAdmin
    return { value: true }
  },

  addAuthority(caller: string, newAuth: string) {
    if (!this.isAdmin(caller)) return { error: 100 }
    if (this.authorities.has(newAuth)) return { error: 102 }
    this.authorities.add(newAuth)
    return { value: true }
  },

  removeAuthority(caller: string, oldAuth: string) {
    if (!this.isAdmin(caller)) return { error: 100 }
    if (!this.authorities.has(oldAuth)) return { error: 103 }
    this.authorities.delete(oldAuth)
    return { value: true }
  },

  mint(caller: string, recipient: string, amount: number) {
    if (!this.isAuthority(caller)) return { error: 100 }
    if (amount < 1) return { error: 105 }

    const current = this.balances.get(recipient) || 0
    this.balances.set(recipient, current + amount)
    this.totalSupply += amount

    return { value: true }
  },

  burn(caller: string, amount: number) {
    if (amount < 1) return { error: 105 }

    const balance = this.balances.get(caller) || 0
    if (balance < amount) return { error: 101 }

    this.balances.set(caller, balance - amount)
    this.totalSupply -= amount

    return { value: true }
  },

  transfer(from: string, to: string, amount: number) {
    if (from === to) return { error: false }
    if (amount < 1) return { error: 105 }

    const fromBal = this.balances.get(from) || 0
    if (fromBal < amount) return { error: 101 }

    const toBal = this.balances.get(to) || 0
    this.balances.set(from, fromBal - amount)
    this.balances.set(to, toBal + amount)

    return { value: true }
  },

  getBalance(user: string) {
    return this.balances.get(user) || 0
  },

  getTotalSupply() {
    return this.totalSupply
  }
}

describe("Mirui Water Credit Token Contract", () => {
  const admin = "ST1ADMIN11111111111111111111111111111111"
  const auth = "ST2AUTH22222222222222222222222222222222"
  const userA = "ST3USERAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
  const userB = "ST4USERBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB"

  beforeEach(() => {
    mockContract.admin = admin
    mockContract.authorities = new Set()
    mockContract.balances = new Map()
    mockContract.totalSupply = 0
  })

  it("should allow admin to add an authority", () => {
    const result = mockContract.addAuthority(admin, auth)
    expect(result).toEqual({ value: true })
    expect(mockContract.isAuthority(auth)).toBe(true)
  })

  it("should mint tokens from an authority", () => {
    mockContract.authorities.add(auth)
    const result = mockContract.mint(auth, userA, 50)
    expect(result).toEqual({ value: true })
    expect(mockContract.getBalance(userA)).toBe(50)
    expect(mockContract.getTotalSupply()).toBe(50)
  })

  it("should reject mint from non-authority", () => {
    const result = mockContract.mint(userA, userA, 10)
    expect(result).toEqual({ error: 100 })
  })

  it("should allow token transfer between users", () => {
    mockContract.authorities.add(auth)
    mockContract.mint(auth, userA, 100)

    const result = mockContract.transfer(userA, userB, 60)
    expect(result).toEqual({ value: true })
    expect(mockContract.getBalance(userA)).toBe(40)
    expect(mockContract.getBalance(userB)).toBe(60)
  })

  it("should fail transfer if balance is insufficient", () => {
    const result = mockContract.transfer(userA, userB, 10)
    expect(result).toEqual({ error: 101 })
  })

  it("should burn tokens from caller's balance", () => {
    mockContract.authorities.add(auth)
    mockContract.mint(auth, userA, 80)

    const result = mockContract.burn(userA, 30)
    expect(result).toEqual({ value: true })
    expect(mockContract.getBalance(userA)).toBe(50)
    expect(mockContract.getTotalSupply()).toBe(50)
  })

  it("should fail burn if balance is too low", () => {
    const result = mockContract.burn(userB, 5)
    expect(result).toEqual({ error: 101 })
  })

  it("should transfer admin rights", () => {
    const result = mockContract.transferAdmin(admin, userA)
    expect(result).toEqual({ value: true })
    expect(mockContract.admin).toBe(userA)
  })

  it("should not allow non-admin to add authority", () => {
    const result = mockContract.addAuthority(userA, userB)
    expect(result).toEqual({ error: 100 })
  })

  it("should remove an authority", () => {
    mockContract.authorities.add(auth)
    const result = mockContract.removeAuthority(admin, auth)
    expect(result).toEqual({ value: true })
    expect(mockContract.isAuthority(auth)).toBe(false)
  })
})
