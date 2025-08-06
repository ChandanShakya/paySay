# PaySay - Expense Sharing System

PaySay is a Laravel-based expense tracking and settlement system tailored for small teams or office groups who share daily costs, like meals. The system handles expense entries, user shares, settlements, and authentication through secure OTP.

---

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [System Architecture](#system-architecture)
- [PlantUML Diagram](#plantuml-diagram)
- [Models & Migrations](#models--migrations)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)

---

## Overview
PaySay allows office colleagues to track who paid for shared expenses, divide those expenses fairly, and log settlements over time. Admins manage the system securely using TOTP-based authentication, and access is limited by IP whitelisting.

---

## Features
- Expense logging and itemized breakdown
- Individual or group sharing of expense items
- Auto-calculated user shares
- Payment settlements
- TOTP-based admin authentication (no passwords)
- IP whitelist for access control
- Simple, clear UI

---

## System Architecture
- Built with **Laravel**
- Uses **Eloquent ORM**
- Modular services for TOTP and QR code
- Admin access secured with **TOTP secret** and IP control

---

## PlantUML Diagram
The following diagram represents the full database and service structure:

```plantuml
@startuml
skinparam classAttributeIconSize 0

!define Model(x) << (M,#ADD8E6) x >>
!define Service(x) << (S,#90EE90) x >>

class Admin Model("Authenticatable") {
    +id : unsignedBigInteger <<PK>>
    +totp_secret : string(255) [0..1]
    +created_at : timestamp
    +updated_at : timestamp
    +deleted_at : timestamp [0..1]
}

class User Model("Model") {
    +id : unsignedBigInteger <<PK>>
    +name : string(255)
    +email : string(255)
    +created_at : timestamp
    +updated_at : timestamp
}

class Expense Model("Model") {
    +id : unsignedBigInteger <<PK>>
    +date : date
    +description : string(255)
    +total_amount : decimal(10,2)
    +details : text
    +payer_id : unsignedBigInteger <<FK>>
    +created_at : timestamp
    +updated_at : timestamp
    +deleted_at : timestamp [0..1]
}

class ExpenseItem Model("Model") {
    +id : unsignedBigInteger <<PK>>
    +expense_id : unsignedBigInteger <<FK>>
    +item_name : string(255)
    +quantity : integer
    +unit_price : decimal(10,2)
    +total_price : decimal(10,2)
    +created_at : timestamp
    +updated_at : timestamp
}

class ExpenseItemUser Model("Model") {
    +expense_item_id : unsignedBigInteger <<PK,FK>>
    +user_id : unsignedBigInteger <<PK,FK>>
    +share_amount : decimal(10,2)
    +share_percent : decimal(5,2)
    +created_at : timestamp
    +updated_at : timestamp
}

class ExpenseUser Model("Model") {
    +expense_id : unsignedBigInteger <<PK,FK>>
    +user_id : unsignedBigInteger <<PK,FK>>
    +share_amount : decimal(10,2)
    +share_percent : decimal(5,2)
    +created_at : timestamp
    +updated_at : timestamp
}

class Settlement Model("Model") {
    +id : unsignedBigInteger <<PK>>
    +from_user_id : unsignedBigInteger <<FK>>
    +to_user_id : unsignedBigInteger <<FK>>
    +amount : decimal(10,2)
    +settled_at : timestamp
    +created_at : timestamp
    +updated_at : timestamp
    +deleted_at : timestamp [0..1]
}

class IPWhitelist Model("Model") {
    +id : unsignedBigInteger <<PK>>
    +ip_address : string(45)
    +description : string(255) [0..1]
    +created_at : timestamp
    +updated_at : timestamp
}

class TOTPService Service("Service") {
    +generateSecret() : string
    +verifyCode(secret:string, code:string) : boolean
}

class QRCodeService Service("Service") {
    +generateQR(secret:string) : image
}

Admin --|> User
Admin "1" -- "0..*" Expense : creates
Expense "*" -- "1" Admin : payer
Expense "1" -- "0..*" ExpenseItem : contains
ExpenseItem "1" -- "0..*" ExpenseItemUser : split to users
User "*" -- "0..*" ExpenseItemUser : owns items
User "*" -- "0..*" ExpenseUser : participates
Expense "*" -- "0..*" ExpenseUser : split
User "1" -- "0..*" Settlement : initiates
User "1" -- "0..*" Settlement : receives
Admin "1" -- "0..*" IPWhitelist : manages
Admin ..> TOTPService : uses
Admin ..> QRCodeService : uses
@enduml
```

---

## Models & Migrations
Each Eloquent model has a corresponding migration. Below are the core models:

### Admin
- Uses TOTP for authentication
- No name/email/password fields

### User
- Name and email fields

### Expense
- Tracks shared expense
- Links to user (payer)

### ExpenseItem
- Itemized entries for each expense

### ExpenseItemUser
- Links specific item shares to individual users

### ExpenseUser
- Pivot table with each user’s share of an entire expense

### Settlement
- Tracks payments made between users to settle balances

### IPWhitelist
- Allows access only from whitelisted public IPs

---

## Installation
```bash
git clone https://github.com/your-username/paysay.git
cd paysay
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
```

---

## Usage
1. Access the app from a whitelisted IP
2. Admin scans QR and sets up TOTP in an authenticator app
3. Start logging expenses, assigning shares, and settling payments

---

## License
This project is open-source and available under the [MIT License](LICENSE).

---

**Moto:** *"Track. Split. Settle."*
