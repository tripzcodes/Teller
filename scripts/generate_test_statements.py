#!/usr/bin/env python3
"""
Synthetic Bank Statement Generator
Generates realistic test bank statements for North American banks
"""

import random
import datetime
from typing import List, Tuple
from dataclasses import dataclass

@dataclass
class Transaction:
    date: datetime.date
    description: str
    amount: float
    balance: float
    type: str  # 'debit' or 'credit'

# Common merchant categories with realistic transaction amounts
MERCHANTS = {
    'groceries': [
        ('WALMART SUPERCENTER', 50, 200),
        ('TARGET STORE', 40, 150),
        ('WHOLE FOODS MARKET', 60, 180),
        ('TRADER JOES', 30, 100),
        ('SAFEWAY', 45, 150),
        ('KROGER', 50, 180),
    ],
    'dining': [
        ('STARBUCKS', 5, 15),
        ('MCDONALDS', 8, 20),
        ('CHIPOTLE MEXICAN GRILL', 12, 25),
        ('SUBWAY', 8, 18),
        ('PANERA BREAD', 10, 22),
        ('DOMINOS PIZZA', 15, 35),
    ],
    'gas': [
        ('SHELL OIL', 40, 80),
        ('CHEVRON', 45, 85),
        ('EXXON MOBIL', 42, 78),
        ('BP GAS STATION', 38, 75),
    ],
    'shopping': [
        ('AMAZON.COM', 20, 300),
        ('BEST BUY', 100, 500),
        ('MACYS', 50, 200),
        ('NORDSTROM', 80, 400),
    ],
    'utilities': [
        ('PACIFIC GAS ELECTRIC', 80, 150),
        ('COMCAST CABLE', 90, 120),
        ('VERIZON WIRELESS', 70, 100),
        ('AT&T', 65, 95),
    ],
    'entertainment': [
        ('NETFLIX.COM', 15, 20),
        ('SPOTIFY USA', 10, 15),
        ('AMC THEATERS', 25, 50),
    ],
}

INCOME_SOURCES = [
    ('DIRECT DEPOSIT PAYROLL', 2000, 5000),
    ('ACH DEPOSIT', 1000, 3000),
    ('MOBILE DEPOSIT', 500, 2000),
]

def generate_transactions(num_transactions: int, start_date: datetime.date,
                         initial_balance: float = 5000.0) -> List[Transaction]:
    """Generate realistic transaction history"""
    transactions = []
    current_balance = initial_balance
    current_date = start_date

    for i in range(num_transactions):
        # 80% debits, 20% credits
        is_credit = random.random() < 0.2

        if is_credit:
            merchant, min_amt, max_amt = random.choice(INCOME_SOURCES)
            amount = round(random.uniform(min_amt, max_amt), 2)
            current_balance += amount
            txn_type = 'credit'
        else:
            category = random.choice(list(MERCHANTS.keys()))
            merchant, min_amt, max_amt = random.choice(MERCHANTS[category])
            # Add location identifiers
            location = random.choice(['#123', '#456', '#789', 'STORE 001', 'LOC 234'])
            merchant = f"{merchant} {location}"
            amount = round(random.uniform(min_amt, max_amt), 2)
            current_balance -= amount
            txn_type = 'debit'

        transactions.append(Transaction(
            date=current_date,
            description=merchant,
            amount=amount,
            balance=current_balance,
            type=txn_type
        ))

        # Move to next day (with some gaps)
        current_date += datetime.timedelta(days=random.randint(1, 3))

    return transactions

def format_chase_statement(transactions: List[Transaction],
                          account_num: str = "****1234") -> str:
    """Format as Chase Bank statement"""
    output = []
    output.append("=" * 80)
    output.append("CHASE BANK")
    output.append("Monthly Statement")
    output.append(f"Account Number: {account_num}")
    output.append(f"Statement Period: {transactions[0].date} to {transactions[-1].date}")
    output.append("=" * 80)
    output.append("")
    output.append(f"{'Date':<12} {'Description':<40} {'Amount':<15} {'Balance':<15}")
    output.append("-" * 80)

    for txn in transactions:
        date_str = txn.date.strftime("%m/%d/%Y")
        amount_str = f"${txn.amount:,.2f}" if txn.type == 'credit' else f"-${txn.amount:,.2f}"
        balance_str = f"${txn.balance:,.2f}"
        output.append(f"{date_str:<12} {txn.description:<40} {amount_str:<15} {balance_str:<15}")

    output.append("-" * 80)
    output.append(f"Ending Balance: ${transactions[-1].balance:,.2f}")
    output.append("")

    return "\n".join(output)

