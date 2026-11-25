# UPI statement data for PaisaLens (P1)

> **This data is fake. Never use your real bank statement.**
> A real statement holds your name, your account number and every person you paid.
> Your PaisaLens repository goes to GitHub, so anything in it can become public.

This folder makes a realistic but fake Indian bank statement for each student.
PaisaLens (P1) reads this file, cleans it and reports on it.

## What is in this folder

| File | What it is |
|---|---|
| `make_statement.py` | The generator: a small Python program with no packages. Docker runs it for you (below), so you install nothing. |
| `sample-statement.csv` | A 62-row sample, made with `--student SAMPLE --months 2`. Use it to try ideas. |
| `rules-example.json` | A starter rules file: merchant pattern to category. It covers about two thirds of the sample rows. |
| `test_make_statement.py` | Tests for the generator (Python's `pytest`), for the kit's maintainers. |

## Make your own statement

Run this in Git Bash. Put your own student id after `--student`.

Docker Desktop must be running.

```bash
cd ~/mern-ess-kit/data/upi
MSYS_NO_PATHCONV=1 docker run --rm -v "$PWD":/work -w /work python:3.12-alpine python make_statement.py --student <your student id> --months 6 --out statement.csv
```

You see a line such as `Wrote 191 rows (May 2026 to October 2026) to statement.csv`.

Then copy the file into your PaisaLens project. Go to your task folder first (the one that holds `paisalens/`):

```bash
mkdir -p paisalens/data
cp ~/mern-ess-kit/data/upi/statement.csv paisalens/data/statement.csv
```

Git ignores `statement.csv` inside the kit, so `git pull` keeps working.

### Running the kit's Python scripts with Docker

The generator is a small Python program. You do not install Python for it: Docker Desktop runs it in the official `python:3.12-alpine` image, which the first run downloads once (about 20 MB). The long line works like this:

| Part | Meaning |
|---|---|
| `MSYS_NO_PATHCONV=1` | Stops Git Bash from rewriting `/work` into a Windows path (`setup/windows.md`, the path rule) |
| `docker run --rm` | Start a container, and delete it when the script ends |
| `-v "$PWD":/work -w /work` | Show this folder inside the container as `/work`, and run there, so the CSV file lands in this folder |
| `python:3.12-alpine python make_statement.py ...` | The image, then the command it runs |

If you already have uv (from another course), `uv run make_statement.py ...` gives the same file.

The options:

| Option | Meaning | Default |
|---|---|---|
| `--student` | Your student id. Capital and small letters count as the same. | (required) |
| `--months` | How many months the statement covers, from 1 to 24. | `6` |
| `--out` | Where to write the CSV file. | `statement.csv` |
| `--end-month` | The last month in the statement, as `YYYY-MM`. | `2026-10` |

The same student id always gives exactly the same file, on any computer and with any Python version from 3.12.
Your mentor can make your file again to check your results.

## The columns

| Column | What it holds | Example |
|---|---|---|
| `date` | The day of the payment, as day/month/year. Split it at `/` into day, month and year numbers: `new Date("21/09/2026")` does not read this layout. | `21/09/2026` |
| `narration` | The bank's description of the payment. This is the messy column. | `UPI/DR/626404809305/SPOTIFY/UTIB/spotify@axisbank/Mandate Execute` |
| `upi_ref` | The 12-digit UPI reference number. It is empty for payments that are not UPI (salary, ATM cash, interest, bank charges). | `626404809305` |
| `debit` | Money that left the account, in rupees with 2 decimals. Empty on a credit row. | `119.00` |
| `credit` | Money that came into the account, in rupees with 2 decimals. Empty on a debit row. | `64400.00` |
| `balance` | The money in the account after this row, in rupees with 2 decimals. | `4894.58` |

PaisaLens keeps money in **paise as whole numbers** (integers): ₹119.00 is `11900` and ₹12.50 is `1250`.
Do not convert with `Number()` or `parseFloat()` and add the results: a JavaScript number cannot hold 0.1 exactly, so totals drift by a paisa here and there.
Split the text at the `.` into rupees and paise, and turn each part into a whole number.
Totals of whole paise stay exact up to `Number.MAX_SAFE_INTEGER`, far more money than any statement holds.

## What is messy, and why

Real bank exports are messy, and the hard part of P1 is dealing with that.
The generator copies the problems you meet in real files.

1. **Five narration layouts in one file.** Banks and payment apps write UPI payments differently. Your cleaner must handle all five:
   - `UPI/DR/624513611097/BIGBASKET/ICIC/bbdaily@icici/Sent using Payt`
   - `UPI-SURESH PATIL-suresh.patil58@axl-UTIB0000553-624721160719-RENT SEP`
   - `UPI/625520204640/Pay to merchant/ganeshkirana@okaxis/Axis Bank/ICI89687e7a0f9b`
   - `UPI/P2M/625712054046/Swiggy Limited/Sent using Paytm/AXIS BANK`
   - `UPI/ZOMATO/624917549707/Paid via PhonePe`
2. **The same merchant, written in different ways.** Banks print either the brand or the company's legal name. Swiggy appears as `SWIGGY`, `Swiggy Limited`, `SWIGGY FOOD` and `BUNDL TECHNOLOGIES`. BigBasket appears as `INNOVATIVE RETAIL CONCEPTS`. Ola appears as `ANI TECHNOLOGIES PVT LTD`.
3. **Names cut short.** One layout keeps only 20 characters of the name: `NETFLIX ENTERTAINMEN`, or `SHREE GANESH KIRANA ` with a space at the end.
4. **Merchants named only by their UPI id.** A small shop's QR code can show only an id such as `q781245536@ybl`, with no shop name.
5. **Rows that are not UPI payments.** Salary comes by NEFT (`NEFT CR-…-SALARY SEP 2026-…`). Cash comes from an ATM in three layouts (`ATW-…`, `NWD-…`, `ATM CASH WDL …`). The bank adds quarterly interest (`INT.PD:…`) and charges (`SMS CHGS QTR …`, `DC ANNUAL FEE …`). These rows have an empty `upi_ref`.
6. **Monthly subscriptions that move a little.** Netflix, Spotify, a gym and Airtel postpaid come every month, on nearly the same day. The day can move by one or two days, and the Airtel bill changes a little each month.
7. **Refunds and reversals.** A shop can send money back days later (a credit with `Refund` in it). A failed payment comes back the same day as a reversal: `REV-UPI-630209316383-SWIGGY-FAILED TXN`. The reversal names the original payment's reference number.
8. **Money between friends, in both directions.** A note can contain a comma, such as `dinner, cab`. The CSV file puts quotes around those narrations, so read it with a CSV parser (such as the `csv-parse` package), not with `line.split(",")`.
9. **Four broken rows, on purpose.** Every file has exactly 4, one of each kind:

   | Kind | What you see | Example |
   |---|---|---|
   | Bad date | A date that cannot exist | `31/09/2026` (September has 30 days) |
   | Empty amount | `debit` and `credit` are both empty, but the balance still changes | `,,14931.90` |
   | Text amount | The amount is text, not a number | `Rs.855/-` |
   | Duplicate | The same row twice, so one `upi_ref` appears twice | two rows with `628815356103` |

   Your code should not crash on these rows. It should set them aside and list them in an error report.

## Check the balance yourself

On every row: **balance of the row before − debit + credit = balance of this row**.
This is true for every row except the broken ones, so it is a good way to find them.

## The starter rules file

`rules-example.json` maps a piece of text (a pattern) to a category:

```json
{
  "refund": "Refunds",
  "swiggy": "Food delivery",
  "atw-": "Cash"
}
```

To use it, change the narration to small letters, then check each pattern in order. The first pattern found in the narration wins.
That is why `refund` comes before `amazon`: an Amazon refund is money coming back, not shopping.

The starter file is not complete on purpose. It finds 40 of the 62 rows in the sample.
Your job in P1 is to add patterns until almost every row has a category.
Be careful with short patterns: `ola` is also inside the word `cola`.

## Run the tests

For the kit's maintainers; students never need them. Docker Desktop must be running:

```bash
cd ~/mern-ess-kit/data/upi
MSYS_NO_PATHCONV=1 docker run --rm -v "$PWD":/work -w /work -e PYTHONDONTWRITEBYTECODE=1 python:3.12-alpine sh -c "pip install -q --root-user-action=ignore pytest && python -m pytest -q -p no:cacheprovider"
```

## Where the names come from

The big company names (Swiggy, Zomato, Amazon, Netflix and the others) are real, so the data feels real.
The people, the small shops, the gym `IRON ZONE GYM` and the employers are made up.
No row comes from a real person's account.
