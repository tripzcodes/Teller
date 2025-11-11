#!/usr/bin/env python3
"""
Convert synthetic bank statements to PDF format
"""

import os
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from generate_test_statements import (
    generate_transactions,
    format_chase_statement,
    format_wells_fargo_statement,
    format_bofa_statement,
    format_citibank_statement
)
import datetime

def create_pdf_from_text(text_content: str, output_filename: str, bank_name: str):
    """Create PDF from text statement"""
    c = canvas.Canvas(output_filename, pagesize=letter)
    width, height = letter

    # Start position
    y_position = height - 50

    # Split content into lines
    lines = text_content.split('\n')

    # Font settings
    c.setFont("Courier", 9)

    for line in lines:
        # Check if we need a new page
        if y_position < 50:
            c.showPage()
            c.setFont("Courier", 9)
            y_position = height - 50

        # Draw the line
        c.drawString(40, y_position, line)
        y_position -= 12

    c.save()
    print(f"Generated PDF: {output_filename}")

def main():
    """Generate PDF statements for all banks"""

    # Create output directory
    output_dir = "test_statements/pdf"
    os.makedirs(output_dir, exist_ok=True)

    # Generate transaction data (same data for all banks for comparison)
    start_date = datetime.date(2024, 1, 1)
    transactions = generate_transactions(50, start_date, initial_balance=5000.0)

    # Generate PDFs for different banks
    banks = [
        ("Chase Bank", "chase", format_chase_statement, "****1234"),
        ("Wells Fargo", "wells_fargo", format_wells_fargo_statement, "****5678"),
        ("Bank of America", "bank_of_america", format_bofa_statement, "****9012"),
        ("Citibank", "citibank", format_citibank_statement, "****3456"),
    ]

    for bank_display_name, bank_id, formatter, account in banks:
        # Generate text statement
        statement_text = formatter(transactions, account)

        # Create PDF
        pdf_filename = f"{output_dir}/{bank_id}_statement.pdf"
        create_pdf_from_text(statement_text, pdf_filename, bank_display_name)

    print(f"\n✓ Generated {len(banks)} PDF statements in '{output_dir}/' directory")
    print(f"✓ Each statement contains {len(transactions)} transactions")
    print(f"✓ Transaction data spans from {transactions[0].date} to {transactions[-1].date}")

    # Print summary
    total_debits = sum(t.amount for t in transactions if t.type == 'debit')
    total_credits = sum(t.amount for t in transactions if t.type == 'credit')
    print(f"\nStatement Summary:")
    print(f"  Total Debits: ${total_debits:,.2f}")
    print(f"  Total Credits: ${total_credits:,.2f}")
    print(f"  Ending Balance: ${transactions[-1].balance:,.2f}")

if __name__ == "__main__":
    main()