def format_wells_fargo_statement(transactions: List[Transaction],
                                 account_num: str = "****5678") -> str:
    """Format as Wells Fargo statement"""
    output = []
    output.append("=" * 80)
    output.append("WELLS FARGO")
    output.append("Account Statement")
    output.append(f"Account: {account_num}")
    output.append(f"Period: {transactions[0].date.strftime('%B %d, %Y')} - {transactions[-1].date.strftime('%B %d, %Y')}")
    output.append("=" * 80)
    output.append("")
    output.append(f"{'Transaction Date':<20} {'Description':<35} {'Debits':<12} {'Credits':<12} {'Balance':<12}")
    output.append("-" * 80)

    for txn in transactions:
        date_str = txn.date.strftime("%m/%d/%Y")
        debit_str = f"${txn.amount:,.2f}" if txn.type == 'debit' else ""
        credit_str = f"${txn.amount:,.2f}" if txn.type == 'credit' else ""
        balance_str = f"${txn.balance:,.2f}"
        output.append(f"{date_str:<20} {txn.description:<35} {debit_str:<12} {credit_str:<12} {balance_str:<12}")

    output.append("-" * 80)

    total_debits = sum(t.amount for t in transactions if t.type == 'debit')
    total_credits = sum(t.amount for t in transactions if t.type == 'credit')

    output.append(f"Total Debits: ${total_debits:,.2f}")
    output.append(f"Total Credits: ${total_credits:,.2f}")
    output.append(f"Ending Balance: ${transactions[-1].balance:,.2f}")
    output.append("")

    return "\n".join(output)

def format_bofa_statement(transactions: List[Transaction],
                         account_num: str = "****9012") -> str:
    """Format as Bank of America statement"""
    output = []
    output.append("=" * 80)
    output.append("BANK OF AMERICA")
    output.append("Statement of Account")
    output.append(f"Account Number: {account_num}")
    output.append(f"Statement Date: {transactions[-1].date.strftime('%B %d, %Y')}")
    output.append("=" * 80)
    output.append("")
    output.append("TRANSACTION DETAIL")
    output.append("")
    output.append(f"{'Date':<15} {'Description':<45} {'Amount':<20}")
    output.append("-" * 80)

    for txn in transactions:
        date_str = txn.date.strftime("%m/%d/%Y")
        amount_str = f"${txn.amount:,.2f}" if txn.type == 'credit' else f"-${txn.amount:,.2f}"
        output.append(f"{date_str:<15} {txn.description:<45} {amount_str:<20}")

    output.append("-" * 80)
    output.append("")
    output.append(f"Beginning Balance: ${transactions[0].balance + (transactions[0].amount if transactions[0].type == 'debit' else -transactions[0].amount):,.2f}")
    output.append(f"Ending Balance: ${transactions[-1].balance:,.2f}")
    output.append("")

    return "\n".join(output)

def format_citibank_statement(transactions: List[Transaction],
                              account_num: str = "****3456") -> str:
    """Format as Citibank statement"""
    output = []
    output.append("=" * 80)
    output.append("CITIBANK")
    output.append("Monthly Account Statement")
    output.append(f"Account: {account_num}")
    output.append(f"From {transactions[0].date.strftime('%d %b %Y')} to {transactions[-1].date.strftime('%d %b %Y')}")
    output.append("=" * 80)
    output.append("")
    output.append(f"{'Date':<12} {'Transaction Details':<40} {'Amount':<15} {'Balance':<15}")
    output.append("-" * 80)

    for txn in transactions:
        date_str = txn.date.strftime("%d %b %Y")
        amount_str = f"${txn.amount:,.2f}" if txn.type == 'credit' else f"(${txn.amount:,.2f})"
        balance_str = f"${txn.balance:,.2f}"
        output.append(f"{date_str:<12} {txn.description:<40} {amount_str:<15} {balance_str:<15}")

    output.append("-" * 80)
    output.append(f"Closing Balance: ${transactions[-1].balance:,.2f}")
    output.append("")

    return "\n".join(output)

def main():
    """Generate sample statements for all major NA banks"""

    # Generate transaction data
    start_date = datetime.date(2024, 1, 1)
    transactions = generate_transactions(50, start_date, initial_balance=5000.0)

    # Create output directory
    import os
    output_dir = "test_statements"
    os.makedirs(output_dir, exist_ok=True)

    # Generate statements for different banks
    banks = [
        ("chase", format_chase_statement),
        ("wells_fargo", format_wells_fargo_statement),
        ("bank_of_america", format_bofa_statement),
        ("citibank", format_citibank_statement),
    ]

    for bank_name, formatter in banks:
        statement = formatter(transactions)
        filename = f"{output_dir}/{bank_name}_statement.txt"
        with open(filename, 'w') as f:
            f.write(statement)
        print(f"Generated: {filename}")

    print(f"\nGenerated {len(banks)} test statements in '{output_dir}/' directory")
    print(f"Each statement contains {len(transactions)} transactions")

if __name__ == "__main__":
    main()
