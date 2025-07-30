# **Mirui: Decentralized Water Access & Sharing Infrastructure**

A blockchain-based platform for managing water distribution, verification, and sharing through smart contracts—designed to empower communities, improve transparency, and ensure equitable access to clean water.

---

## **Overview**

Mirui consists of 8 core smart contracts that collectively support water infrastructure governance, vendor verification, usage tracking, and community sharing:

1. **Authority Verification Contract** – Validates and manages trusted public water entities
2. **Vendor Registry Contract** – Registers and rates private water vendors (e.g., borehole owners, tanker drivers)
3. **Water Credit Token Contract** – Tokenizes water units for payment and trading
4. **Consumer Profile Contract** – Maintains consumption data and KYC info for users
5. **Water Sharing Contract** – Enables peer-to-peer water access in community networks
6. **Subsidy Management Contract** – Distributes water subsidies transparently
7. **Maintenance Fund Contract** – Crowdfunds and audits infrastructure repairs
8. **Grievance Resolution DAO** – Decentralized reporting and resolution system

---

## **Features**

- Decentralized vendor verification and auditing
- Tokenized water credit exchange
- Smart subsidies for low-income users
- Community-based peer water sharing
- Real-time usage and payment records
- Transparent repair fund governance
- DAO-based dispute resolution and feedback

---

## **Smart Contracts**

### **1. Authority Verification Contract**

- Registers official water corporations
- Ensures legitimacy of public utility actors
- Stores metadata (zones, service levels, pricing)

### **2. Vendor Registry Contract**

- Registers local vendors (e.g., tankers, boreholes)
- Includes service radius, pricing, and user ratings
- Allows community voting on vendor legitimacy

### **3. Water Credit Token Contract**

- Tokenizes water (e.g., 1 token = 10 liters)
- Enables metered payments and credit transfers
- Supports wallet-to-wallet micro-payments

### **4. Consumer Profile Contract**

- Stores user location, tier (residential/commercial), and KYC
- Tracks water usage history and token balance
- Includes eligibility flags for subsidies

### **5. Water Sharing Contract**

- Allows households with surplus water to sell/share
- Peer-matching based on location and need
- Automated escrow and settlement logic

### **6. Subsidy Management Contract**

- Whitelists subsidy-eligible users
- Sends tokens based on tier, location, and status
- Verifiable government or NGO funding source

### **7. Maintenance Fund Contract**

- Accepts donations for public repair needs
- Triggers release based on DAO votes
- Budgeting proposals with audit trails

### **8. Grievance Resolution DAO**

- Users submit complaints (e.g., fake vendors, non-delivery)
- DAO votes on penalties, bans, or dispute arbitration
- Records all decisions immutably

---

## **Installation**

1. Install [Clarinet CLI](https://docs.stacks.co/docs/clarity/clarinet/)
2. Clone this repository  
3. Run tests:  
   ```bash
   clarinet test
   ```
4. Deploy contracts:
  ```bash
   clarinet deploy
   ```

## **Usage**
Each contract is modular and can be deployed independently. Contracts interact through defined interfaces, enabling custom use cases like local community-only water networks, decentralized subsidy distribution, or NGO-led transparency pilots.

See individual .clar files for detailed function usage.

## **Testing**

Tests are written in mock typescript test files and can be executed via npm:

```bash
npm test
```

## **License**

MIT License