# Reach Out Page with a Licence-Free Form

Create a **Reach Out** page on the Document Authoring test site (`da-eds-chefspage`). It has a simple form for first name, last name, mobile number and email, and saves every submission as a row in **your Google Sheet**:
https://docs.google.com/spreadsheets/d/1-ub4HcZfjFBr_wbrqb3ZBV0SFPqLcNfY1EUfGDpWjQc/edit?gid=0#gid=0

It doesn't use the Adaptive Forms block or Adobe's Forms Submission Service, so no AEM Forms licence is needed.

> Plan mode is on. To start building, switch to Execute mode.

## Decisions
| Topic | Choice |
|---|---|
| Form technology | A new lightweight block, `reach-out-form`, using plain HTML form fields and a little JavaScript. It's separate from the existing Adaptive Forms block. |
| Where submissions go | Your Google Sheet (ID `1-ub4HcZfjFBr_wbrqb3ZBV0SFPqLcNfY1EUfGDpWjQc`), first tab (`gid=0`), written by a small free Google Apps Script attached to that sheet |
| Site | `da-eds-chefspage`, the Document Authoring test site |
| Page location | `https://da.live/#/prakrutikk/da-eds-chefspage/reach-out`, previewed at `https://main--da-eds-chefspage--prakrutikk.aem.page/reach-out` |
| Spam protection | None for now, as you chose |

## Form fields
| # | Label | Field name | Input type | Required | Validation |
|---|---|---|---|---|---|
| 1 | First name | `firstName` | text | Yes | 1–50 characters |
| 2 | Last name | `lastName` | text | Yes | 1–50 characters |
| 3 | Mobile number | `mobile` | tel | Yes | Optional leading `+`, 8–15 digits |
| 4 | Email | `email` | email | Yes | Valid email format |
| 5 | Send | — | submit button | — | Disabled while sending |

- **Success:** "Thank you! We'll be in touch soon." replaces the form.
- **Failure:** "Something went wrong. Please try again." appears, and the entered values stay in the form.
- **Errors:** each field shows its own message next to it. Fields are labelled for screen readers and error messages are announced.

## How it works
1. **The visitor submits the form.** The block checks the fields in the browser, then sends the data to the Apps Script web app address.
2. **Apps Script saves it.** The script, attached to your sheet, checks the values again and adds a row to the first tab: Timestamp, First name, Last name, Mobile, Email, Page. If row 1 is empty, it writes these headers first. It replies "ok" or an error.
3. **The page shows the result:** the success or failure message.

The sheet stays private in your Google account. The web app address is public but can only add rows: nobody can read the sheet through it. I can't open your sheet myself, since it's private to your Google account, so the script setup has to be done from your account.

## What authors control
In the Document Authoring page, the block is a small table:

| Reach Out Form | |
|---|---|
| endpoint | *(Apps Script web app URL)* |
| success message | Thank you! We'll be in touch soon. *(optional)* |

Authors can change the address or the message without a code change. The four fields are fixed in the block's code to keep it simple.

## What you'll need to do (about 5 minutes, in your Google account)
1. Open your sheet: https://docs.google.com/spreadsheets/d/1-ub4HcZfjFBr_wbrqb3ZBV0SFPqLcNfY1EUfGDpWjQc/edit
2. Leave row 1 of the first tab empty, or add `Timestamp | First name | Last name | Mobile | Email | Page`. The script fills in the headers if row 1 is empty.
3. Open **Extensions → Apps Script**, delete the sample code and paste the script I'll provide. Click **Save**.
4. Click **Deploy → New deployment**, choose type **Web app**, and set **Execute as: Me** and **Who has access: Anyone**. Click **Deploy** and allow the permissions Google asks for.
5. Copy the **Web app URL** (it ends in `/exec`) and send it to me. It's a public submission address, not a password, so it's fine to share. Don't share any Google passwords or keys.

## Risks and notes
- **No spam protection:** bots can add junk rows. A hidden honeypot field can be added later without changing the setup.
- **Personal data:** names, numbers and emails sit in your Google Sheet, so be careful who you share it with. Consider adding a privacy notice line to the page.
- **The first tab is used:** if you rename or reorder tabs, the script still writes to whichever tab has `gid=0`.
- **Google limits:** Apps Script has free daily quotas, which are plenty for a contact form.
- **Changing the script later:** use **Deploy → Manage deployments → Edit → New version**, which keeps the same URL. Creating a brand-new deployment gives a new URL, and the page would then need updating.
- **Main site:** this is built on the test site first. Moving it to `eds-chefspage` later means adding the block there and creating the page in AEM.

## Checklist
- [ ] Create the `reach-out-form` block with the four fields, client-side validation, and success and error messages
- [ ] Make the block read the endpoint and optional success message from its table
- [ ] Make the form accessible: labels, required markers, announced error messages
- [ ] Style the block to match the site, mobile first
- [ ] Test it in the local preview with a simulated endpoint: empty fields, bad mobile, bad email, a valid submission and a failed submission
- [ ] Run the lint and fix any issues
- [ ] Write the Google Apps Script for your sheet: write to the `gid=0` tab, add headers if missing, check values server-side, append the row, return JSON. Hand it to you with setup steps
- [ ] Commit the block to `aem-20260527-1612` and push, after confirming with you
- [ ] Add the block to the test-site code and push it to the `main` branch of `da-eds-chefspage`
- [ ] You: add the script to your sheet, deploy it as a web app and send me the `/exec` URL
- [ ] Create the `/reach-out` page in Document Authoring with a heading, intro, the Reach Out Form block (endpoint and success message) and page details
- [ ] Preview `/reach-out` on the test site and check the form renders
- [ ] Send one real test submission and confirm the row appears in your Google Sheet
- [ ] Share the page, preview link and editing instructions
